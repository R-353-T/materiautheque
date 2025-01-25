import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { IShellCommand, IWPCustomOption, IWPOptions, IWPPluginOptions } from "./interface/wordpress.ts";

const ROOT_DIRECTORY = dirname(fileURLToPath(import.meta.url));

export const DIRECTORY = {
    ROOT: ROOT_DIRECTORY,
    THEME: join(ROOT_DIRECTORY, "source"),
    VENDOR: join(ROOT_DIRECTORY, "vendor"),
    BUILD: join(ROOT_DIRECTORY, "build"),
    THEME_DESTINATION: join(ROOT_DIRECTORY, "build", "wp-content", "themes", "backend"),
};

export const FILE = {
    CONFIGURATION: {
        DEV: join(DIRECTORY.ROOT, "config.dev.yml"),
    },
    VENDOR: {
        PHPCS: join(DIRECTORY.VENDOR, "phpcs-3.11.1.phar"),
        PHPCBF: join(DIRECTORY.VENDOR, "phpcbf-3.11.1.phar"),
        WPCLI: join(DIRECTORY.VENDOR, "wpcli-2.11.0.phar")
    }
};

export const SHELL = {
    SERVE(host: string, port: string): IShellCommand {
        return {
            command: `php`,
            args: [
                `-t ${DIRECTORY.BUILD}`,
                `-S ${host}:${port}`
            ]
        };
    },

    LINT: {
        PHPCS(standard: string = "PSR12"): IShellCommand {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.PHPCS,
                    `--standard=${standard}`,
                    DIRECTORY.THEME
                ]
            };
        },

        PHPCBF(standard: string = "PSR12"): IShellCommand {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.PHPCBF,
                    `--standard=${standard}`,
                    DIRECTORY.THEME
                ]
            };
        },
    },

    WPCLI: {
        CORE_DOWNLOAD(locale: string = "en_US"): IShellCommand {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.WPCLI,
                    "core download",
                    `--path=${DIRECTORY.BUILD}`,
                    `--locale=${locale}`,
                    "--force"
                ]
            };
        },

        CORE_CHECKSUM(locale: string = "en_US"): IShellCommand {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.WPCLI,
                    "core verify-checksums",
                    `--path=${DIRECTORY.BUILD}`,
                    `--locale=${locale}`,
                ]
            };
        },

        CORE_CONFIGURE(options: IWPOptions): IShellCommand {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.WPCLI,
                    "config create",
                    `--path=${DIRECTORY.BUILD}`,
                    `--force`,
                    `--dbhost=${options.db.host}`,
                    `--dbname=${options.db.name}`,
                    `--dbuser=${options.db.username}`,
                    `--dbpass=${options.db.password}`,
                    `--dbcharset=${options.db.charset}`,
                    `--dbprefix=${options.db.prefix}`,
                    `--extra-php`
                ],
                stdin: options.extra
            };
        },

        CORE_INSTALL(options: IWPOptions): IShellCommand {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.WPCLI,
                    "core install",
                    `--path=${DIRECTORY.BUILD}`,
                    `--url=${options.site.protocol}://${options.site.host}:${options.site.port}`,
                    `--title=${options.site.name}`,
                    `--admin_user=${options.site.username}`,
                    `--admin_password=${options.site.password}`,
                    `--admin_email=${options.site.email}`,
                    `--skip-email`
                ]
            };
        },

        INSTALL_PLUGIN(options: IWPPluginOptions) {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.WPCLI,
                    "plugin install",
                    options.slug,
                    `--path=${DIRECTORY.BUILD}`,
                    (options.version ? `--version=${options.version}` : ""),
                    `--activate`,
                    `--force`,
                ]
            };
        },

        UPDATE_OPTION(options: IWPCustomOption) {
            return {
                command: `php`,
                args: [
                    FILE.VENDOR.WPCLI,
                    "option update",
                    options.key,
                    `"${options.value}"`,
                    `--path=${DIRECTORY.BUILD}`,
                ]
            };
        }
    }
};