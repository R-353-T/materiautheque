import { Stats } from "node:fs";

export interface IElement {
    relative: string;
    absolute: string;
    stats: Stats;
};
export interface IElementMap {
    [key: string]: IElement;
}

export interface IElementChangesMap {
    added: IElement[];
    deleted: IElement[];
    updated: IElement[];
};
