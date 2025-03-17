import { IBadRequestParam, IBadResponse } from "src/app/v1/interface/api.interface";

export class BadRequestError extends Error {

    code: string;
    data: { parameters: IBadRequestParam[]; };

    constructor(message: string, response: IBadResponse) {
        super(message);
        this.name = 'BadRequestError';
        this.code = response.code;
        this.message = response.message;
        this.data = response.data;

        console.log(response);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}