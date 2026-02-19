import { Routes, Route } from "react-router-dom";
import routes from "./routes.jsx";

function renderRoutes(routes) {
  return routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
}

function AppRoutes() {
  return <Routes>{renderRoutes(routes)}</Routes>;
}

export default AppRoutes;
