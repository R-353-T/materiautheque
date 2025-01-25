import { execute } from "../function/execute.ts";
import { getDevConfiguration } from "../function/get-config.ts";
import { SHELL } from "../global.ts";

const options = getDevConfiguration();

await execute(SHELL.SERVE(options.site.host, options.site.port)); // https://www.php.net/manual/en/features.commandline.webserver.php