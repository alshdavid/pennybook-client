import path from "node:path";
import fs from "node:fs";
import prettier from "prettier";
import HtmlWebpackPlugin from "html-webpack-plugin";

export class HtmlPlugin extends HtmlWebpackPlugin {
  #spaFallback;

  constructor(options) {
    super(options);
    this.#spaFallback = options.spaFallback;
  }

  apply(compiler) {
    super.apply(compiler);

    compiler.hooks.compilation.tap("ScriptAttributeInjector", (compilation) => {
      return HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        "ScriptAttributeInjector",
        (data, cb) => {
          // Add type="module" to script tags
          data.assetTags.scripts = data.assetTags.scripts.map((asset) => {
            asset.attributes.type = "module";
            return asset;
          });

          // Filter out workers
          data.assetTags.scripts = data.assetTags.scripts.filter((asset) => {
            return !asset.attributes.src.includes("worker.");
          });

          // Lazy load css
          // <link rel="stylesheet" href="style" media="print" onload="this.media='all'">
          data.assetTags.styles = data.assetTags.styles.map((asset) => {
            return {
              attributes: {
                rel: "stylesheet",
                href: asset.attributes.href,
                media: "print",
                onload: "this.media = 'all'",
              },
              tagName: "link",
              voidTag: true,
              meta: asset.meta,
            };
          });

          // Base Href
          if (this.options.baseHref) {
            data.assetTags.scripts.unshift({
              tagName: "base",
              attributes: {
                href: this.options.baseHref,
              },
              voidTag: true,
              meta: {},
            });
          }

          return cb(null, data);
        },
      );
    });

    compiler.hooks.afterEmit.tapAsync("HtmlPlugin", async (data, callback) => {
      const asset = path.join(
        compiler.options.output.path,
        this.options.filename,
      );
      const contents = await fs.promises.readFile(asset, "utf8");
      const formatted = await prettier.format(contents, {
        parser: "html",
      });
      await fs.promises.writeFile(asset, formatted, "utf8");
      if (this.#spaFallback) {
        await fs.promises.writeFile(
          path.join(compiler.options.output.path, this.#spaFallback),
          formatted,
          "utf8",
        );
      }
      callback();
    });
  }
}
