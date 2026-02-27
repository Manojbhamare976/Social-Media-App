import { useState, useEffect } from "react";
import api from "../api/axiosUserClient";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Following.css";
export default function Following() {
  const navigate = useNavigate();
  let [following, setFollowing] = useState([]);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    async function getFollowing() {
      let res = await api.get(`/userprofile/following/${userId}`);
      console.log(res.data);
      setFollowing(res.data);
    }
    getFollowing();
  }, []);

  return (
    <div className="following-list">
      {following?.following?.length > 0
        ? following?.following?.map((f) => (
            <div
              className="following-user"
              key={f._id}
              onClick={() =>
                navigate({
                  pathname: "/userprofile",
                  search: `?userId=${f._id}`,
                })
              }
            >
              <img src={f.profilePic} />
              <div className="user-detail">
                <p className="poppins-medium">{f.username}</p>
                <p className="user-bio noto-serif">{f.bio}</p>
              </div>
            </div>
          ))
        : null}
    </div>
  );
}
