import { compareDirectories } from "../function/directory.ts";
import { execute } from "../function/execute.ts";
import { DIRECTORY, SHELL } from "../global.ts";
import { existsSync } from "jsr:@std/fs";
import { join } from "jsr:@std/path";

async function phpLint() {
    await execute(SHELL.LINT.PHPCBF(), false);
    return await execute(SHELL.LINT.PHPCS(), false);
}

export async function build() {
    if(!existsSync(DIRECTORY.THEME_DESTINATION)) {
        Deno.mkdirSync(DIRECTORY.THEME_DESTINATION);
    }
    
    const diff = await compareDirectories(DIRECTORY.THEME, DIRECTORY.THEME_DESTINATION);
    let lint = false;
    
    for (const element of diff.added) {
        const elementPathDestination = join(DIRECTORY.THEME_DESTINATION, element.relative);
    
        if(element.stats.isDirectory()) {
            Deno.mkdirSync(elementPathDestination);
        } else {
            if(!lint && element.relative.toLocaleLowerCase().endsWith(".php")) {
                const onErr = await phpLint();
                if(!onErr) {
                    return false;
                }
                lint = true;
            }
    
            Deno.copyFileSync(element.absolute, elementPathDestination);
            Deno.utimeSync(elementPathDestination, element.stats.mtime, element.stats.mtime);
        }

        console.log(`+ ${element.relative}`);
    }
    
    for (const element of diff.deleted) {
        const elementPath = join(DIRECTORY.THEME_DESTINATION, element.relative);
    
        if(element.stats.isDirectory()) {
            Deno.removeSync(elementPath, { recursive: true });
        } else {
            Deno.removeSync(elementPath);
        }

        console.log(`- ${element.relative}`);
    }
    
    for (const element of diff.updated) {
        const elementPathDestination = join(DIRECTORY.THEME_DESTINATION, element.relative);
    
        if(element.stats.isDirectory()) {
            Deno.mkdirSync(elementPathDestination);
        } else {
            if(!lint && element.relative.toLocaleLowerCase().endsWith(".php")) {
                const onErr = await phpLint();
                if(!onErr) {
                    return false;
                }
                lint = true;
            }
    
            Deno.copyFileSync(element.absolute, elementPathDestination);
            Deno.utimeSync(elementPathDestination, element.stats.mtime, element.stats.mtime);
        }

        console.log(`~ ${element.relative}`);
    }

    return diff.added.length > 0 || diff.deleted.length > 0 || diff.updated.length > 0;
}