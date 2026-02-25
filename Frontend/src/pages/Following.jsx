import { useState, useEffect } from "react";
import api from "../api/axiosUserClient";
import { useSearchParams, useNavigate } from "react-router-dom";
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
    <div>
      {following?.following?.length > 0
        ? following?.following?.map((f) => (
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
              <p>{f.username}</p>
              <p>{f.bio}</p>
            </div>
          ))
        : null}
    </div>
  );
}
