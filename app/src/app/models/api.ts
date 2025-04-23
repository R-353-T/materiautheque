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