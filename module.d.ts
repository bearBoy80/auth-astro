declare module 'auth:config' {
	const config: import('./src/config').FullAuthConfig
	export default config
}
declare module 'auth-astro' {
	const index: import('./index').Integration

	type FullAuthConfig = import('./src/config').FullAuthConfig
	type AuthHook = import('./src/config').AuthHook

	const defineConfig: (config: FullAuthConfig) => FullAuthConfig
	export default index
	export { defineConfig, type FullAuthConfig, type AuthHook }
}

