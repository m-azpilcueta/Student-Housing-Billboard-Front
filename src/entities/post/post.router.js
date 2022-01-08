import PostList from "./PostList";
import PostForm from "./PostForm";
import PostDetail from "./PostDetail";

const routes = [
  // /posts/new debe colocarse antes de /posts/:id porque si no vue-router
  // interpreta "new" como si fuera el id.
  //
  // Una forma de evitar este problema es usar una expresión regular para
  // limitar los valores que son interpretados. Por ejemplo, usando el path
  // /posts/:id(\\d+), vue-router espera que :id sea numérico.

  {
    name: "PostList",
    path: "/posts",
    component: PostList,
    meta: { public: true },
  },
  {
    name: "PostCreate",
    path: "/posts/new",
    component: PostForm,
  },
  {
    name: "PostDetail",
    path: "/posts/:id",
    component: PostDetail,
    meta: { public: true },
  },
  {
    name: "PostUpdate",
    path: "/posts/:id/update",
    component: PostForm,
  },
];

export default routes;
