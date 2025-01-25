create table if not exists mate_unit (
  `id` int unsigned not null auto_increment primary key,
  `name` varchar(255) not null,
  `description` text not null
);