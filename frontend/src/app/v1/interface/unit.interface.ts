import { ValueDto } from "../model/value-dto";

export interface IUnit {
    id: number;
    name: string;
    description: string;
    valueList: ValueDto[];
}