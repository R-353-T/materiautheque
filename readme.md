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

### TYPES

| * | Nom           | Description                   | Règles                    |
| -:|:-             |:-                             |:-                         |
| 1 | Label         | Petit texte                   | Max: 255 caractères       |
| 2 | Texte         | Long texte                    | Max: 65535 caractères     |
| 3 | URL           | Une adresse web               | Max: 4096 caractères, [RFC 2396](https://datatracker.ietf.org/doc/html/rfc2396) |
| 4 | Booléen       | Vrai ou Faux                  | `true` ou `false`         |
| 5 | Nombre        | Entier & Décimal imprécis     | Max: 9,999,999,999.999999 |
| 6 | Argent        | Entier & Décimal précis       | Min: -∞ Max: +∞ |
| 7 | Date          | Un timestamp                  | Min: `1970-01-01` Max: `2038-01-19 03:14:07` |
| 8 | Image         | Une image                     | `.png`, `.jpeg` ou `.jpg` |
| 9 | Formulaire    | L'identifiant d'un formulaire | Un test ou un matériau    |
