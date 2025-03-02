import { IBadRequestParam } from "src/app/v1/interface/api.interface";

export class BadRequestError extends Error {
    public params: IBadRequestParam[];

    constructor(message: string, params: IBadRequestParam[]) {
        super(message);
        this.name = 'BadRequestError';
        this.params = params;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}