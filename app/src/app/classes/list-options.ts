import { signal } from "@angular/core";

export class ListOptions {
    private readonly _errors = signal<string[]>([]);

    readonly errorsSignal = this._errors.asReadonly();
    readonly loadingSignal = signal<boolean>(false);
    readonly completeSignal = signal<boolean>(false);
    readonly items = signal<ListItem[]>([]);

    constructor(
        public name: string,
        public isInfinite: boolean = false,
        public mode: "single" | "multiple" | "none" = "none"
    ) {
        if(this.isInfinite === false) {
            this.completeSignal.set(true);
        }
    }

    reset() {
        this.items.set([]);

        if(this.isInfinite) {
            this.completeSignal.set(false);
        }

        this.loadingSignal.set(false);
    }

    add(item: ListItem) {
        this.items.update((items) => [...items, item]);
    }

    complete() {
        this.completeSignal.set(true);
        this.loadingSignal.set(false);
    }
}

export class ListItem {
    readonly disabled = signal<boolean>(false);
    readonly selected = signal<boolean>(false);
    readonly depth = signal<number>(0);

    constructor(
        public id: number,
        public label: string,
        public description?: string,
        disabled = false,
        selected = false,
        depth: number = 0
    ) {
        this.disabled.set(disabled);
        this.selected.set(selected);
        this.depth.set(depth);
    }
}