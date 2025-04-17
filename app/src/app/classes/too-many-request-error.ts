import { CountdownLock } from "./countdown-lock";

export class TooManyRequestError extends Error {
    constructor(message: string, public countdownLock: CountdownLock) {
        super(message);
        this.name = "TooManyRequest";
        Object.setPrototypeOf(this, TooManyRequestError.prototype);
    }

    get errorMessage() {
        return this.message.replace("$1", this.countdownLock.remainingTime.toString());
    }
}