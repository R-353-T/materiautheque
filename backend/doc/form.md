### Form

#### **`/form/list`**

##### Request:

```json
{
    "templateId": number,
    "index": number|null, // default: 1
    "size": number|null, // default: 32
    "search": string|null // default: null
}
```

- templateId: `required` | `incorrect_type` | `not_found`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "templateId": number,
        "valueList": null
    }[],
    "pagination": {
        "index": number, // current page index
        "size": number, // current page size
        "total": number // last page index
    }
}
```

#### **`/form/get`**

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
        "templateId": number,
        "valueList": {
            "id": number,
            "fieldId": number,
            "value": any,
            "unitValueId": number|null
        }[]
    }
}
```

#### **`/form/delete`**

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

#### **`/form/create`**

##### Request:

```json
{
    "name": string,
    "templateId": number,
    "valueList": {
        "id": number,
        "fieldId": number,
        "value": any,
        "unitValueId": number|null
    }[]
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long`
- templateId: `required` | `incorrect_type` | `not_found`
- valueList: `required` | `incorrect_type`
- DTO: `incorrect_type`
    - id: `incorrect_type` | `not_found` | `not_foreign_of` | `field_missmatch`*
    - fieldId: `required` | `incorrect_type` | `not_found` | `field_missmatch`* 
    - value: `required` | `incorrect_type` | `empty` | `too_long` | `invalid_date` | `not_found` | `not_forein_of`
    - unitValueId: `required` | `incorrect_type` | `not_found` | `not_forein_of`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "templateId": number,
        "valueList": {
            "id": number,
            "fieldId": number,
            "value": any,
            "unitValueId": number|null
        }[]
    }
}
```

#### **`/form/update`**

##### Request:

```json
{
    "id": number,
    "name": string,
    "templateId": number,
    "valueList": {
        "id": number,
        "fieldId": number,
        "value": any,
        "unitValueId": number|null
    }[]
}
```

- id: `required` | `incorrect_type` | `not_found`
- name: `required` | `incorrect_type` | `empty` | `too_long`
- templateId: `required` | `incorrect_type` | `not_found`
- valueList: `required` | `incorrect_type`
- DTO: `incorrect_type`
    - id: `incorrect_type` | `not_found` | `not_foreign_of` | `field_missmatch`*
    - fieldId: `required` | `incorrect_type` | `not_found` | `field_missmatch`* 
    - value: `required` | `incorrect_type` | `empty` | `too_long` | `invalid_date` | `not_found` | `not_forein_of`
    - unitValueId: `required` | `incorrect_type` | `not_found` | `not_forein_of`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "templateId": number,
        "valueList": {
            "id": number,
            "fieldId": number,
            "value": any,
            "unitValueId": number|null
        }[]
    }
}
```