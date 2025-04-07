import { signal } from "@angular/core";
import { IField } from "./field.interface";
import { FormArray, FormControl } from "@angular/forms";

// ***********
// ** TYPES **
// ***********

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
    mode = signal<"radio" | "checkbox" | "redirection" | "none" | "validation">(
        "none",
    );
    disabled = signal<boolean>(false);
    selected = signal<boolean>(false);
    valid = signal<boolean | undefined>(undefined);
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
        this.items.update((items) => {
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

export type BaseFormField = {
    field: IField;
    controls: {
        value: FormControl|FormArray<FormControl>;
        unit?: FormControl|FormArray<FormControl>;
    };
};
