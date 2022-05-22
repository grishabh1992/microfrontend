const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "shell",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
        library: { type: "module" },

        // For remotes (please adjust)
        // name: "shell",
        // filename: "remoteEntry.js",
        // exposes: {
        //     './Component': './projects/shell/src/app/app.component.ts',
        // },

        // For hosts (please adjust)
        // remotes: {
        //     "dashboard": "http://localhost:4200/remoteEntry.js",

        // },
        remotes: {
            "dashboard": "http://localhost:3000/remoteEntry.js",
        },
        shared: share({
          // The combination of singleton: true and strictVersion: true makes webpack
          // emit a runtime error when the shell and the micro frontend(s) need different
          // incompetible versions (e. g. two different major versions).
          // If we skipped strictVersion or set it to false, webpack would only emit a warning
          // at runtime.

          // The setting requiredVersion: 'auto' is a little extra provided by the @angular-architects/module-federation plugin.
          // It looks up the used version in your package.json. This prevents several issues.
          "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

          ...sharedMappings.getDescriptors()
        })

    }),
    sharedMappings.getPlugin()
  ],
};
