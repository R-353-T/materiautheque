### Enumerator

#### **`/enumerator/list`**

##### Request:

```json
{
    "index": number|null, // default: 1
    "size": number|null, // default: 32
    "search": string|null, // default: null
    "typeId": int|null // default: null
}
```

- typeId: `incorrect_type` | `not_found` | `not_enumerable`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "typeId": number,
        "valueList": null
    }[],
    "pagination": {
        "index": number, // current page index
        "size": number, // current page size
        "total": number // last page index
    }
}
```


#### **`/enumerator/get`**

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
        "typeId": number,
        "valueList": {
            "id": number,
            "value": any
        }[]
    }
}
```

- id: `required` | `incorrect_type` | `not_found` 

#### **`/enumerator/delete`**

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

#### **`/enumerator/create`**

##### Request:

```json
{
    "name": string,
    "description": string,
    "typeId": number,
    "valueList": {
        "id": number,
        "value": any
    }[]
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long` | `duplicate`*
- description: `required` | `incorrect_type` | `too_long`
- typeId: `required` | `incorrect_type` | `not_found` | `not_enumerable`
- valueList: `required` | `incorrect_type`
- DTO: `incorrect_type`
    - id: `incorrect_type` | `not_foreign_of`
    - value : `required` | `incorrect_type` | `empty` | `too_long` | `invalid_date` | `not_found`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "typeId": number,
        "valueList": {
            "id": number,
            "value": any
        }[]
    }
}
```

#### **`/enumerator/update`**

##### Request:

```json
{``
    "id": number,
    "name": string,
    "description": string,
    "typeId": number,
    "valueList": {
        "id": number,
        "value": any
    }[]
}
```

- id: `required` | `incorrect_type` | `not_found` 
- name: `required` | `incorrect_type` | `empty` | `too_long` | `duplicate`*
- description: `required` | `incorrect_type` | `too_long`
- typeId: `required` | `incorrect_type` | `not_found` | `not_enumerable`
- valueList: `required` | `incorrect_type`
- DTO: `incorrect_type`
    - id: `incorrect_type` | `not_foreign_of` 
    - value : `required` | `incorrect_type` | `empty` | `too_long` | `invalid_date` | `not_found`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "typeId": number,
        "valueList": {
            "id": number,
            "value": any
        }[]
    }
}
```
