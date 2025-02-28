import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cesium from "vite-plugin-cesium-build";
import path from "path";
import svgr from "vite-plugin-svgr";
import { viteStaticCopy } from "vite-plugin-static-copy";
import copy from "rollup-plugin-copy";
import { rmSync } from "fs";

export default defineConfig({
    plugins: [
        react(),
        cesium(),
        svgr({
            svgrOptions: {
                // svgr options
            }
        }),
        viteStaticCopy({
            targets: [
                {
                    src: resolve("node_modules", "@esri", "calcite-components", "dist", "calcite", "assets"),
                    dest: "."
                }
            ]
        }),
        copy({
            targets: [
                {
                    src: "node_modules/@esri/calcite-components/dist/calcite/assets/",
                    dest: "public/"
                }
            ]
        }),
        {
            name: "remove-public-assets", // Custom plugin name
            closeBundle() {
                // Remove the public/assets folder after the entire build process
                const folderPath = resolve(__dirname, "public/assets");
                try {
                    rmSync(folderPath, { recursive: true, force: true });
                    console.log(`Successfully removed ${folderPath}`);
                } catch (err) {
                    console.error(`Error while removing ${folderPath}:`, err);
                }
            }
        }
    ],
    resolve: {
        alias: {
            "@core": path.resolve(__dirname, "./src/core")
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler" // or "modern"
            }
        }
    }
});
