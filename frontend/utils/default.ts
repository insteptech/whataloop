// utils/defaults.ts

export const defaultUserDetail = {
    id: 1,
    name: "Gagandeep",
    email: "test@example.com"
  };
  
  export const defaultUserPermissions = [
    {
      name: "View Dashboard",
      type: "READ",
      route: "/dashboard",
      action: "VIEW"
    },
    {
      name: "Edit Users",
      type: "WRITE",
      route: "/users",
      action: "EDIT"
    }
  ];
  