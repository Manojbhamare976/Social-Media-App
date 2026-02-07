import Homepage from "../pages/Homepage.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import CreateComment from "../pages/CreateComment.jsx";

const routes = [
  { path: "/", element: <Homepage /> },
  { path: "/post/create", element: <CreatePost /> },
  { path: "/comment", element: <CreateComment /> },
];

export default routes;
