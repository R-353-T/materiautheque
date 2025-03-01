export type HttpParameters = { [key: string]: string | number | boolean | undefined | null };

export interface IResponse<T> {
    success: boolean;
    data: T;
}

export interface IBadRequestParam {
    code: string;

    name?: string;
    type?: string;
    foreign?: string;
    format?: string;
    index?: number;
}

export interface IResponsePage<T> {
    data: T[];
    pagination: {
        index: number;
        size: number;
        total: number;
    }
}