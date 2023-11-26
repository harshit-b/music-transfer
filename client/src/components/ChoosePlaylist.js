//Home Page where all playlists of various streaming platforms can be populated 

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import styled from "styled-components";
import Navbar from "./Navbar";
import Spotify from "./Spotify"
// import AmazonMusic from "./AmazonMusic";
import Youtube from "./Youtube";

const MainArea = styled.div`
  display: flex;
  background: #1E1F22;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: top;
  text-transform: uppercase;
`
const Span = styled.span`
  color: rgb(152, 157, 158);
`
const User = styled.h4`
  margin-top: 4em;
  color: white;
  font-size: 44px;
`
const MusicApps = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  color: white;
  font-size: 30px
`

const ChoosePlaylist = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const[userId, setUserId] = useState(null);

  const verifyCookie = async () => {
    if (!cookies.token) {
      navigate("/login");
    }
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}`,
      {},
      { withCredentials: true }
    );
    const { status, user, userId } = data;
    setUserId(userId);
    setUsername(user);
    return status
      ? toast(`Oooh ${user} is ready to transfer some playlists!!`, {
          position: "top-right",
        })
      : (removeCookie("token"), 
            // {domain : process.env.REACT_APP_DOMAIN, sameSite:'none', secure:true}), 
            navigate("/login"));
  };

  useEffect(() => {
    verifyCookie();
  }, []);
  
  return (
    <>
    {(userId) ? (
      <>
        <MainArea>
          <Navbar />
          {/* <div className="home_page"> */}
          <User> Welcome <Span> {username} </Span> </User>
            {/* Spotify Component */}
            <MusicApps>
              <Spotify userId={userId}/>
              {/* Add More Components like spotify for other music apps  */}
              {/*<AmazonMusic userId={userId}/>*/}
              <Youtube userId={userId} />
            </MusicApps>
          {/* </div> */}
        </MainArea>
        <ToastContainer />
      </>
    ) : (
      <div className="form-comp cfb">
        Loading...
      </div>
    )}
  </>
  );
};

export default ChoosePlaylist;