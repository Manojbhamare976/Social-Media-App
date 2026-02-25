import MainLayout from "../layouts/MainLayout.jsx";
import Homepage from "../pages/Homepage.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import CreateComment from "../pages/CreateComment.jsx";
import SearchUser from "../pages/Search.jsx";
import Userprofile from "../pages/Profilepage.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import UserProfile from "../pages/UserProfile.jsx";
import Signup from "../userAuth/Signup.jsx";
import Login from "../userAuth/Login.jsx";
import Followers from "../pages/Followers.jsx";
import Following from "../pages/Following.jsx";

const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/find/user", element: <SearchUser /> },
      { path: "/post/create", element: <CreatePost /> },
      { path: "/userprofile/user", element: <Userprofile /> },
      { path: "/userprofile", element: <UserProfile /> },
      { path: "/userprofile/followers", element: <Followers /> },
      { path: "/userprofile/following", element: <Following /> },
    ],
  },

  // pages WITHOUT sidebar
  { path: "/comment", element: <CreateComment /> },
  { path: "/userprofile/update", element: <EditProfile /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
];

export default routes;
