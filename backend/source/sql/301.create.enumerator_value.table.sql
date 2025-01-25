create table if not exists mate_enumerator_value (
    `id` int unsigned not null auto_increment primary key,
    `text` text,
    `number` decimal(16,6),
    `date` timestamp,
    `enumeratorId` int unsigned not null,
    `position` int unsigned not null,

    constraint `mate_enumerator_value__enumeratorId` foreign key (`enumeratorId`) references mate_enumerator (`id`) on delete cascade
);