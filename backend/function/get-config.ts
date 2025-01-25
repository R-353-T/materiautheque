import { FILE } from "../global.ts";
import { parse } from "npm:yaml@2.7.0";
import { IWPOptions } from "../interface/wordpress.ts";

export function getDevConfiguration(): IWPOptions {
    const uint8 = Deno.readFileSync(FILE.CONFIGURATION.DEV);
    const decoder = new TextDecoder();
    const str = decoder.decode(uint8);
    return parse(str) as IWPOptions;
}
