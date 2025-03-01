
export class LockTimeout {

    private name: string;
    private locked = false;
    private unlockDate = 0;

    constructor(name: string) {
        this.name = name;
        this.loadFromStorage();
    }

    get isLocked(): boolean {
        return this.locked;
    }

    get remainingTime(): string {
        if(this.locked) {
            return ((this.unlockDate - Date.now()) / 1000).toFixed(0);
        } else {
            return "0";
        }
    }

    /**
     * @param duration in seconds
     */
    lock(duration: number): void {
        if(this.locked) {
            console.warn(`LockTimeout: ${this.name} is already locked!`);
        } else {
            this.locked = true;
            this.unlockDate = Date.now() + (duration * 1000);
            this.saveToStorage();

            setTimeout(
                () => {
                    this.locked = false;
                    this.unlockDate = 0;
                },
                duration * 1000
            );
        }
    }
    
    private loadFromStorage(): void {
        const storedValue = localStorage.getItem(`lockt_${this.name}`);
        if (storedValue) {
            const date = parseInt(storedValue, 10);
            if(!isNaN(date) && date > Date.now()) {
                this.lock(Math.ceil((date - Date.now()) / 1000));
            }
        }
    }

    private saveToStorage(): void {
        localStorage.setItem(`lockt_${this.name}`, this.unlockDate.toString());
    }
}