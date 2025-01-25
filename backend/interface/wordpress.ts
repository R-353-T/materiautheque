export interface IShellCommand {
    command: string;
    args: string[];
    stdin?: string;
};

export interface IWPPluginOptions {
    slug: string;
    version?: string;
};

export interface IWPCustomOption {
    key: string;
    value: string;
}

export interface IWPOptions {
    db: {
        host: string;
        name: string;
        username: string;
        password: string;
        charset: string;
        prefix: string;
    };

    site: {
        name: string;
        protocol: string;
        host: string;
        port: string;
        username: string;
        password: string;
        email: string;
    };

    plugins: IWPPluginOptions[];

    options: IWPCustomOption[];

    extra: string;
};