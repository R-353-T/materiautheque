create table if not exists mate_template_field (
    `id` int unsigned not null auto_increment primary key,
    `name` varchar(255) not null,
    `description` text not null,
    `allowMultipleValues` boolean not null,
    `isRequired` boolean not null,
    `groupId` int unsigned not null,
    `position` int unsigned not null,
    `typeId` int unsigned not null,
    `enumeratorId` int unsigned,
    `unitId` int unsigned,

    constraint `mate_template_field__typeId` foreign key (`typeId`) references mate_type (`id`),
    constraint `mate_template_field__groupId` foreign key (`groupId`) references mate_template_group (`id`) on delete cascade,
    constraint `mate_template_field__enumeratorId` foreign key (`enumeratorId`) references mate_enumerator (`id`) on delete cascade,
    constraint `mate_template_field__unitId` foreign key (`unitId`) references mate_unit (`id`)
);