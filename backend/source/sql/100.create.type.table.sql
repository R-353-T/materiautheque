create table if not exists mate_type (
    `pid` int unsigned not null auto_increment primary key,
    `id` int unsigned unique not null,
    `name` varchar(255) unique not null,
    `column` varchar(255) not null,
    `allowEnumeration` boolean not null,
    `allowMultipleValues` boolean not null
);
