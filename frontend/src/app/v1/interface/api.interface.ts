export type HttpParameters = { [key: string]: string | number | boolean | undefined | null };

export interface IResponse<T> {
    success: boolean;
    data: T;
}

export interface IResponsePage<T> {
    data: T[];
    pagination: {
        index: number;
        size: number;
        total: number;
    }
}

export interface IBadResponse {
    code: string;
    message: string;
    data: any;
}

export interface IBadRequestParam {
    code: string;
    name: string;
    index?: number;
    property?: string;
    data?: { [key: string]: any; };
}
