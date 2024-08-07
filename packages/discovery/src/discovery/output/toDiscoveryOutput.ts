import { DiscoveryOutput } from '@l2beat/discovery-types'
import { Hash256 } from '@l2beat/shared-pure'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import { DISCOVERY_LOGIC_VERSION } from '../engine/DiscoveryEngine'

export function toDiscoveryOutput(
  name: string,
  chain: string,
  configHash: Hash256,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  return {
    name,
    chain,
    blockNumber,
    configHash,
    version: DISCOVERY_LOGIC_VERSION,
    ...processAnalysis(results),
  }
}

export function setToArray<T>(set?: Set<T>): T[] | undefined {
  if (set === undefined) {
    return undefined
  }
  return Array.from(set)
}

export function processAnalysis(
  results: Analysis[],
): Omit<
  DiscoveryOutput,
  'name' | 'blockNumber' | 'configHash' | 'version' | 'chain'
> {
  // DO NOT CHANGE BELOW CODE UNLESS YOU KNOW WHAT YOU ARE DOING!
  // CHANGES MIGHT TRIGGER UPDATE MONITOR FALSE POSITIVES!

  const { contracts, abis } = getContracts(results)
  return {
    contracts: contracts
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x) =>
        withoutUndefinedKeys({
          name: x.name,
          address: x.address,
          unverified: x.isVerified ? undefined : (true as const),
          template: x.extendedTemplate?.template,
          upgradeability: x.upgradeability,
          descriptions: x.combinedMeta?.descriptions,
          roles: setToArray(x.combinedMeta?.roles),
          categories: x.combinedMeta?.categories,
          types: x.combinedMeta?.types,
          severity: x.combinedMeta?.severity,
          assignedPermissions: x.combinedMeta?.permissions,
          ignoreInWatchMode: x.ignoreInWatchMode,
          implementations:
            Object.keys(x.implementations).length === 0
              ? undefined
              : x.implementations,
          sinceTimestamp: x.deploymentTimestamp?.toNumber(),
          values:
            Object.keys(x.values).length === 0
              ? undefined
              : sortByKeys(x.values),
          errors:
            Object.keys(x.errors).length === 0
              ? undefined
              : sortByKeys(x.errors),
          derivedName: x.derivedName,
          usedTypes: x.usedTypes?.length === 0 ? undefined : x.usedTypes,
        }),
      ),
    eoas: results
      .filter((x) => x.type === 'EOA')
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x) => ({
        address: x.address,
        descriptions: x.combinedMeta?.descriptions,
        roles: setToArray(x.combinedMeta?.roles),
        categories: x.combinedMeta?.categories,
        types: x.combinedMeta?.types,
        severity: x.combinedMeta?.severity,
        assignedPermissions: x.combinedMeta?.permissions,
      })),
    abis,
  }
}

function getContracts(results: Analysis[]): {
  contracts: AnalyzedContract[]
  abis: Record<string, string[]>
} {
  let abis: Record<string, string[]> = {}
  const contracts: AnalyzedContract[] = []
  for (const result of results) {
    if (result.type === 'Contract') {
      contracts.push(result)
      abis = { ...abis, ...result.abis }
    }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )
  return { contracts, abis }
}

function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, convertSetToSortedArray)) as T
}

export function sortByKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  ) as T
}

function convertSetToSortedArray(_key: string, value: unknown) {
  if (value instanceof Set) {
    return Array.from(value).sort()
  }
  return value
}
