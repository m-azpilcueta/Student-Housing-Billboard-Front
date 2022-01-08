import PisoDetail from "@/entities/piso/PisoDetail";
import PisoForm from "@/entities/piso/PisoForm";
import PisoList from "@/entities/piso/PisoList";

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
  {
    name: "PisoUpdate",
    path: "/pisos/:id/edit",
    component: PisoForm,
  },
  {
    name: "PisoList",
    path: "/pisos",
    component: PisoList,
    meta: { public: true },
  },
];

export default routes;
