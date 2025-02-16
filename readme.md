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

## Endpoints

* [Image](./backend/doc/image.md)
* [Type](./backend/doc/type.md)
* [Unit](./backend/doc/unit.md)
* [Enumerator](./backend/doc/enumerator.md)
* [Template](./backend/doc/template.md)
    * [Group](./backend/doc/group.md)
    * [Field](./backend/doc/field.md)
* [Form](./backend/doc/form.md)

## TODO LIST

- `NUMBER` type can have 17 figure maximum
- @TODO: Add default value on "New Required Field"
- @TODO: Tests