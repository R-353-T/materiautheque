
### Unit

#### **`/unit/list`**

##### Request:

```json
{
    "index": number|null, // default: 1
    "size": number|null, // default: 32
    "search": string|null // default: null
}
```

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "valueList": null
    }[],
    "pagination": {
        "index": number, // current page index
        "size": number, // current page size
        "total": number // last page index
    }
}
```

#### **`/unit/get`**

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
        "valueList": {
            "id": number,
            "value": string
        }[]
    }
}
```

#### **`/unit/delete`**

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

#### **`/unit/create`**

##### Request:

```json
{
    "name": string,
    "description": string,
    "valueList": {
        "value": string
    }[]
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long` | `duplicate`*
- description: `required` | `incorrect_type` | `too_long`
- valueList: `required` | `incorrect_type`
- Dto: `incorrect_type`
    - id: `incorrect_type` | `not_foreign_of` 
    - value : `required` | `incorrect_type` | `empty` | `too_long`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "valueList": {
            "id": number,
            "value": string
        }[]
    }
}
```

#### **`/unit/update`**

##### Request:

```json
{
    "id": number,
    "name": string,
    "description": string,
    "valueList": {
        "id": number|null,
        "value": string
    }[]
}
```

- id: `required` | `incorrect_type` | `not_found` 
- name: `required` | `incorrect_type` | `empty` | `too_long` | `duplicate`*
- description: `required` | `incorrect_type` | `too_long`
- valueList: `required` | `incorrect_type`
- Dto: `incorrect_type`
    - id: `incorrect_type` | `not_foreign_of`
    - value : `required` | `incorrect_type` | `empty` | `too_long`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "valueList": {
            "id": number,
            "value": string
        }[]
    }[]
}
```
