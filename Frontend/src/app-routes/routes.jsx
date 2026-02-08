import Homepage from "../pages/Homepage.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import CreateComment from "../pages/CreateComment.jsx";
import SearchUser from "../pages/Search.jsx";

const routes = [
  { path: "/", element: <Homepage /> },
  { path: "/post/create", element: <CreatePost /> },
  { path: "/comment", element: <CreateComment /> },
  { path: "/find/user", element: <SearchUser /> },
];

export default routes;
