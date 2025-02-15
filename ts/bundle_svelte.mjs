// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

import { build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import sveltePlugin from "esbuild-svelte";
import { readFileSync, writeFileSync } from "fs";
import { basename } from "path";
import { argv } from "process";
import sveltePreprocess from "svelte-preprocess";
import { typescript } from "svelte-preprocess-esbuild";

const [_tsx, _script, entrypoint, bundle_js, bundle_css, page_html] = argv;

if (page_html != null) {
    const template = readFileSync("ts/page.html", { encoding: "utf8" });
    writeFileSync(page_html, template.replace(/{PAGE}/g, basename(page_html, ".html")));
}

// support Qt 5.14
const target = ["es6", "chrome77"];
const inlineCss = bundle_css == null;

build({
    bundle: true,
    entryPoints: [entrypoint],
    globalName: "anki",
    outfile: bundle_js,
    minify: true,
    loader: { ".svg": "text" },
    preserveSymlinks: true,
    sourcemap: false,
    plugins: [
        sassPlugin({ loadPaths: [".", "node_modules"] }),
        sveltePlugin({
            compilerOptions: { css: inlineCss },
            preprocess: [
                typescript({
                    target,
                    define: {
                        "process.browser": "true",
                    },
                    tsconfig: "ts/tsconfig.json",
                }),
                sveltePreprocess({ typescript: false }),
            ],
        }),
    ],
    target,
    // logLevel: "info",
}).catch(() => process.exit(1));
