import integration from './src/integration'
import type { FullAuthConfig, AuthHook } from './src/config'

export type Integration = typeof integration
export type { FullAuthConfig, AuthHook }
export default integration
export { defineConfig } from './src/config'
