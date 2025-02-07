
### Template

#### **`/template/list`**

##### Request:

```json
{}
```

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "groupList": null
    }[]
}
```

#### **`/template/get`**

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
        "groupList": { /* @TODO */ }[] 
    }
}
```

#### **`/template/delete`**

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

#### **`/template/update`**

##### Request:

```json
{
    "id": string,
    "groupList": { "id": number }[] 
}
```

- id: `required` | `incorrect_type` | `not_found` 
- groupList: `required` | `incorrect_type`
- DTO:
    - id: `required` | `incorrect_type` | `not_foreign_of`

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "groupList": { /* @TODO */ }[] 
    }
}
```
