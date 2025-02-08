### Group

#### **`/group/list`**

##### Request:

```json
{
    "templateId": number,
    "parentId": number|null, 
    "index": number|null, // default: 1
    "size": number|null, // default: 32
    "search": string|null // default: null
}
```

- templateId: `required` | `incorrect_type` | `not_found`
- parentId: `incorrect_type` | `not_found` 

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "position": number,
        "templateId": number,
        "groupList": null,
        "fieldList": null
    }[],
    "pagination": {
        "index": number, // current page index
        "size": number, // current page size
        "total": number // last page index
    }
}
```

#### **`/group/get`**

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
        "templateId": number,
        "groupList": { /* @TODO */ }[],
        "fieldList": { /* @TODO */ }[] 
    }
}
```

#### **`/group/delete`**

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

#### **`/group/create`**

##### Request:

```json
{
    "name": string,
    "description": string,
    "templateId": number,
    "parentId": number|null
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long`
- description: `required` | `incorrect_type` | `too_long`
- templateId: `required` | `incorrect_type` | `not_found`
- parentId: `incorrect_type` | `not_found` | `template_group_missmatch`*

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "position": number,
        "templateId": number,
        "groupList": { /* @TODO */ }[],
        "fieldList": { /* @TODO */ }[] 
    }
}
```

#### **`/group/update`**

##### Request:

```json
{
    "name": string,
    "description": string,
    "parentId": number|null,
    "groupList": { id: number }[],
    "fieldList": { id: number }[] 
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long` | `duplicate`*
- description: `required` | `incorrect_type` | `too_long`
- templateId: `required` | `incorrect_type` | `not_found`
- parentId: `incorrect_type` | `not_found` | `template_group_missmatch`* | `parent_circular`*
- groupList:
    - id: `incorrect_type` | `not_foreign_of`
- fieldList:
    - id: `incorrect_type` | `not_foreign_of`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "description": string,
        "position": number,
        "templateId": number,
        "groupList": { /* @TODO */ }[],
        "fieldList": { /* @TODO */ }[] 
    }
}
```
