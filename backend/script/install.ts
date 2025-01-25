import { execute } from "../function/execute.ts";
import { getDevConfiguration } from "../function/get-config.ts";
import { SHELL } from "../global.ts";

const options = getDevConfiguration();

await execute(SHELL.WPCLI.CORE_DOWNLOAD()); // https://developer.wordpress.org/cli/commands/core/download
await execute(SHELL.WPCLI.CORE_CHECKSUM()); // https://developer.wordpress.org/cli/commands/core/verify-checksums
await execute(SHELL.WPCLI.CORE_CONFIGURE(options)); // https://developer.wordpress.org/cli/commands/config/create
await execute(SHELL.WPCLI.CORE_INSTALL(options)); // https://developer.wordpress.org/cli/commands/core/install

options.plugins.forEach((plugin) => {
    execute(SHELL.WPCLI.INSTALL_PLUGIN(plugin)); // https://developer.wordpress.org/cli/commands/plugin/install
});

options.options.forEach((option) => {
    execute(SHELL.WPCLI.UPDATE_OPTION(option)); // https://developer.wordpress.org/cli/commands/option/update
});