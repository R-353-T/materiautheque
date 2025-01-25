create table if not exists mate_enumerator (
    `id` int unsigned not null auto_increment primary key,
    `name` varchar(255) not null,
    `description` text not null,
    `typeId` int unsigned not null,

    constraint `mate_enumerator__typeId` foreign key (`typeId`) references mate_type (`id`) on delete cascade
);