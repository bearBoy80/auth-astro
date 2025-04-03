# Auth Astro D1

Auth Astro D1 is a fork of [auth-astro](https://github.com/nowaythatworked/auth-astro) that adds Cloudflare D1 database support and runtime configuration capabilities. It wraps the core of [Auth.js](https://authjs.dev/) into an Astro integration, which automatically adds the endpoints and handles everything else.

> [!NOTE]
> This is a fork of the original [auth-astro](https://github.com/nowaythatworked/auth-astro) repository with additional features and fixes.

## Fork Information

This fork includes the following improvements:

- Added runtime configuration support through hooks
- Added Cloudflare D1 database support
- Fixed type definitions for better TypeScript support
- Added support for dynamic database adapters

Original Repository: [nowaythatworked/auth-astro](https://github.com/nowaythatworked/auth-astro)

## Installation

The easiest way to get started is adding this package using the astro cli. 

```bash
npm run astro add auth-astro-d1
```
This will install the package and required peer-dependencies and add the integration to your config.
You can now jump to [configuration](#configuration)

Alternatively, you can install the required packages on your own.

```bash
npm install auth-astro-d1@latest @auth/core@^0.18.6
```
> [!NOTE]  
> If you´re using `pnpm` you must also install cookie: `pnpm i cookie`

## Configuration

Create your [auth configuration](https://authjs.dev/getting-started/providers/oauth-tutorial) file in the root of your project.

```ts title="auth.config.ts"
// auth.config.ts
import GitHub from '@auth/core/providers/github'
import { defineConfig } from 'auth-astro'
import { D1Adapter } from '@auth/d1-adapter'

export default defineConfig({
	providers: [
		GitHub({
			clientId: import.meta.env.GITHUB_CLIENT_ID,
			clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
		}),
	],
	// Add hook for runtime configuration
	hook: async (config, context) => {
		// Get D1 instance from context
		const d1 = context.locals.DB
		return {
			...config,
			adapter: D1Adapter(d1)
		}
	}
})
```

### Runtime Configuration

This fork adds support for runtime configuration through hooks. The hook function receives the current configuration and the request context, allowing you to modify the configuration at runtime.

```ts
hook: async (config, context) => {
	// Access request context
	const { request, locals } = context
	
	// Modify configuration
	return {
		...config,
		// Add your modifications here
	}
}
```

### Cloudflare D1 Support

To use Cloudflare D1 with this fork:

1. Configure your Astro project to use the Cloudflare adapter:

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		runtime: {
			mode: 'local',
			type: 'pages',
			bindings: {
				DB: 'your-d1-database'
			}
		}
	})
})
```

2. Use the hook to configure the D1 adapter:

```ts
hook: async (config, context) => {
	const d1 = context.locals.DB
	return {
		...config,
		adapter: D1Adapter(d1)
	}
}
```

### Setup Environment Variables

Generate an auth secret by running `openssl rand -hex 32` in a local terminal or by visiting [generate-secret.vercel.app](https://generate-secret.vercel.app/32), copy the string, then set it as the `AUTH_SECRET` environment variable describe below.

Next, set the `AUTH_TRUST_HOST` environment variable to `true` for hosting providers like Cloudflare Pages or Netlify.
```sh
AUTH_SECRET=<auth-secret>
AUTH_TRUST_HOST=true
```

#### Deploying to Vercel?
Setting `AUTH_TRUST_HOST` is not needed, as we also check for an active Vercel environment.

### Requirements
- Node version `>= 17.4`
- Astro config set to output mode `server`
- [SSR](https://docs.astro.build/en/guides/server-side-rendering/) enabled in your Astro project

Resources:
- [Enabling SSR in Your Project](https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project)
- [Adding an Adapter](https://docs.astro.build/en/guides/server-side-rendering/#adding-an-adapter)

# Usage

Your authentication endpoints now live under `[origin]/api/auth/[operation]`. You can change the prefix in the configuration.

## Accessing your configuration

In case you need to access your auth configuration, you can always import it by
```ts
import authConfig from 'auth:config'
```

## Sign in & Sign out

Astro Auth exposes two ways to sign in and out. Inline scripts and Astro Components.

### With Inline script tags

The `signIn` and `signOut` methods can be imported dynamically in an inline script.

```html
---
---
<html>
<body>
  <button id="login">Login</button>
  <button id="logout">Logout</button>

  <script>
    const { signIn, signOut } = await import("auth-astro/client")
    document.querySelector("#login").onclick = () => signIn("github")
    document.querySelector("#logout").onclick = () => signOut()
  </script>
</body>
</html>
```
### With auth-astro's Components

Alternatively, you can use the `SignIn` and `SignOut` button components provided by `auth-astro/components` importing them into your Astro [component's script](https://docs.astro.build/en/core-concepts/astro-components/#the-component-script) 

```jsx
---
import { SignIn, SignOut } from 'auth-astro/components'
---
<html>
  <body>
    ...
    <SignIn provider="github" />
    <SignOut />
    ...
  </body>
</html>
```

## Fetching the session

You can fetch the session in one of two ways. The `getSession` method can be used in the component script section to fetch the session.

### Within the component script section

```tsx title="src/pages/index.astro"
---
import { getSession } from 'auth-astro/server';

const session = await getSession(Astro.request)
---
{session ? (
  <p>Welcome {session.user?.name}</p>
) : (
  <p>Not logged in</p>
)}
```
### Within the Auth component

Alternatively, you can use the `Auth` component to fetch the session using a render prop.

```tsx title="src/pages/index.astro"
---
import type { Session } from '@auth/core/types';
import { Auth, SignIn, SignOut } from 'auth-astro/components';
---
<Auth>
  {(session: Session) => 
    {session ? 
      <SignOut>Logout</SignOut>
    :
      <SignIn provider="github">Login</SignIn>
    }

    <p>
      {session ? `Logged in as ${session.user?.name}` : 'Not logged in'}
    </p>
  }
</Auth>
```

# State of Project

We currently are waiting for the [PR](https://github.com/nextauthjs/next-auth/pull/9856) in the official [next-auth](https://github.com/nextauthjs/next-auth/) repository to be merged. Once this has happened, this package will be deprecated. 

# Contribution
Waiting on the PR to be merged means, we can still add new features to the PR, so, if you miss anything feel free to open a PR or issue in this repo, and we will try to get it added to the official package.
