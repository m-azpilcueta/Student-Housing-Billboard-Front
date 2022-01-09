//import UsersList from "./UsersList";
import Register from "@/components/Register";
import UsersProfile from "./UsersProfile";

const routes = [
  /* {
      name: "UsersList",
      path: "/users",
      component: UsersList,
      meta: { public: true },
    },*/
  {
    path: "/users/:id",
    name: "UsersProfile",
    component: UsersProfile,
    meta: { public: true },
  },
  {
    name: "UsersUpdate",
    path: "/users/:id/update",
    component: Register,
    meta: { public: true },
  },
];

export default routes;
