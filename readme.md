# Matériauthèque

# Backend

## Prerequisites

* Deno (2.1)
* Php (8.3)
* MariaDB

## CLI

Duplicate `config.template.yml` as `config.dev.yml` and edit is with your own database information.

| Command   | Description                           |
|-:         |:-                                     |
| `install` | Install WordPress locally             |
| `buid`    | Build theme                           |
| `dev`     | Watch theme changes and build them    |
| `serve`   | Run PHP local server                  |

## Getting started

1. `deno run install`
2. `deno run build`
3. `deno run serve`
4. Log in as admin
5. Activate the theme
6. You are ready to code! 🚀

## API

### 1) Type

#### **`/type/list`**

##### Request:

```json
{}
```

##### Response:

```json
{
    "success": boolean,
    "data": {
            pid: number,
            id: number,
            name: string,
            column: string,
            allowEnumeration: boolean,
            allowMultipleValues: boolean
    }[]
}
```

### 2) Unit

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
        "valueList": {
            "id": number,
            "value": string
        }[]
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
        "id": number,
        "value": string
    }[]
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long` | `unique`*
- description: `required` | `incorrect_type` | `too_long`
- valueList: `required` | `incorrect_type`
- Dto: `incorrect_type`
    - id: `not_foreign_of` | 
    - value : `required` | `incorrect_type` | `empty` | `too_long`

##### Response:

```json
{
    "success": boolean,
    "data": {
            pid: number,
            id: number,
            name: string,
            column: string,
            allowEnumeration: boolean,
            allowMultipleValues: boolean
    }[]
}
```

#### **`/unit/update`**

##### Request:

```json
{``
    "id": number,
    "name": string,
    "description": string,
    "valueList": {
        "id": number,
        "value": string
    }[]
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long` | `unique`*
- description: `required` | `incorrect_type` | `too_long`
- valueList: `required` | `incorrect_type`
- Dto: `incorrect_type`
    - id: `not_foreign_of` | 
    - value : `required` | `incorrect_type` | `empty` | `too_long`

##### Response:

```json
{
    "success": boolean,
    "data": {
            pid: number,
            id: number,
            name: string,
            column: string,
            allowEnumeration: boolean,
            allowMultipleValues: boolean
    }[]
}
```

## TODO LIST

- `NUMBER` type can have 17 figure maximum
- @TODO: Fix TYPE Field (required and simplify form value validator)
- @TODO: Refactor: "unit" (ValueDTO) to "unitValueId"                     
- @TODO: Delete form value on:
    - Enumerator Type Change
    - Field Type Change
- @TODO: Add default value on "New Required Field"
- @TODO: Add documentation for each endpoint and specify potential return/errors
- @TODO: Tests