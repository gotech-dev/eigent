// vite.config.ts
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "file:///Users/gotechjsc/Documents/GitHub/eigent/node_modules/vite/dist/node/index.js";
import react from "file:///Users/gotechjsc/Documents/GitHub/eigent/node_modules/@vitejs/plugin-react/dist/index.js";
import electron from "file:///Users/gotechjsc/Documents/GitHub/eigent/node_modules/vite-plugin-electron/dist/simple.mjs";

// package.json
var package_default = {
  name: "go-ai",
  version: "0.0.80",
  main: "dist-electron/main/index.js",
  description: "GO-AI - Tr\u1EE3 l\xFD AI th\xF4ng minh",
  author: "GoTech JSC",
  license: "MIT",
  private: true,
  debug: {
    env: {
      VITE_DEV_SERVER_URL: "http://127.0.0.1:5173/"
    }
  },
  type: "module",
  scripts: {
    "compile-babel": "cd backend && uv run pybabel compile -d lang",
    "clean-cache": "rimraf node_modules/.vite",
    dev: "npm run clean-cache && vite",
    "preinstall-deps": "node scripts/preinstall-deps.js",
    "clean-symlinks": "node scripts/clean-symlinks.js",
    "test-signing": "node scripts/test-signing.js",
    build: "npm run preinstall-deps && npm run clean-symlinks && npm run compile-babel && tsc && vite build &&  electron-builder -- --publish always",
    "build:mac": "npm run preinstall-deps && npm run clean-symlinks && npm run compile-babel && tsc && vite build && electron-builder --mac",
    "build:mac:test": "npm run preinstall-deps && npm run clean-symlinks && npm run compile-babel && tsc && vite build && electron-builder --mac && npm run test-signing",
    "build:win": "npm run preinstall-deps && npm run compile-babel && tsc && vite build && electron-builder --win",
    "build:linux": "npm run preinstall-deps && npm run clean-symlinks && npm run compile-babel && tsc && vite build && electron-builder --linux",
    "build:all": "npm run preinstall-deps && npm run compile-babel && tsc && vite build && electron-builder --mac --win --linux",
    preview: "vite preview",
    pretest: "vite build --mode=test",
    test: "vitest run",
    "test:watch": "vitest",
    "test:e2e": "vitest run --config vitest.config.ts",
    "test:coverage": "vitest run --coverage",
    "type-check": "tsc --noEmit"
  },
  dependencies: {
    "@electron/notarize": "^2.5.0",
    "@fontsource/inter": "^5.2.5",
    "@gsap/react": "^2.1.2",
    "@microsoft/fetch-event-source": "^2.0.1",
    "@monaco-editor/loader": "^1.5.0",
    "@monaco-editor/react": "^4.7.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.13",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.11",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@stackframe/react": "file:package/@stackframe/react",
    "@xterm/addon-fit": "^0.10.0",
    "@xterm/addon-web-links": "^0.11.0",
    "@xterm/xterm": "^5.5.0",
    "@xyflow/react": "^12.6.4",
    "adm-zip": "^0.5.16",
    archiver: "^7.0.1",
    axios: "^1.9.0",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    cmdk: "^1.1.1",
    "csv-parser": "^3.2.0",
    dompurify: "^3.2.7",
    "electron-log": "^5.4.0",
    "electron-updater": "^6.7.3",
    "embla-carousel-autoplay": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.17.0",
    gsap: "^3.13.0",
    "lodash-es": "^4.17.21",
    "lottie-web": "^5.13.0",
    "lucide-react": "^0.509.0",
    mammoth: "^1.9.1",
    mime: "^4.1.0",
    "monaco-editor": "^0.52.2",
    motion: "^12.23.24",
    "next-themes": "^0.4.6",
    papaparse: "^5.5.3",
    postprocessing: "^6.37.8",
    "react-markdown": "^10.1.0",
    "react-resizable-panels": "^3.0.4",
    "react-router-dom": "^7.6.0",
    "remark-gfm": "^4.0.1",
    sonner: "^2.0.6",
    "tailwind-merge": "^3.3.0",
    "tailwindcss-animate": "^1.0.7",
    tar: "^7.4.3",
    three: "^0.180.0",
    "tree-kill": "^1.2.2",
    "tw-animate-css": "^1.2.9",
    unzipper: "^0.12.3",
    xml2js: "^0.6.2",
    zustand: "^5.0.4"
  },
  devDependencies: {
    "@playwright/test": "^1.48.2",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/archiver": "^6.0.3",
    "@types/dompurify": "^3.0.5",
    "@types/lodash-es": "^4.17.12",
    "@types/mime": "^3.0.4",
    "@types/papaparse": "^5.3.16",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/unzipper": "^0.10.11",
    "@types/xml2js": "^0.4.14",
    "@vitejs/plugin-react": "^4.3.3",
    "@vitest/coverage-v8": "^2.1.9",
    autoprefixer: "^10.4.20",
    electron: "^33.4.11",
    "electron-builder": "^26.4.0",
    "electron-devtools-installer": "^4.0.0",
    i18next: "^25.4.2",
    jsdom: "^27.4.0",
    postcss: "^8.4.49",
    "postcss-import": "^16.1.0",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^15.7.3",
    rimraf: "^6.0.1",
    tailwindcss: "^3.4.15",
    typescript: "^5.4.2",
    vite: "^5.4.11",
    "vite-plugin-electron": "^0.29.0",
    "vite-plugin-electron-renderer": "^0.14.6",
    vitest: "^2.1.5"
  },
  overrides: {
    glob: "^10.4.5"
  },
  pnpm: {
    neverBuiltDependencies: [],
    overrides: {
      glob: "^10.4.5"
    }
  },
  engines: {
    node: ">=20.0.0 <23.0.0"
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "/Users/gotechjsc/Documents/GitHub/eigent";
var vite_config_default = defineConfig(({ command, mode }) => {
  rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = false;
  const env = loadEnv(mode, process.cwd(), "");
  return {
    resolve: {
      alias: {
        "@": path.join(__vite_injected_original_dirname, "src")
      }
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-dev-runtime",
        "react-router-dom",
        "zustand",
        "clsx",
        "tailwind-merge",
        "lucide-react",
        "framer-motion",
        "sonner",
        "i18next",
        "react-i18next",
        "@radix-ui/react-tooltip",
        "@radix-ui/react-slot",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-separator",
        "@radix-ui/react-switch",
        "@radix-ui/react-select",
        "@radix-ui/react-tabs",
        "@radix-ui/react-label",
        "@stackframe/react",
        "@tanstack/react-table",
        "cmdk",
        "vaul",
        "lottie-web"
      ],
      exclude: ["@stackframe/react"],
      // Keep exclude if needed for some specific reason, but generally include is enough
      noDiscovery: true
    },
    plugins: [
      react(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: "electron/main/index.ts",
          onstart(args) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */
                "[startup] Electron App"
              );
            } else {
              args.startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: "electron/preload/index.ts",
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : void 0,
              // #332
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: Object.keys("dependencies" in package_default ? package_default.dependencies : {})
              }
            }
          }
        }
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        // renderer: {},
      })
    ],
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      open: false,
      ...process.env.VSCODE_DEBUG && (() => {
        const url = new URL(package_default.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
          proxy: {
            "/api": {
              target: env.VITE_PROXY_URL,
              changeOrigin: true
              // rewrite: path => path.replace(/^\/api/, ''),
            }
          }
        };
      })(),
      clearScreen: false
    }
  };
});
process.on("SIGINT", () => {
  try {
    const backend = path.join(__vite_injected_original_dirname, "backend");
    const pid = readFileSync(backend + "/runtime/run.pid", "utf-8");
    process.kill(parseInt(pid), "SIGINT");
  } catch (e) {
    console.log("no pid file");
    console.log(e);
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2dvdGVjaGpzYy9Eb2N1bWVudHMvR2l0SHViL2VpZ2VudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dvdGVjaGpzYy9Eb2N1bWVudHMvR2l0SHViL2VpZ2VudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ290ZWNoanNjL0RvY3VtZW50cy9HaXRIdWIvZWlnZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVhZEZpbGVTeW5jLCBybVN5bmMgfSBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBlbGVjdHJvbiBmcm9tICd2aXRlLXBsdWdpbi1lbGVjdHJvbi9zaW1wbGUnXG5pbXBvcnQgcGtnIGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG5cblxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICBybVN5bmMoJ2Rpc3QtZWxlY3Ryb24nLCB7IHJlY3Vyc2l2ZTogdHJ1ZSwgZm9yY2U6IHRydWUgfSlcblxuICBjb25zdCBpc1NlcnZlID0gY29tbWFuZCA9PT0gJ3NlcnZlJ1xuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gJ2J1aWxkJ1xuICBjb25zdCBzb3VyY2VtYXAgPSBmYWxzZVxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKVxuICByZXR1cm4ge1xuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3NyYycpXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgICdyZWFjdCcsXG4gICAgICAgICdyZWFjdC1kb20nLFxuICAgICAgICAncmVhY3QtZG9tL2NsaWVudCcsXG4gICAgICAgICdyZWFjdC9qc3gtZGV2LXJ1bnRpbWUnLFxuICAgICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAgICd6dXN0YW5kJyxcbiAgICAgICAgJ2Nsc3gnLFxuICAgICAgICAndGFpbHdpbmQtbWVyZ2UnLFxuICAgICAgICAnbHVjaWRlLXJlYWN0JyxcbiAgICAgICAgJ2ZyYW1lci1tb3Rpb24nLFxuICAgICAgICAnc29ubmVyJyxcbiAgICAgICAgJ2kxOG5leHQnLFxuICAgICAgICAncmVhY3QtaTE4bmV4dCcsXG4gICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCcsXG4gICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2xvdCcsXG4gICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJyxcbiAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JyxcbiAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1wb3BvdmVyJyxcbiAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1zZXBhcmF0b3InLFxuICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXN3aXRjaCcsXG4gICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JyxcbiAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC10YWJzJyxcbiAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1sYWJlbCcsXG4gICAgICAgICdAc3RhY2tmcmFtZS9yZWFjdCcsXG4gICAgICAgICdAdGFuc3RhY2svcmVhY3QtdGFibGUnLFxuICAgICAgICAnY21kaycsXG4gICAgICAgICd2YXVsJyxcbiAgICAgICAgJ2xvdHRpZS13ZWInLFxuICAgICAgXSxcbiAgICAgIGV4Y2x1ZGU6IFsnQHN0YWNrZnJhbWUvcmVhY3QnXSwgLy8gS2VlcCBleGNsdWRlIGlmIG5lZWRlZCBmb3Igc29tZSBzcGVjaWZpYyByZWFzb24sIGJ1dCBnZW5lcmFsbHkgaW5jbHVkZSBpcyBlbm91Z2hcbiAgICAgIG5vRGlzY292ZXJ5OiB0cnVlLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIGVsZWN0cm9uKHtcbiAgICAgICAgbWFpbjoge1xuICAgICAgICAgIC8vIFNob3J0Y3V0IG9mIGBidWlsZC5saWIuZW50cnlgXG4gICAgICAgICAgZW50cnk6ICdlbGVjdHJvbi9tYWluL2luZGV4LnRzJyxcbiAgICAgICAgICBvbnN0YXJ0KGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5WU0NPREVfREVCVUcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coLyogRm9yIGAudnNjb2RlLy5kZWJ1Zy5zY3JpcHQubWpzYCAqLydbc3RhcnR1cF0gRWxlY3Ryb24gQXBwJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFyZ3Muc3RhcnR1cCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB2aXRlOiB7XG4gICAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgICBzb3VyY2VtYXAsXG4gICAgICAgICAgICAgIG1pbmlmeTogaXNCdWlsZCxcbiAgICAgICAgICAgICAgb3V0RGlyOiAnZGlzdC1lbGVjdHJvbi9tYWluJyxcbiAgICAgICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBPYmplY3Qua2V5cygnZGVwZW5kZW5jaWVzJyBpbiBwa2cgPyBwa2cuZGVwZW5kZW5jaWVzIDoge30pLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBwcmVsb2FkOiB7XG4gICAgICAgICAgLy8gU2hvcnRjdXQgb2YgYGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXRgLlxuICAgICAgICAgIC8vIFByZWxvYWQgc2NyaXB0cyBtYXkgY29udGFpbiBXZWIgYXNzZXRzLCBzbyB1c2UgdGhlIGBidWlsZC5yb2xsdXBPcHRpb25zLmlucHV0YCBpbnN0ZWFkIGBidWlsZC5saWIuZW50cnlgLlxuICAgICAgICAgIGlucHV0OiAnZWxlY3Ryb24vcHJlbG9hZC9pbmRleC50cycsXG4gICAgICAgICAgdml0ZToge1xuICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgc291cmNlbWFwOiBzb3VyY2VtYXAgPyAnaW5saW5lJyA6IHVuZGVmaW5lZCwgLy8gIzMzMlxuICAgICAgICAgICAgICBtaW5pZnk6IGlzQnVpbGQsXG4gICAgICAgICAgICAgIG91dERpcjogJ2Rpc3QtZWxlY3Ryb24vcHJlbG9hZCcsXG4gICAgICAgICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBleHRlcm5hbDogT2JqZWN0LmtleXMoJ2RlcGVuZGVuY2llcycgaW4gcGtnID8gcGtnLmRlcGVuZGVuY2llcyA6IHt9KSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gUGxveWZpbGwgdGhlIEVsZWN0cm9uIGFuZCBOb2RlLmpzIEFQSSBmb3IgUmVuZGVyZXIgcHJvY2Vzcy5cbiAgICAgICAgLy8gSWYgeW91IHdhbnQgdXNlIE5vZGUuanMgaW4gUmVuZGVyZXIgcHJvY2VzcywgdGhlIGBub2RlSW50ZWdyYXRpb25gIG5lZWRzIHRvIGJlIGVuYWJsZWQgaW4gdGhlIE1haW4gcHJvY2Vzcy5cbiAgICAgICAgLy8gU2VlIFx1RDgzRFx1REM0OSBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24tdml0ZS92aXRlLXBsdWdpbi1lbGVjdHJvbi1yZW5kZXJlclxuICAgICAgICAvLyByZW5kZXJlcjoge30sXG4gICAgICB9KSxcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJzEyNy4wLjAuMScsXG4gICAgICBwb3J0OiA1MTczLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLi4uKHByb2Nlc3MuZW52LlZTQ09ERV9ERUJVRyAmJiAoKCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHBrZy5kZWJ1Zy5lbnYuVklURV9ERVZfU0VSVkVSX1VSTClcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBob3N0OiB1cmwuaG9zdG5hbWUsXG4gICAgICAgICAgcG9ydDogK3VybC5wb3J0LFxuICAgICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9QUk9YWV9VUkwsXG4gICAgICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAgICAgLy8gcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH0pKCkpLFxuICAgICAgY2xlYXJTY3JlZW46IGZhbHNlLFxuXG4gICAgfVxuICB9XG59KVxuXG5wcm9jZXNzLm9uKCdTSUdJTlQnLCAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgYmFja2VuZCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdiYWNrZW5kJylcbiAgICBjb25zdCBwaWQgPSByZWFkRmlsZVN5bmMoYmFja2VuZCArICcvcnVudGltZS9ydW4ucGlkJywgJ3V0Zi04JylcbiAgICBwcm9jZXNzLmtpbGwocGFyc2VJbnQocGlkKSwgJ1NJR0lOVCcpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZygnbm8gcGlkIGZpbGUnKVxuICAgIGNvbnNvbGUubG9nKGUpXG4gIH1cbn0pXG5cbiIsICJ7XG4gIFwibmFtZVwiOiBcImdvLWFpXCIsXG4gIFwidmVyc2lvblwiOiBcIjAuMC44MFwiLFxuICBcIm1haW5cIjogXCJkaXN0LWVsZWN0cm9uL21haW4vaW5kZXguanNcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkdPLUFJIC0gVHJcdTFFRTMgbFx1MDBGRCBBSSB0aFx1MDBGNG5nIG1pbmhcIixcbiAgXCJhdXRob3JcIjogXCJHb1RlY2ggSlNDXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJkZWJ1Z1wiOiB7XG4gICAgXCJlbnZcIjoge1xuICAgICAgXCJWSVRFX0RFVl9TRVJWRVJfVVJMXCI6IFwiaHR0cDovLzEyNy4wLjAuMTo1MTczL1wiXG4gICAgfVxuICB9LFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImNvbXBpbGUtYmFiZWxcIjogXCJjZCBiYWNrZW5kICYmIHV2IHJ1biBweWJhYmVsIGNvbXBpbGUgLWQgbGFuZ1wiLFxuICAgIFwiY2xlYW4tY2FjaGVcIjogXCJyaW1yYWYgbm9kZV9tb2R1bGVzLy52aXRlXCIsXG4gICAgXCJkZXZcIjogXCJucG0gcnVuIGNsZWFuLWNhY2hlICYmIHZpdGVcIixcbiAgICBcInByZWluc3RhbGwtZGVwc1wiOiBcIm5vZGUgc2NyaXB0cy9wcmVpbnN0YWxsLWRlcHMuanNcIixcbiAgICBcImNsZWFuLXN5bWxpbmtzXCI6IFwibm9kZSBzY3JpcHRzL2NsZWFuLXN5bWxpbmtzLmpzXCIsXG4gICAgXCJ0ZXN0LXNpZ25pbmdcIjogXCJub2RlIHNjcmlwdHMvdGVzdC1zaWduaW5nLmpzXCIsXG4gICAgXCJidWlsZFwiOiBcIm5wbSBydW4gcHJlaW5zdGFsbC1kZXBzICYmIG5wbSBydW4gY2xlYW4tc3ltbGlua3MgJiYgbnBtIHJ1biBjb21waWxlLWJhYmVsICYmIHRzYyAmJiB2aXRlIGJ1aWxkICYmICBlbGVjdHJvbi1idWlsZGVyIC0tIC0tcHVibGlzaCBhbHdheXNcIixcbiAgICBcImJ1aWxkOm1hY1wiOiBcIm5wbSBydW4gcHJlaW5zdGFsbC1kZXBzICYmIG5wbSBydW4gY2xlYW4tc3ltbGlua3MgJiYgbnBtIHJ1biBjb21waWxlLWJhYmVsICYmIHRzYyAmJiB2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXIgLS1tYWNcIixcbiAgICBcImJ1aWxkOm1hYzp0ZXN0XCI6IFwibnBtIHJ1biBwcmVpbnN0YWxsLWRlcHMgJiYgbnBtIHJ1biBjbGVhbi1zeW1saW5rcyAmJiBucG0gcnVuIGNvbXBpbGUtYmFiZWwgJiYgdHNjICYmIHZpdGUgYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlciAtLW1hYyAmJiBucG0gcnVuIHRlc3Qtc2lnbmluZ1wiLFxuICAgIFwiYnVpbGQ6d2luXCI6IFwibnBtIHJ1biBwcmVpbnN0YWxsLWRlcHMgJiYgbnBtIHJ1biBjb21waWxlLWJhYmVsICYmIHRzYyAmJiB2aXRlIGJ1aWxkICYmIGVsZWN0cm9uLWJ1aWxkZXIgLS13aW5cIixcbiAgICBcImJ1aWxkOmxpbnV4XCI6IFwibnBtIHJ1biBwcmVpbnN0YWxsLWRlcHMgJiYgbnBtIHJ1biBjbGVhbi1zeW1saW5rcyAmJiBucG0gcnVuIGNvbXBpbGUtYmFiZWwgJiYgdHNjICYmIHZpdGUgYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlciAtLWxpbnV4XCIsXG4gICAgXCJidWlsZDphbGxcIjogXCJucG0gcnVuIHByZWluc3RhbGwtZGVwcyAmJiBucG0gcnVuIGNvbXBpbGUtYmFiZWwgJiYgdHNjICYmIHZpdGUgYnVpbGQgJiYgZWxlY3Ryb24tYnVpbGRlciAtLW1hYyAtLXdpbiAtLWxpbnV4XCIsXG4gICAgXCJwcmV2aWV3XCI6IFwidml0ZSBwcmV2aWV3XCIsXG4gICAgXCJwcmV0ZXN0XCI6IFwidml0ZSBidWlsZCAtLW1vZGU9dGVzdFwiLFxuICAgIFwidGVzdFwiOiBcInZpdGVzdCBydW5cIixcbiAgICBcInRlc3Q6d2F0Y2hcIjogXCJ2aXRlc3RcIixcbiAgICBcInRlc3Q6ZTJlXCI6IFwidml0ZXN0IHJ1biAtLWNvbmZpZyB2aXRlc3QuY29uZmlnLnRzXCIsXG4gICAgXCJ0ZXN0OmNvdmVyYWdlXCI6IFwidml0ZXN0IHJ1biAtLWNvdmVyYWdlXCIsXG4gICAgXCJ0eXBlLWNoZWNrXCI6IFwidHNjIC0tbm9FbWl0XCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGVsZWN0cm9uL25vdGFyaXplXCI6IFwiXjIuNS4wXCIsXG4gICAgXCJAZm9udHNvdXJjZS9pbnRlclwiOiBcIl41LjIuNVwiLFxuICAgIFwiQGdzYXAvcmVhY3RcIjogXCJeMi4xLjJcIixcbiAgICBcIkBtaWNyb3NvZnQvZmV0Y2gtZXZlbnQtc291cmNlXCI6IFwiXjIuMC4xXCIsXG4gICAgXCJAbW9uYWNvLWVkaXRvci9sb2FkZXJcIjogXCJeMS41LjBcIixcbiAgICBcIkBtb25hY28tZWRpdG9yL3JlYWN0XCI6IFwiXjQuNy4wXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtYWNjb3JkaW9uXCI6IFwiXjEuMi4xMVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LWRpYWxvZ1wiOiBcIl4xLjEuMTRcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51XCI6IFwiXjIuMS4xNVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LWxhYmVsXCI6IFwiXjIuMS43XCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlclwiOiBcIl4xLjEuMTNcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1wcm9ncmVzc1wiOiBcIl4xLjEuN1wiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNlbGVjdFwiOiBcIl4yLjIuNVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNlcGFyYXRvclwiOiBcIl4xLjEuN1wiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNsb3RcIjogXCJeMS4yLjNcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC1zd2l0Y2hcIjogXCJeMS4yLjRcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC10YWJzXCI6IFwiXjEuMS4xMVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvZ2dsZVwiOiBcIl4xLjEuOVwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvZ2dsZS1ncm91cFwiOiBcIl4xLjEuMTBcIixcbiAgICBcIkByYWRpeC11aS9yZWFjdC10b29sdGlwXCI6IFwiXjEuMi43XCIsXG4gICAgXCJAc3RhY2tmcmFtZS9yZWFjdFwiOiBcImZpbGU6cGFja2FnZS9Ac3RhY2tmcmFtZS9yZWFjdFwiLFxuICAgIFwiQHh0ZXJtL2FkZG9uLWZpdFwiOiBcIl4wLjEwLjBcIixcbiAgICBcIkB4dGVybS9hZGRvbi13ZWItbGlua3NcIjogXCJeMC4xMS4wXCIsXG4gICAgXCJAeHRlcm0veHRlcm1cIjogXCJeNS41LjBcIixcbiAgICBcIkB4eWZsb3cvcmVhY3RcIjogXCJeMTIuNi40XCIsXG4gICAgXCJhZG0temlwXCI6IFwiXjAuNS4xNlwiLFxuICAgIFwiYXJjaGl2ZXJcIjogXCJeNy4wLjFcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuOS4wXCIsXG4gICAgXCJjbGFzcy12YXJpYW5jZS1hdXRob3JpdHlcIjogXCJeMC43LjFcIixcbiAgICBcImNsc3hcIjogXCJeMi4xLjFcIixcbiAgICBcImNtZGtcIjogXCJeMS4xLjFcIixcbiAgICBcImNzdi1wYXJzZXJcIjogXCJeMy4yLjBcIixcbiAgICBcImRvbXB1cmlmeVwiOiBcIl4zLjIuN1wiLFxuICAgIFwiZWxlY3Ryb24tbG9nXCI6IFwiXjUuNC4wXCIsXG4gICAgXCJlbGVjdHJvbi11cGRhdGVyXCI6IFwiXjYuNy4zXCIsXG4gICAgXCJlbWJsYS1jYXJvdXNlbC1hdXRvcGxheVwiOiBcIl44LjYuMFwiLFxuICAgIFwiZW1ibGEtY2Fyb3VzZWwtcmVhY3RcIjogXCJeOC42LjBcIixcbiAgICBcImZyYW1lci1tb3Rpb25cIjogXCJeMTIuMTcuMFwiLFxuICAgIFwiZ3NhcFwiOiBcIl4zLjEzLjBcIixcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJsb3R0aWUtd2ViXCI6IFwiXjUuMTMuMFwiLFxuICAgIFwibHVjaWRlLXJlYWN0XCI6IFwiXjAuNTA5LjBcIixcbiAgICBcIm1hbW1vdGhcIjogXCJeMS45LjFcIixcbiAgICBcIm1pbWVcIjogXCJeNC4xLjBcIixcbiAgICBcIm1vbmFjby1lZGl0b3JcIjogXCJeMC41Mi4yXCIsXG4gICAgXCJtb3Rpb25cIjogXCJeMTIuMjMuMjRcIixcbiAgICBcIm5leHQtdGhlbWVzXCI6IFwiXjAuNC42XCIsXG4gICAgXCJwYXBhcGFyc2VcIjogXCJeNS41LjNcIixcbiAgICBcInBvc3Rwcm9jZXNzaW5nXCI6IFwiXjYuMzcuOFwiLFxuICAgIFwicmVhY3QtbWFya2Rvd25cIjogXCJeMTAuMS4wXCIsXG4gICAgXCJyZWFjdC1yZXNpemFibGUtcGFuZWxzXCI6IFwiXjMuMC40XCIsXG4gICAgXCJyZWFjdC1yb3V0ZXItZG9tXCI6IFwiXjcuNi4wXCIsXG4gICAgXCJyZW1hcmstZ2ZtXCI6IFwiXjQuMC4xXCIsXG4gICAgXCJzb25uZXJcIjogXCJeMi4wLjZcIixcbiAgICBcInRhaWx3aW5kLW1lcmdlXCI6IFwiXjMuMy4wXCIsXG4gICAgXCJ0YWlsd2luZGNzcy1hbmltYXRlXCI6IFwiXjEuMC43XCIsXG4gICAgXCJ0YXJcIjogXCJeNy40LjNcIixcbiAgICBcInRocmVlXCI6IFwiXjAuMTgwLjBcIixcbiAgICBcInRyZWUta2lsbFwiOiBcIl4xLjIuMlwiLFxuICAgIFwidHctYW5pbWF0ZS1jc3NcIjogXCJeMS4yLjlcIixcbiAgICBcInVuemlwcGVyXCI6IFwiXjAuMTIuM1wiLFxuICAgIFwieG1sMmpzXCI6IFwiXjAuNi4yXCIsXG4gICAgXCJ6dXN0YW5kXCI6IFwiXjUuMC40XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHBsYXl3cmlnaHQvdGVzdFwiOiBcIl4xLjQ4LjJcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvamVzdC1kb21cIjogXCJeNi44LjBcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvcmVhY3RcIjogXCJeMTYuMy4wXCIsXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnRcIjogXCJeMTQuNi4xXCIsXG4gICAgXCJAdHlwZXMvYXJjaGl2ZXJcIjogXCJeNi4wLjNcIixcbiAgICBcIkB0eXBlcy9kb21wdXJpZnlcIjogXCJeMy4wLjVcIixcbiAgICBcIkB0eXBlcy9sb2Rhc2gtZXNcIjogXCJeNC4xNy4xMlwiLFxuICAgIFwiQHR5cGVzL21pbWVcIjogXCJeMy4wLjRcIixcbiAgICBcIkB0eXBlcy9wYXBhcGFyc2VcIjogXCJeNS4zLjE2XCIsXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTguMy4xMlwiLFxuICAgIFwiQHR5cGVzL3JlYWN0LWRvbVwiOiBcIl4xOC4zLjFcIixcbiAgICBcIkB0eXBlcy91bnppcHBlclwiOiBcIl4wLjEwLjExXCIsXG4gICAgXCJAdHlwZXMveG1sMmpzXCI6IFwiXjAuNC4xNFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4zLjNcIixcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtdjhcIjogXCJeMi4xLjlcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjIwXCIsXG4gICAgXCJlbGVjdHJvblwiOiBcIl4zMy40LjExXCIsXG4gICAgXCJlbGVjdHJvbi1idWlsZGVyXCI6IFwiXjI2LjQuMFwiLFxuICAgIFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCI6IFwiXjQuMC4wXCIsXG4gICAgXCJpMThuZXh0XCI6IFwiXjI1LjQuMlwiLFxuICAgIFwianNkb21cIjogXCJeMjcuNC4wXCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC40OVwiLFxuICAgIFwicG9zdGNzcy1pbXBvcnRcIjogXCJeMTYuMS4wXCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4zLjFcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4zLjFcIixcbiAgICBcInJlYWN0LWkxOG5leHRcIjogXCJeMTUuNy4zXCIsXG4gICAgXCJyaW1yYWZcIjogXCJeNi4wLjFcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjMuNC4xNVwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjQuMlwiLFxuICAgIFwidml0ZVwiOiBcIl41LjQuMTFcIixcbiAgICBcInZpdGUtcGx1Z2luLWVsZWN0cm9uXCI6IFwiXjAuMjkuMFwiLFxuICAgIFwidml0ZS1wbHVnaW4tZWxlY3Ryb24tcmVuZGVyZXJcIjogXCJeMC4xNC42XCIsXG4gICAgXCJ2aXRlc3RcIjogXCJeMi4xLjVcIlxuICB9LFxuICBcIm92ZXJyaWRlc1wiOiB7XG4gICAgXCJnbG9iXCI6IFwiXjEwLjQuNVwiXG4gIH0sXG4gIFwicG5wbVwiOiB7XG4gICAgXCJuZXZlckJ1aWx0RGVwZW5kZW5jaWVzXCI6IFtdLFxuICAgIFwib3ZlcnJpZGVzXCI6IHtcbiAgICAgIFwiZ2xvYlwiOiBcIl4xMC40LjVcIlxuICAgIH1cbiAgfSxcbiAgXCJlbmdpbmVzXCI6IHtcbiAgICBcIm5vZGVcIjogXCI+PTIwLjAuMCA8MjMuMC4wXCJcbiAgfVxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFMsU0FBUyxjQUFjLGNBQWM7QUFDL1UsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8sV0FBVztBQUNsQixPQUFPLGNBQWM7OztBQ0pyQjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLEVBQ1YsU0FBVztBQUFBLEVBQ1gsU0FBVztBQUFBLEVBQ1gsT0FBUztBQUFBLElBQ1AsS0FBTztBQUFBLE1BQ0wscUJBQXVCO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFR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
