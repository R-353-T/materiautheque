import { IGroup } from "./group.interface";

export interface ITemplate {
    id: number;
    name: string;
    groupList?: IGroup[];
}
