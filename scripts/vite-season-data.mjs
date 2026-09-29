import { spawnSync } from "node:child_process";
import path from "node:path";

/**
 * The per-case chunk split, as the app build sees it.
 *
 * The runtime chunk used to carry the whole season -- every case pack and the
 * code that builds the graph from them -- before the first scene. This plugin
 * builds the graph once, in Node, at build time (scripts/season-split.mjs
 * --emit-json, in a child process so it always reads the source as it is on
 * disk) and serves it as modules:
 *
 *   virtual:season                 the store (src/seasonRuntime.js) with the
 *                                  index every case needs, and one loader per case;
 *   virtual:season-case/<caseId>   one case's scenes, replies and voice lines,
 *                                  which Rollup makes a chunk of its own.
 *
 * and swaps the app's imports of src/gameData.js and src/gameDialogue.js for
 * src/runtime/*.app.js, which answer the same names from that store. Nothing
 * outside the app build changes: Node imports the real modules, and
 * tests/unit/season-runtime.test.mjs holds the store to them.
 *
 * In the dev server a change to the season's source drops the built data and
 * reloads the page.
 */
const STORE = "virtual:season";
const CASE = "virtual:season-case/";
const SWAPS = {
  "src/gameData.js": "src/runtime/gameData.app.js",
  "src/gameDialogue.js": "src/runtime/gameDialogue.app.js",
};
const SEASON_SOURCE = /[\\/]src[\\/](nodes[\\/]|gameData\.js|gameDialogue\.js|gameCases\.js|gameConstants\.js|seasonRules\.js|caseCopy\.js)/;

export function seasonData() {
  let root = process.cwd();
  let data = null;
  const read = () => {
    const run = spawnSync(process.execPath, ["scripts/season-split.mjs", "--emit-json"], { cwd: root, encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
    if (run.status !== 0) throw new Error(`scripts/season-split.mjs --emit-json failed:\n${run.stderr}`);
    return JSON.parse(run.stdout);
  };
  const relative = (file) => path.relative(root, file).replace(/\\/g, "/");

  return {
    name: "season-data",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
    },
    async resolveId(source, importer, options) {
      if (source === STORE || source.startsWith(CASE)) return `\0${source}`;
      if (!importer || importer.startsWith("\0")) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      const swap = resolved && SWAPS[relative(resolved.id)];
      if (!swap) return null;
      return path.resolve(root, swap);
    },
    load(id) {
      if (!id.startsWith(`\0${STORE}`)) return null;
      data ??= read();
      if (id === `\0${STORE}`) {
        const loaders = Object.keys(data.cases)
          .map((caseId) => `  ${JSON.stringify(caseId)}: () => import(${JSON.stringify(CASE + caseId)}),`)
          .join("\n");
        return [
          `import { createSeasonRuntime } from "/src/seasonRuntime.js";`,
          `import { loadedChunk } from "/src/state/chunkReload.js";`,
          `const loaders = {\n${loaders}\n};`,
          `const index = JSON.parse(${JSON.stringify(JSON.stringify(data.index))});`,
          `export const season = createSeasonRuntime(index, (caseId) =>`,
          `  loaders[caseId] ? loaders[caseId]().then((module) => loadedChunk(module).default) : Promise.reject(new Error("No such case: " + caseId)),`,
          `);`,
        ].join("\n");
      }
      const caseId = id.slice(`\0${CASE}`.length);
      if (!data.cases[caseId]) throw new Error(`virtual:season-case: no case ${caseId}`);
      return `export default JSON.parse(${JSON.stringify(JSON.stringify(data.cases[caseId]))});`;
    },
    configureServer(server) {
      server.watcher.on("change", (file) => {
        if (!SEASON_SOURCE.test(file)) return;
        data = null;
        for (const module of [...server.moduleGraph.idToModuleMap.values()]) {
          if (module.id?.startsWith(`\0${STORE}`)) server.moduleGraph.invalidateModule(module);
        }
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}
