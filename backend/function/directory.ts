import { IElementChangesMap, IElementMap } from "../interface/build.ts";
import { walk } from "jsr:@std/fs";
import { statSync } from "node:fs";
import nodepath from "node:path";

export async function scanDirectory(path: string): Promise<IElementMap> {
    const elementMap: IElementMap = {};

    for await (const element of walk(path)) {
      const relative = nodepath.relative(path, element.path);

      if (relative !== "") {
        elementMap[relative] = {
          relative,
          absolute: element.path,
          stats: statSync(element.path),
        };
      }
    }

    return elementMap;
};

export async function compareDirectories(source: string, target: string): Promise<IElementChangesMap> {
    const sourceMap = await scanDirectory(source);
    const targetMap = await scanDirectory(target);

    const skip: { [key: string]: boolean } = {};

    const added = Object.entries(sourceMap)
      .filter(([key,]) => !targetMap[key])
      .map(([key, value]) => {
        skip[key] = true;
        return value;
      });

    const deleted = Object.entries(targetMap)
      .filter(([key,]) => !sourceMap[key])
      .map(([, value]) => value);

    const updated = Object.entries(sourceMap)
      .filter(([key,]) => !skip[key]
        && targetMap[key]
        && sourceMap[key].stats.isFile()
        && targetMap[key].stats.isFile()
        && sourceMap[key].stats.mtimeMs.toFixed(0) !== targetMap[key].stats.mtimeMs.toFixed(0)
      )
      .map(([, value]) => value);

    return {
        added,
        deleted,
        updated
    };
};