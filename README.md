# Auth Astro

Auth Astro is the easiest way to add Authentication to your Astro Project. It wraps the core of [Auth.js](https://authjs.dev/) into an Astro integration which automatically adds the endpoints and handles everything else.

(**disclaimer**: Please don´t confuse this package with [astro-auth](https://github.com/astro-community/astro-auth))

# Installation

The easiest way to get started is adding this package using the astro cli. 

```bash
npm run astro add auth-astro
```
This will install the package and required peer-dependencies and add the integration to your config.
You can now jump to [configuration](#configuration)

Alternarviely you can install the required packagages on your own.

```bash
npm install auth-astro@latest @auth/core@latest
```

Next you need to [add the integration to your astro config](https://docs.astro.build/en/guides/integrations-guide/#using-integrations) by importing it and listing it in the integrations array.

## Configuration

Your [auth configuartion](https://authjs.dev/getting-started/oauth-tutorial#creating-the-server-config) needs to be passed to the integration function call.

For example:
```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import auth from 'auth-astro'

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [auth({
    providers: [
      GitHub({
        clientId: import.meta.env.GITHUB_ID,
        clientSecret: import.meta.env.GITHUB_SECRET,
      }),
    ]
  })]
})
```

### Setup Environment Variables

Generate an auth secret by running `openssl rand -hex 32` in a local terminal or by visiting [generate-secret.vercel.app](https://generate-secret.vercel.app/32), copy the string, then set it as the `AUTH_SECRET` environment variable describe below.

Next set the `AUTH_TRUST_HOST` environment variable to `true` for hosting providers like Cloudflare Pages or Netlify.
```sh
AUTH_SECRET=<auth-secret>
AUTH_TRUST_HOST=true
```

#### Deploying to Vercel?
Setting `AUTH_TRUST_HOST` is not needed as we also check for an active Vercel environment.

### Requirements
- Node version `>= 17.4`
- Astro config set to output mode `server`
- [SSR](https://docs.astro.build/en/guides/server-side-rendering/) enabled in your Astro project

Resources:
- [Enabling SSR in Your Project](https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project)
- [Adding an Adapter](https://docs.astro.build/en/guides/server-side-rendering/#adding-an-adapter)

# Usage

Your authentication endpoints now live under `[domain]/api/auth/[operation]`. You can change the prefix in the configuation.

## Accessing your configuration

In case you need to access your auth configuartion, you can always import it by
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
import authOpts from 'auth:config';

const session = await getSession(Astro.request, authOpts)
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
import { Auth, Signin, Signout } from 'auth-astro/components';
import authOpts from 'auth:config';
---
<Auth authOpts={authOpts}>
  {(session: Session) => 
    {session ? 
      <Signin provider="github">Login</Signin>
    :
      <Signout>Logout</Signout>
    }

    <p>
      {session ? `Logged in as ${session.user?.name}` : 'Not logged in'}
    </p>
  }
</Auth>
```

# State of Project

We currently are waiting for the [PR](https://github.com/nextauthjs/next-auth/pull/6463) in the offical [next-auth](https://github.com/nextauthjs/next-auth/) repository to be merged. Once this happened this package will be deprecated. 

# Contribution
Us waiting means on the PR to be merged means, we can still add new features to the PR, so, if you miss anything feel free to open a PR or issue in this repo and we will try to add it to the official package to come.
