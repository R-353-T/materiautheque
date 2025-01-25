create table if not exists mate_form_value (
    `id` int unsigned not null auto_increment primary key,
    `formId` int unsigned not null,
    `fieldId` int unsigned not null,
    `unitValueId` int unsigned,

    `text` text,
    `number` decimal(16,6),
    `boolean` boolean,
    `date` timestamp,
    `exId` int unsigned,

    constraint `mate_form_value__formId` foreign key (`formId`) references mate_form (`id`) on delete cascade,
    constraint `mate_form_value__fieldId` foreign key (`fieldId`) references mate_template_field (`id`) on delete cascade,
    constraint `mate_form_value__unitId` foreign key (`unitValueId`) references mate_unit_value (`id`)    
);