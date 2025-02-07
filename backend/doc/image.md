
### Image

#### **`/image/list`**

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
        "relative": string,
        "url": string
    }[],
    "pagination": {
        "index": number, // current page index
        "size": number, // current page size
        "total": number // last page index
    }
}
```

#### **`/image/get`**

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
        "relative": string,
        "url": string
    }
}
```

#### **`/image/delete`**

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

#### **`/image/create`**

##### Request:

**FormData Multipart**

```json
{
    "name": string,
    "file": File
}
```

- name: `required` | `incorrect_type` | `empty` | `too_long` | `unique`*
- file: `required` | `incorrect_type` | `file_not_supported`* | `file_too_large`*

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "relative": string,
        "url": string
    }
}
```

#### **`/image/update`**

##### Request:

**FormData Multipart**

```json
{
    "name": string,
    "file": File|null
}
```

- id: `required` | `incorrect_type` | `not_found` 
- name: `required` | `incorrect_type` | `empty` | `too_long` | `unique`*
- file: `incorrect_type` | `file_not_supported`* | `file_too_large`*

##### Response:

```json
{
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "relative": string,
        "url": string
    }
}
```
