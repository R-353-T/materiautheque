create table if not exists mate_template_group (
    `id` int unsigned not null auto_increment primary key,
    `name` varchar(255) not null,
    `description` text not null,
    `position` int unsigned not null,
    `templateId` int unsigned not null,
    `parentId` int unsigned,

    constraint `mate_template_group__templateId` foreign key (`templateId`) references mate_template (`id`) on delete cascade,
    constraint `mate_template_group__parentId` foreign key (`parentId`) references mate_template_group (`id`) on delete cascade
);