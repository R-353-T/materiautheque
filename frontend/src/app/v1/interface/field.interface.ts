export interface IField {
    id: number;
    name: string;
    description: string;
    allowMultipleValues: boolean;
    isRequired: boolean;
    groupId: number;
    position: number;
    typeId: number;
    enumeratorId: number|null;
    unitId: number|null;
}