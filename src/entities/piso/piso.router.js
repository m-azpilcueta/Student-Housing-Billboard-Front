import PisoDetail from "@/entities/piso/PisoDetail";
import PisoForm from "@/entities/piso/PisoForm";

const routes = [
  {
    name: "PisoDetail",
    path: "/pisos/:id",
    component: PisoDetail,
    meta: { public: true },
  },
  {
    name: "PisoCreate",
    path: "/pisos/new",
    component: PisoForm,
  },
];

export default routes;
