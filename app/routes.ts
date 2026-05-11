import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("configurator", "routes/configurator.tsx"),
  route("productinfopage", "routes/productinfopage.tsx"),
  route("tuinmaximaal-styleguide", "routes/tuinmaximaal-styleguide.tsx"),
] satisfies RouteConfig;
