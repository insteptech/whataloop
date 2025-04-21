// Content for fields.js
exports.routeParams = [
  {
    route: "category/create",
    params: { name: "", parentId: "" },
    queryParams: [],
    authRequired: true,
    method: "post",
    tag: "Category",
  },
  {
    route: "category/update/{id}",
    params: { name: "", parentId: 0, id: 0 },
    authRequired: true,
    method: "put",
    tag: "Category",
  },
  {
    route: "category/{id}",
    params: {},
    queryParams: [{ name: "id", type: "integer", required: true, in: "path" }],
    authRequired: true,
    method: "get",
    tag: "Category",
  },

  {
    route: "category/{id}",
    params: {},
    queryParams: [{ name: "id", type: "integer", required: true, in: "path" }],
    authRequired: true,
    method: "delete",
    tag: "Category",
  },
  {
    route: "category/",
    params: {},
    queryParams: [],
    authRequired: false,
    method: "get",
    tag: "Category",
  },
];
