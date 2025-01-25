create table if not exists mate_unit_value (
  `id` int unsigned not null auto_increment primary key,
  `text` text not null,
  `unitId` int unsigned not null,
  `position` int unsigned not null,

  constraint `mate_unit_value__unitId` foreign key (`unitId`) references mate_unit (`id`) on delete cascade
);