import { ZkCatalogProject } from './types/ZkCatalogProject'
import { worldcoinsemaphore } from './worldcoinsemaphore'
import { worldcoinsmtb } from './worldcoinsmtb'

export * from './types'
export * from './common'

export const zkCatalogProjects: ZkCatalogProject[] = [
  worldcoinsemaphore,
  worldcoinsmtb,
]
