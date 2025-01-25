create table mate_theme_db_migration (
    `id` int unsigned not null auto_increment primary key,
    `name` varchar(1024) not null,
    `migratedAt` timestamp not null default current_timestamp,

    constraint `mate_theme_db_migration__name` unique (`name`)
);