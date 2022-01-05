import PisoDetail from "@/entities/piso/PisoDetail";
import PisoForm from "@/entities/piso/PisoForm";

const routes = [
  {
    name: "PisoForm",
    path: "/pisos/new",
    component: PisoForm,
  },
  {
    name: "PisoDetail",
    path: "/pisos/:id",
    component: PisoDetail,
    meta: { public: true },
  },
];

export default routes;
