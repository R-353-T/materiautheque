### Field

#### **`/field/list`**

##### Request:

```json
{
    "groupId": number, 
    "index": number|null, // default: 1
    "size": number|null, // default: 32
    "search": string|null // default: null
}
```

- groupId: `required` | `incorrect_type` | `not_found`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "position": number,
        "isRequired": boolean,
        "allowMultipleValues": boolean,
        "groupId": number,
        "typeId": number,
        "enumeratorId": number|null,
        "unitId": number|null
    }[],
    "pagination": {
        "index": number, // current page index
        "size": number, // current page size
        "total": number // last page index
    }
}
```

#### **`/field/get`**

##### Request:

```json
{
    "id": number
}
```

- id: `required` | `incorrect_type` | `not_found` 

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "position": number,
        "isRequired": boolean,
        "allowMultipleValues": boolean,
        "groupId": number,
        "typeId": number,
        "enumeratorId": number|null,
        "unitId": number|null
    }
}
```

#### **`/field/delete`**

##### Request:

```json
{
    "id": number
}
```

- id: `required` | `incorrect_type` | `not_found` 

##### Response:

```json
{
    "success": boolean,
    "data": boolean
}
```

#### **`/field/create`**

##### Request:

```json
{
    "name": string,
    "description": string,
    "isRequired": boolean,
    "allowMultipleValues": boolean,
    "groupId": number,
    "typeId": number,
    "enumeratorId": number|null,
    "unitId": number|null
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long`
- description: `required` | `incorrect_type` | `too_long`
- isRequired: `required` | `incorrect_type`
- allowMultipleValues: `required` | `incorrect_type`
- groupId: `required` | `incorrect_type` | `not_found`
- typeId: `required` | `incorrect_type` | `not_found` | `type_not_unitable`* | `type_not_multiple`*
- enumeratorId: `incorrect_type` | `not_found`
- unitId: `incorrect_type` | `not_found`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "position": number,
        "isRequired": boolean,
        "allowMultipleValues": boolean,
        "groupId": number,
        "typeId": number,
        "enumeratorId": number|null,
        "unitId": number|null
    }
}
```

#### **`/field/update`**

##### Request:

```json
{
    "id": number,
    "name": string,
    "description": string,
    "isRequired": boolean,
    "allowMultipleValues": boolean,
    "groupId": number,
    "typeId": number,
    "enumeratorId": number|null,
    "unitId": number|null
}
```

- id: `required` | | `incorrect_type` | `not_found`
- name: `required` | `incorrect_type` | `empty` | `too_long`
- description: `required` | `incorrect_type` | `too_long`
- isRequired: `required` | `incorrect_type`
- allowMultipleValues: `required` | `incorrect_type`
- groupId: `required` | `incorrect_type` | `not_found`
- typeId: `required` | `incorrect_type` | `not_found` | `type_not_unitable`* | `type_not_multiple`*
- enumeratorId: `incorrect_type` | `not_found`
- unitId: `incorrect_type` | `not_found`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "position": number,
        "isRequired": boolean,
        "allowMultipleValues": boolean,
        "groupId": number,
        "typeId": number,
        "enumeratorId": number|null,
        "unitId": number|null
    }
}
```
