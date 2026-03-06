# Build Instructions — NoGamble TTV (Firefox)

## Requirements

- **OS**: Windows, macOS, or Linux
- **Node.js**: v24 or later (tested on v24.12.0)
- **npm**: v11 or later (tested on v11.6.0)

## Steps

1. Install dependencies:
   ```
   npm install
   ```

2. Build the Firefox extension:
   ```
   npm run build:firefox
   ```

3. The built extension will be in `.output/firefox-mv3/`.

## Notes

- The build tool is [WXT](https://wxt.dev) v0.19, which uses Vite under the hood to bundle TypeScript source files into the final extension.
- No environment variables or API keys are required to build.
- The extension fetches its blacklist at runtime from `https://www.nogamblettv.app/api/blacklist`.
