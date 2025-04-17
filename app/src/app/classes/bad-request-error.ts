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

export class BadRequestError extends Error {

    code: string;
    data: { parameters: IBadRequestParam[]; };

    constructor(message: string, response: IBadResponse) {
        super(message);
        this.name = 'BadRequestError';
        this.code = response.code;
        this.message = response.message;
        this.data = response.data;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}