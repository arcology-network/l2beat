import { Logger } from '@l2beat/backend-tools'
import {
  AllProviders,
  ConfigReader,
  DiscoveryConfig,
  DiscoveryEngine,
  toDiscoveryOutput,
} from '@l2beat/discovery'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { assert } from '@l2beat/shared-pure'
import { isError } from 'lodash'
import { Gauge, Histogram } from 'prom-client'

export interface DiscoveryRunnerOptions {
  logger: Logger
  injectInitialAddresses: boolean
  maxRetries?: number
  retryDelayMs?: number
}

// 10 minutes
const MAX_RETRIES = 30
const RETRY_DELAY_MS = 20_000

export class DiscoveryRunner {
  constructor(
    private readonly allProviders: AllProviders,
    private readonly discoveryEngine: DiscoveryEngine,
    private readonly configReader: ConfigReader,
    readonly chain: string,
  ) {}

  async getBlockNumber(): Promise<number> {
    return await this.allProviders.getLatestBlockNumber(this.chain)
  }

  async run(
    projectConfig: DiscoveryConfig,
    blockNumber: number,
    options: DiscoveryRunnerOptions,
  ) {
    const config = options.injectInitialAddresses
      ? await this.updateInitialAddresses(projectConfig)
      : projectConfig

    const discovery = await this.discoverWithRetry(
      config,
      blockNumber,
      options.logger,
      options.maxRetries,
      options.retryDelayMs,
    )

    return discovery
  }

  private async discover(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<DiscoveryOutput> {
    const histogramDone = syncHistogram.startTimer()

    const provider = this.allProviders.get(config.chain, blockNumber)
    const result = await this.discoveryEngine.discover(provider, config)

    histogramDone({ project: config.name })
    latestBlock.set({ project: config.name }, blockNumber)

    return toDiscoveryOutput(
      config.name,
      config.chain,
      config.hash,
      blockNumber,
      result,
    )
  }

  async discoverWithRetry(
    config: DiscoveryConfig,
    blockNumber: number,
    logger: Logger,
    maxRetries = MAX_RETRIES,
    delayMs = RETRY_DELAY_MS,
  ): Promise<DiscoveryOutput> {
    let discovery: DiscoveryOutput | undefined = undefined
    let err: Error | undefined = undefined

    for (let i = 0; i <= maxRetries; i++) {
      try {
        discovery = await this.discover(config, blockNumber)
        break
      } catch (error) {
        err = isError(err) ? (error as Error) : new Error(JSON.stringify(error))
      }

      const errorString = JSON.stringify(
        err,
        Object.getOwnPropertyNames(err),
        2,
      )
      logger.warn(
        `DiscoveryRunner: Retrying ${config.name} (chain: ${config.chain}) | attempt:${i} | error:${errorString}`,
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }

    if (discovery === undefined) {
      assert(
        err !== undefined,
        'Programmer error: Error should not be undefined there',
      )
      throw err
    }

    return discovery
  }

  // There was a case connected with Amarok (better described in L2B-1521)
  // the problem was with stack too deep in the discovery caused by misconfigured new contract
  // that had a lot of relatives (e.g. Uniswap, DAI)
  // unfortunately, it resulted in not discovering important contracts because they cannot be put on the stack
  // this function ensures that initial addresses are taken from discovered.json
  // so this way we will always discover "known" contracts
  async updateInitialAddresses(config: DiscoveryConfig) {
    const discovery = this.configReader.readDiscovery(config.name, this.chain)
    const initialAddresses = discovery.contracts.map((c) => c.address)
    return new DiscoveryConfig({
      ...config.raw,
      initialAddresses,
      maxAddresses: (config.raw.maxAddresses ?? 200) * 3,
      maxDepth: (config.raw.maxDepth ?? 6) * 3,
    })
  }
}

const latestBlock = new Gauge({
  name: 'discovery_last_synced',
  help: 'Value showing latest block number with which UpdateMonitor was run',
  labelNames: ['project'],
})

const syncHistogram = new Histogram({
  name: 'discovery_sync_duration_histogram',
  help: 'Histogram showing discovery duration',
  labelNames: ['project'],
  buckets: [2, 4, 6, 8, 10, 15, 20, 30, 60, 120],
})
