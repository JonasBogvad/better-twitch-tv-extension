import { defineConfig } from 'wxt';

export default defineConfig({
  extensionApi: 'chrome',
  manifest: {
    name: 'Better Twitch TV by Jaxstyle',
    description: 'Hides gambling-promoting streamers from your Twitch experience.',
    version: '0.1.0',
    permissions: [],
    host_permissions: ['https://www.twitch.tv/*'],
  },
  browser: 'edge',
  vite: () => ({
    server: {
      port: 3010,
    },
  }),
});
