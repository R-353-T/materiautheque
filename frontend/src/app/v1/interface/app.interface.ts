import { signal, WritableSignal } from "@angular/core";
import { ValueDto } from "../model/value-dto";
import { FormControl } from "@angular/forms";

// filter

export type FilterType = ListItemOptions | ListItemOptions[] | number | null;
export type SelectType = ListItemOptions | ListItemOptions[] | number | null;

// **********
// ** LIST **
// **********

export class ListOptions {
    errors = signal<string[]>([]);
    infinite = signal<boolean>(false);
    loading = signal<boolean>(false);
    complete = signal<boolean>(false);
}

export class ListItemOptions {
    id: number | null = null;
    label: string | null = null;
    description?: string;
    mode = signal<"radio" | "checkbox" | "redirection" | "none" | "validation">("none");
    disabled = signal<boolean>(false);
    selected = signal<boolean>(false);
    valid = signal<boolean|undefined>(undefined);
    depth = signal<number>(0);
    redirection: any[] = ["/"];
}

export class List {
    index = signal<number>(1);
    items = signal<ListItemOptions[]>([]);
    options = new ListOptions();

    refresh() {
        this.index.set(1);
        this.items.set([]);
        this.options.errors.set([]);
        this.options.complete.set(false);
    }

    add(item: ListItemOptions) {
        this.items.update(items => {
            items.push(item);
            return items;
        });
    }

    next(index: number, complete = false) {
        this.index.set(index);
        this.options.complete.set(complete);
        this.options.loading.set(false);
    }
}

// **********************************
// * INFINITE SCROLL                *
// **********************************

export class InfiniteScrollItem {
    label: string;
    description?: string;
    image?: string;
    route?: any[];
    selected?: boolean = false;
    id?: number;

    constructor(
        label: string,
        description?: string,
        image?: string,
        route?: any[],
        id?: number,
        selected: boolean = false,
    ) {
        this.label = label;
        this.description = description;
        this.image = image;
        this.route = route;
        this.id = id;
        this.selected = selected;
    }
}

export class InfiniteScrollOptions {
    items: InfiniteScrollItem[] = [];
    pageIndex: number = 1;
    pageSize: number = 24;
    isLoading: WritableSignal<boolean> = signal(false);
    isComplete: WritableSignal<boolean> = signal(false);
    errorMessage: WritableSignal<string | undefined> = signal(undefined);

    reset(force = false) {
        this.pageIndex = 1;
        this.pageSize = 24;
        this.isComplete.set(false);
        this.items = [];

        if (force) {
            this.isLoading.set(false);
        }
    }

    addItem(
        label: string,
        description?: string,
        image?: string,
        route?: any[],
        id?: number,
        selected?: boolean,
    ) {
        const item = new InfiniteScrollItem(
            label,
            description,
            image,
            route,
            id,
            selected,
        );

        this.items.push(item);
    }
}
