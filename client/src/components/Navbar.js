import React from "react"
import styled from "styled-components"
import logo from "../header-logo.png"
import { useNavigate } from "react-router-dom";
import MenuComponent from "./MenuComponent";

const Nav = styled.nav`
    background: #393B40;
    height: 130px;
    display: flex;
    flex-direction: row;
    position: absolute;
    width: 100%;
    align-items: center;
    box-shadow: 0 0 20px 10px black;
    @media (max-width: 768px) {
        flex-direction: column;
        height: 130px;
    }
`
const Title = styled.h1`
    position: relative;
    left: 0;
    padding-left: 30px;
    cursor: pointer;
    @media (max-width: 768px) {
        padding-left: 0px;
        bottom: 40px;
    }
`
const Img = styled.img`
    height: 180px;

`

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <Nav>
            <Title onClick={() => navigate("/")}> <Img src={logo} alt="Logo" /> </Title>
            <MenuComponent />
        </Nav>
    )
}


export default Navbar