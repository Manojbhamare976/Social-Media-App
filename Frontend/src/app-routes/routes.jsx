import Homepage from "../pages/Homepage.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import CreateComment from "../pages/CreateComment.jsx";
import SearchUser from "../pages/Search.jsx";
import Userprofile from "../pages/Profilepage.jsx";

const routes = [
  { path: "/", element: <Homepage /> },
  { path: "/post/create", element: <CreatePost /> },
  { path: "/comment", element: <CreateComment /> },
  { path: "/find/user", element: <SearchUser /> },
  { path: "/userprofile/user", element: <Userprofile /> },
];

export default routes;
