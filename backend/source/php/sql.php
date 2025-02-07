<?php

namespace mate;

class SQL
{
    // ----------------------------------------
    // UNIT
    // ----------------------------------------

    public const UNIT_INSERT = <<<SQL
        INSERT INTO mate_unit
        (
            `name`,
            `description`
        )
        VALUES
        (
            :name,
            :description
        )
        SQL;

    public const UNIT_UPDATE = <<<SQL
        UPDATE mate_unit
        SET
            `name` = :name,
            `description` = :description
        WHERE `id` = :id
        SQL;

    public const UNIT_VALUE_INSERT = <<<SQL
        INSERT INTO mate_unit_value
        (
            `value`,
            `unitId`,
            `position`
        )
        VALUES
        (
            :value,
            :unitId,
            :position
        )
        SQL;

    public const UNIT_VALUE_UPDATE = <<<SQL
        UPDATE mate_unit_value
        SET
            `value` = :value,
            `position` = :position
        WHERE `id` = :id
        SQL;

    // ----------------------------------------
    // ENUMERATOR
    // ----------------------------------------

    public const ENUMERATOR_INSERT = <<<SQL
        INSERT INTO mate_enumerator
        (
            `name`,
            `description`,
            `typeId`
        )
        VALUES
        (
            :name,
            :description,
            :typeId
        )
        SQL;

    public const ENUMERATOR_UPDATE = <<<SQL
        UPDATE mate_enumerator
        SET
            `name` = :name,
            `description` = :description,
            `typeId` = :typeId
        WHERE `id` = :id
        SQL;

    public const ENUMERATOR_VALUE_INSERT = <<<SQL
        INSERT INTO mate_enumerator_value
        (
            `enumeratorId`,
            `position`,
            `text`,
            `number`,
            `date`
        )
        VALUES
        (
            :enumeratorId,
            :position,
            :text,
            :number,
            :date
        )
        SQL;

    public const ENUMERATOR_VALUE_UPDATE = <<<SQL
        UPDATE mate_enumerator_value
        SET
            `enumeratorId` = :enumeratorId,
            `position` = :position,
            `text` = :text,
            `number` = :number,
            `date` = :date
        WHERE `id` = :id
        SQL;

    public const ENUMERATOR_VALUE_DELETE_BY_ENUMERATOR_ID = <<<SQL
        DELETE FROM mate_enumerator_value
        WHERE `enumeratorId` = :enumeratorId
        SQL;

    // ----------------------------------------
    // IMAGE
    // ----------------------------------------

    public const IMAGE_INSERT = <<<SQL
        INSERT INTO mate_image 
        (
            `name`,
            `relative`
        )
        VALUES
        (
            :name,
            :relative
        )
        SQL;

    public const IMAGE_UPDATE = <<<SQL
        UPDATE mate_image
        SET
            `name` = :name,
            `relative` = :relative
        WHERE `id` = :id
        SQL;

    // ----------------------------------------
    // TEMPLATE
    // ----------------------------------------

    // ----------------------------------------
    // GROUP
    // ----------------------------------------

    public const GROUP_INSERT = <<<SQL
        INSERT INTO mate_group
        (
            `name`,
            `description`,
            `position`,
            `templateId`,
            `parentId`
        )
        VALUES
        (
            :name,
            :description,
            0,
            :templateId,
            :parentId
        )
        SQL;

    public const GROUP_UPDATE = <<<SQL
        UPDATE mate_group
        SET
            `name` = :name,
            `description` = :description,
            `parentId` = :parentId
        WHERE `id` = :id
        SQL;

    public const GROUP_SELECT_BY_TEMPLATE_ID = <<<SQL
        SELECT * FROM mate_group
        WHERE `templateId` = :templateId
        AND `parentId` IS NULL
        SQL;

    public const GROUP_SELECT_BY_PARENT_ID = <<<SQL
        SELECT * FROM mate_group
        WHERE `parentId` = :parentId
        SQL;

    public const GROUP_UPDATE_POSITION = <<<SQL
        UPDATE mate_group
        SET `position` = :position
        WHERE `id` = :id
        SQL;

    // ----------------------------------------
    // FIELD
    // ----------------------------------------

    public const FIELD_INSERT = <<<SQL
        INSERT INTO mate_field
        (
            `name`,
            `description`,
            `groupId`,
            `position`,
            `isRequired`,
            `allowMultipleValues`,
            `typeId`,
            `enumeratorId`,
            `unitId`
        )
        VALUES
        (
            :name,
            :description,
            :groupId,
            0,
            :isRequired,
            :allowMultipleValues,
            :typeId,
            :enumeratorId,
            :unitId
        )
        SQL;

    public const FIELD_UPDATE = <<<SQL
        UPDATE mate_field
        SET
            `name` = :name,
            `description` = :description,
            `groupId` = :groupId,
            `isRequired` = :isRequired,
            `allowMultipleValues` = :allowMultipleValues,
            `typeId` = :typeId,
            `enumeratorId` = :enumeratorId,
            `unitId` = :unitId
        WHERE `id` = :id
        SQL;

    public const FIELD_UPDATE_POSITION = <<<SQL
        UPDATE mate_field
        SET `position` = :position
        WHERE `id` = :id
        SQL;

    public const FIELD_SELECT_BY_GROUP_ID = <<<SQL
        SELECT * FROM mate_field
        WHERE `groupId` = :groupId
        ORDER BY `position` ASC
        SQL;

    public const FIELD_SELECT_BY_TEMPLATE_ID = <<<SQL
        SELECT mtf.*
        FROM mate_field mtf 
        LEFT JOIN mate_template_group mtg ON mtg.id = mtf.groupId
        LEFT JOIN mate_template mt ON mt.id  = mtg.templateId
        WHERE mt.id  = :templateId
        ORDER BY mtf.position ASC
        SQL;
}
