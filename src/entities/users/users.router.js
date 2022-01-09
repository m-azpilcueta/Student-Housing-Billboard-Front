import UsersList from "./UsersList";
import Register from "@/components/Register";
import UsersProfile from "./UsersProfile";
import Favoritos from "@/entities/piso/Favoritos";

const routes = [
  {
    name: "UsersList",
    path: "/users",
    component: UsersList,
  },
  {
    path: "/users/:id",
    name: "UsersProfile",
    component: UsersProfile,
  },
  {
    name: "UsersUpdate",
    path: "/users/:id/update",
    component: Register,
  },
  {
    name: "Favorites",
    path: "/users/:id/favorites",
    component: Favoritos,
  },
];

export default routes;
