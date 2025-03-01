import { ValueDto } from "../model/value-dto";

export interface IForm {
    id: number;
    name: string;
    templateId: number;
    valueList: ValueDto[]
}