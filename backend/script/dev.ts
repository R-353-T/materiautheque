import process from "node:process";
import { build } from "../function/build.ts";

function sleep(secondes: number) {
  return new Promise((resolve) => setTimeout(resolve, secondes * 1000));
}

while(true) {
    const change = await build();
    await sleep((change ? 1 : 5));
    console.log((change ? "✅" : "⌛") + " Build complete");
}