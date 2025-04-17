
export const FORM_INPUT_ERRORS: Record<string, string> = {
    // Common

    "required": "Une valeur est requise.",

    // Authentication

    "auth_forbidden": "Action refusée",
    "auth_wrong_credentials": "🤔 Il semble que le nom d'utilisateur ou le mot de passe soit incorrect.",

    // ...

    "fobidden": "Action interdite",
    "internal_server_error": "Ooops.. une erreur inattendue est survenue",

    "incorrect": "La valeur est incorrecte un.e $1 attendu.e",
    "not_found": "La référence est introuvable",
    "not_related": "La référence est introuvable ou non relative",
    "unavailable": "La valeur est déjà utilisée",

    "number_min": "La valeur doit à dépassée la limite inférieur de $1",
    "number_max": "La valeur doit à dépassée la limite supérieur de $1",

    "type_not_enum": "Ce type n'est pas énumérable",
    "type_not_multiple": "Ce type ne peut pas contenir plusieurs valeurs",
    "type_not_unit": "Ce type n'est pas unitaire",

    "file_not_supported": "Ce type de fichier n'est pas supporté",
    "file_too_large": "Le fichier est trop volumineux",

    "circular_reference": "La valeur provoque une reference circulaire",
    "template_missmatch": "Le template n'est pas correspondant",
    
    "maxlength": "La valeur est trop longue et doit contenir maximum $1 caractères",
    "icorrectType": "Le type de la valeur du champ est incorrect",
    "icorrectUrl": "Ceci n'est pas une URL valide (http, https ou ftp)",
    "icorrectBoolean": "Ceci n'est pas un booléen valide (true ou false)",
    "icorrectNumber": "Ceci n'est pas un nombre valide (0-9, -, .)",
    "icorrectDecimalFormat": "La valeur du champ ne peut contenir que six decimales et quinze chiffres maximum",
    "icorrectDateFormat": "Le format de la date est incorrect",
}
