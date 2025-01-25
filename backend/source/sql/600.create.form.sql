create table if not exists mate_form (
    `id` int unsigned not null auto_increment primary key,
    `name` varchar(255) not null,
    `createdAt` timestamp not null default current_timestamp,
    `updatedAt` timestamp not null default current_timestamp,
    `templateId` int unsigned not null,

    constraint `mate_form__templateId` foreign key (`templateId`) references mate_template (`id`) on delete cascade
);
