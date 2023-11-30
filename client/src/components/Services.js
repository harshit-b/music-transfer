import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Span = styled.span`
    color: rgb(152, 157, 158);
`
const User = styled.h4`
     margin-top: 12rem;
     color: white;
     font-size: 44px;
`
const MainArea = styled.div`
    display: flex;
    background: #1E1F22;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    align-items: center;
    justify-content: top;
`
const Title = styled.h1`
    margin-top: -1rem;
    color: white;
    font-size: 40px;
`
const ServicesSection = styled.div`
    display: flex;
    margin-top: 1rem;
    flex-direction: row;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    @media (max-width: 768px) {
        flex-direction: column;
    }
    
`
const Library = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 25vh;
    justify-content: center;
    border-radius: 15px;
    text-decoration: none;
    background: #5C5C5C;
    padding: 15px;
    cursor: pointer;
`

const Playlist = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 25vh;
    justify-content: center;
    border-radius: 15px;
    text-decoration: none;
    background: #5C5C5C;
    cursor: pointer;
    padding: 15px;`

const Content = styled.h2`
    color: white;
    font-size: 30px;
    text-align: center;`

const Button = styled.button`
    width: 25%;
    height: 30px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    margin-bottom: 1rem;
    background: white;
    &:hover {
        background: #60C3EE;
    }
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    height: fit-content;
    text-align:center;
    align-items: center;
    margin: 2rem;
    @media (max-width: 768px) {
        width: 40%;
    }`

const Description = styled.p`
    color: white;
    font-size: 20px;`

const Services = () => {
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
    const[userId, setUserId] = useState(null);

    const Logout = async () => {
        // console.log(process.env.REACT_APP_DOMAIN)
        // removeCookie("token", {domain : process.env.REACT_APP_DOMAIN, sameSite:'None', secure:true});
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/clearCookie`, {withCredentials:true}).then((res) => {
          console.log(res);
          navigate("/signup");
        });
    };

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
            ? toast(`Hello ${user}`, {
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
        <MainArea>
            <Navbar />
            <User> Welcome <Span> {username} </Span> </User>
            <Title>Our Services</Title>
            <ServicesSection>
                <Container>
                    <Library onClick={() => navigate("/choosePlaylists")}>
                        <Content>Choose Playlists here!</Content>
                    </Library>
                    <Description>Choose this option to choose the playlists you wanna transfer!</Description>
                </Container>
                <Container>
                    <Playlist onClick={() => navigate("/linkTransfer")}>
                        <Content>Got a playlist link?</Content>
                    </Playlist>
                    <Description>Choose this option to transfer a playlist using a link</Description>
                </Container>
            </ServicesSection>
            <Button onClick={Logout}> LOGOUT </Button>
            <ToastContainer />
        </MainArea>
    )
}



export default Services