import { UserRole } from "src/app/v1/enum/UserRole";

export const environment = {
  production: true,
  api: {
    baseUrl: 'https://api.alexandrefougea.com/wp-json',
    authentication: {
      login: "jwt-auth/v1/token",
      validate: "jwt-auth/v1/token/validate"
    },
    type: {
      list: "mate/type/list",
      get: "mate/type/get"
    },
    image: {
      create: "mate/image/create",
      list: "mate/image/list",
      get: "mate/image/get",
      update: "mate/image/update",
      delete: "mate/image/delete"
    },
    unit: {
      create: "mate/unit/create",
      list: "mate/unit/list",
      get: "mate/unit/get",
      update: "mate/unit/update",
      delete: "mate/unit/delete"
    },
    enumerator: {
      create: "mate/enumerator/create",
      list: "mate/enumerator/list",
      get: "mate/enumerator/get",
      update: "mate/enumerator/update",
      delete: "mate/enumerator/delete"
    },
    template: {
      list: "mate/template/list",
      get: "mate/template/get",
      update: "mate/template/update",
    },
    group: {
      create: "mate/group/create",
      list: "mate/group/list",
      get: "mate/group/get",
      update: "mate/group/update",
      delete: "mate/group/delete",
      sort: "mate/group/sort"
    },
    field: {
      create: "mate/field/create",
      list: "mate/field/list",
      get: "mate/field/get",
      update: "mate/field/update",
      delete: "mate/field/delete",
      sort: "mate/field/sort"
    },
    form: {
      create: "mate/form/create",
      list: "mate/form/list",
      get: "mate/form/get",
      update: "mate/form/update",
      delete: "mate/form/delete"
    }
  },
  permission: {
    image: {
      create: UserRole.EDITOR,
      update: UserRole.EDITOR,
      delete: UserRole.EDITOR,
      list: UserRole.SUBSCRIBER,
      get: UserRole.SUBSCRIBER
    },
    enumerator: {
      create: UserRole.EDITOR,
      update: UserRole.EDITOR,
      delete: UserRole.EDITOR,
      list: UserRole.SUBSCRIBER,
      get: UserRole.SUBSCRIBER
    },
    unit: {
      create: UserRole.EDITOR,
      update: UserRole.EDITOR,
      delete: UserRole.EDITOR,
      list: UserRole.SUBSCRIBER,
      get: UserRole.SUBSCRIBER
    },
    template: {
      list: UserRole.EDITOR
    },
    group: {
      create: UserRole.EDITOR,
      update: UserRole.EDITOR,
      delete: UserRole.EDITOR,
      list: UserRole.SUBSCRIBER,
      get: UserRole.SUBSCRIBER
    },
    field: {
      create: UserRole.EDITOR,
      update: UserRole.EDITOR,
      delete: UserRole.EDITOR,
      list: UserRole.SUBSCRIBER,
      get: UserRole.SUBSCRIBER
    },
    form: {
      create: UserRole.AUTHOR,
      update: UserRole.AUTHOR,
      delete: UserRole.EDITOR,
      list: UserRole.SUBSCRIBER,
      get: UserRole.SUBSCRIBER
    }
  }
};
