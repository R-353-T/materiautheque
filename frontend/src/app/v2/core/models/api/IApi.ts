
export interface IApiResponse<T> {
    success: boolean;
    data: T;
}

export interface IApiResponsePage<T> {
    data: T[];
    pagination: {
        index: number;
        size: number;
        total: number;
    }
}

export interface IApiBadResponse {
    code: string;
    message: string;
    data: any;
}
