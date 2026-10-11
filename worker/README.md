# OSRS hiscores Cloudflare Worker

This Worker fetches player hiscores from Jagex server-side so the portfolio can
read them without the browser's cross-origin request being blocked. It only
accepts GET requests for a player name and always contacts the fixed Jagex
hiscores endpoint.

## Deploy

1. Install and authenticate with [Wrangler](https://developers.cloudflare.com/workers/wrangler/):
   `npm install --global wrangler` and `wrangler login`.
2. From this directory, run `wrangler deploy`.
3. Copy the `workers.dev` URL printed by Wrangler.
4. Set `osrsHiscoresWorkerUrl` near the top of the site's `script.js` to that
   URL, for example `https://osrs-hiscores.<your-subdomain>.workers.dev`.
5. Publish the site again.

The Worker sends CORS headers only to `https://christydun.github.io`. If the
site is served from a different origin, update `allowedOrigin` in
`src/index.js` to that exact origin and redeploy.
