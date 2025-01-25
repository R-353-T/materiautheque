create table if not exists mate_image (
    `id` int unsigned not null auto_increment primary key,
    `name` varchar(255) not null,
    `relative` varchar(4096) not null
);