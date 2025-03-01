import { IField } from "./field.interface";

export interface IGroup {
    id: number;
    name: string;
    description: string;
    templateId: number;
    position: number;
    parentId: number|null;
    groupList: IGroup[];
    fieldList: IField[];
}