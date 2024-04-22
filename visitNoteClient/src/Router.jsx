import { useRoutes } from "react-router-dom";
import { AdminLayout } from "./layout/AdminLayout";
import { HomeTemplate } from "./Templates/HomeTemplate";

function Router() {
  return useRoutes([
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        {
          element: <HomeTemplate />,
          index: true,
        },
      ],
    },
  ]);
}

export default Router;
