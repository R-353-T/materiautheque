import { ValueDto } from "../model/value-dto";

export interface IEnumerator {
    id: number;
    name: string;
    description: string;
    typeId: number;
    valueList: ValueDto[];
}
