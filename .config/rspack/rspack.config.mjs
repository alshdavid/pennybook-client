import path from "node:path";
import url from "node:url";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { DeleteDirectoryPlugin } from "./delete-directory-plugin.mjs";
import { HtmlPlugin } from "./html-plugin.mjs";

const baseHref = process.env.BASE_HREF || "/";
console.log("BUILDING WITH BASE_HREF OF", baseHref);

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.dirname(path.dirname(dirname));

export default defineConfig({
  experiments: {
    css: true,
    outputModule: true,
  },
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(root, "dist"),
    publicPath: baseHref,
    module: true,
    chunkFormat: "module",
    chunkLoading: "import",
    workerChunkLoading: "import",
  },
  source: {},
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
    extensionAlias: {
      ".js": [".ts", ".tsx", ".js"],
    },
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat", // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                decorators: true,
              },
              transform: {
                react: {
                  pragma: "h",
                  pragmaFrag: "Fragment",
                },
                decoratorVersion: "2022-03",
                decoratorMetadata: true,
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        resourceQuery: /type=raw/i,
        type: "asset/source",
      },
      {
        test: /\.css$/i,
        resourceQuery: { not: [/raw/] },
        use: [rspack.CssExtractRspackPlugin.loader, "css-loader"],
        type: "javascript/auto",
      },
      {
        test: /\.scss$/i,
        resourceQuery: { not: [/raw/] },
        use: [
          {
            loader: "sass-loader",
            options: {
              api: "modern-compiler", // Faster performance
            },
          },
        ],
        // Rspack handles extraction and URL resolving automatically
        type: "css",
      },
    ],
  },
  plugins: [
    new DeleteDirectoryPlugin({
      directory: path.join(root, "dist"),
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: "manifest.json",
        },
        {
          from: "src/favicon.svg",
          to: "favicon.svg",
        },
      ],
    }),
    new HtmlPlugin({
      minify: false,
      filename: "index.html",
      spaFallback: "404.html",
      template: "src/index.html",
      inject: "head",
      baseHref,
    }),
    new rspack.DefinePlugin({
      BASE_HREF: JSON.stringify(baseHref),
    }),
    new rspack.CssExtractRspackPlugin({}),
  ],
  devServer: {
    hot: false,
    port: 4200,
    historyApiFallback: true,
    allowedHosts: "all",
    host: "0.0.0.0",
    headers: [
      {
        key: "Cache-Control",
        value: "no-store",
      },
    ],
    devMiddleware: {
      writeToDisk: true,
    },
  },
});
