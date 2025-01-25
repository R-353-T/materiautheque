insert into mate_type (
    `id`,
    `name`,
    `column`,
    `allowEnumeration`,
    `allowMultipleValues`
)
values
(1,     'Label'         , 'text'    , TRUE  , TRUE  ),
(2,     'Texte'         , 'text'    , TRUE  , TRUE  ),
(3,     'URL'           , 'text'    , TRUE  , TRUE  ),
(4,     'Booléen'       , 'boolean' , FALSE , FALSE ),
(5,     'Nombre'        , 'number'  , TRUE  , TRUE  ),
(6,     'Argent'        , 'text'    , TRUE  , TRUE  ),
(7,     'Date'          , 'date'    , TRUE  , TRUE  ),
(8,     'Image'         , 'exId'    , FALSE , TRUE  ),
(9,     'Formulaire'    , 'exId'    , FALSE , TRUE  );