import { useState, useEffect } from "react";
import api from "../api/axiosUserClient";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Followers() {
  const navigate = useNavigate();
  let [followers, setFollowers] = useState([]);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    async function getFollowers() {
      let res = await api.get(`/userprofile/followers/${userId}`);
      console.log(res.data);
      setFollowers(res.data);
    }
    getFollowers();
  }, []);

  return (
    <div>
      {followers?.followers?.length > 0
        ? followers?.followers?.map((f) => (
            <div
              key={f._id}
              onClick={() =>
                navigate({
                  pathname: "/userprofile",
                  search: `?userId=${f._id}`,
                })
              }
            >
              <img src={f.profilePic} />
              <div>
                <p>{f.username}</p>
                <p>{f.bio}</p>
              </div>
            </div>
          ))
        : null}
    </div>
  );
}
