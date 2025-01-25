import { spawn } from "node:child_process";
import * as process from "node:process";
import { IShellCommand } from "../global.ts";
import console from "node:console";

function log(message: any) {
    console.log(`%c${message.toString()}`, "color: blue");
}

function logWarn(message: any) {
    console.warn(`%c${message.toString()}`, "color: yellow");
}

function logErr(message: any) {
    console.error(`%c${message.toString()}`, "color: red");
}

export function execute(options: IShellCommand, exitOnError: boolean = true): Promise<boolean> {
  return new Promise((resolve) => {
    const xspawn = spawn(
      options.command,
      options.args,
      {
        shell: true,
        stdio: ["pipe", "pipe", "pipe"]
      }
    );

    if (options.stdin) {
      xspawn.stdin.write(options.stdin);
    }

    xspawn.stdout.on("data", log);
    xspawn.stderr.on("data", logWarn);
    xspawn.on("error", logErr);
    xspawn.on("close", (code) => {
      if (exitOnError && code !== 0) {
        process.exit(code);
      } else {
        resolve(code === 0);
      }
    });

    xspawn.stdin.end();
  });
}
