import Homepage from "../pages/Homepage.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import CreateComment from "../pages/CreateComment.jsx";
import SearchUser from "../pages/Search.jsx";
import Userprofile from "../pages/Profilepage.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import UserProfile from "../pages/UserProfile.jsx";

const routes = [
  { path: "/", element: <Homepage /> },
  { path: "/post/create", element: <CreatePost /> },
  { path: "/comment", element: <CreateComment /> },
  { path: "/find/user", element: <SearchUser /> },
  { path: "/userprofile/user", element: <Userprofile /> },
  { path: "/userprofile/update", element: <EditProfile /> },
  { path: "/userprofile", element: <UserProfile /> },
];

export default routes;
