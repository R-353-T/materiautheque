import { signal } from "@angular/core";

export class CountdownLock {
    private readonly _lock = signal<boolean>(false);

    readonly locked = this._lock.asReadonly();
    expireDate = 0;

    get remainingTime(): number {
        if(this.locked()) {
            return parseFloat(((this.expireDate - Date.now()) / 1000).toFixed(2));
        } else {
            return 0;
        }
    }

    constructor(public storageKey: string) {
        this.loadFromLocalStorage();
        console.log(`(LOCK) ${this.storageKey}`, this.locked());
    }

    lockFor(seconds: number) {
        if (seconds > 0) {
            this._lock.set(true);
            const duration = seconds * 1000;
            this.expireDate = duration + Date.now();
            localStorage.setItem(this.storageKey, this.expireDate.toString());

            let timeout: any = null;
            timeout = setTimeout(
                () => {
                    this._lock.set(false);
                    clearTimeout(timeout);
                },
                duration
            );
        }
    }

    private loadFromLocalStorage() {
        const value = localStorage.getItem(this.storageKey);

        if (value) {
            this.expireDate = parseInt(value);
            
            if (isNaN(this.expireDate) === false && this.expireDate > Date.now()) {
                this._lock.set(true);
                this.lockFor(this.remainingTime);
            }
        }
    }
}
