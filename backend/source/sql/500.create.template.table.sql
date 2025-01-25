create table if not exists mate_template (
    `id` int unsigned not null auto_increment primary key,
    `name` varchar(255) unique not null
);