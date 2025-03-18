import { signal, WritableSignal } from "@angular/core";
import { ValueDto } from "../model/value-dto";

// **********************************
// * SELECT                         *
// **********************************

export interface ISelectValue {
    dto: ValueDto;
    disabled: boolean;
}

// **********************************
// * FILTER                         *
// **********************************

export interface IFilterValue {
    dto: ValueDto;
    disabled: boolean;
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
        selected?: boolean
    ) {
        const item = new InfiniteScrollItem(
            label,
            description,
            image,
            route,
            id,
            selected
        );

        this.items.push(item);
    }
}
