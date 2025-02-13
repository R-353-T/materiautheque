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

* [Type](./backend/doc/type.md)
* [Unit](./backend/doc/unit.md)
* [Enumerator](./backend/doc/enumerator.md)
* [Image](./backend/doc/image.md)
* [Template](./backend/doc/image.md)
    * [Group]()
    * [Field]()
* [Form]()

## TODO LIST

- `NUMBER` type can have 17 figure maximum
- @TODO: Add default value on "New Required Field"
- @TODO: Tests