export class TooManyRequestError extends Error {
    constructor(message: string = "Trop de requêtes, veuillez réessayer plus tard.") {
        super(message);
        this.name = "TooManyRequest";
        Object.setPrototypeOf(this, TooManyRequestError.prototype);
    }
}