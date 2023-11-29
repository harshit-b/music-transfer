import React from "react"
import styled from "styled-components"
import {BiMenu} from "react-icons/bi"
import logo from "../header-logo.png"
import { useNavigate } from "react-router-dom";
import MenuComponent from "./MenuComponent";

const Nav = styled.nav`
    background: #393B40;
    height: 105px;
    display: flex;
    flex-direction: row;
    position: fixed;
    width: 100%;
    align-items: center;
    box-shadow: 0 0 20px 10px black;
    z-index: 999;
`
const Title = styled.h1`
    position: absolute;
    left: 0;
    ${'' /* color: #2085B0;
    font-size: 30px; */}
    ${'' /* margin: auto; */}
    ${'' /* font-weight: 500; */}
    padding-left: 30px;
    cursor: pointer;
`
const Img = styled.img`
    height: 200px;
`
const Menu  = styled.ul`
    display: flex;
    flex-direction: row;
    margin: auto;
    padding-right: 20px;
    display: none;
    cursor: pointer;
`
const MenuItem = styled.li`
    color: white;
    list-style-type: none;
    margin: auto;
    padding: 10px;
    font-size: 10px;
    font-weight: 300;
`
const Bars = styled(BiMenu)`
    position: absolute;
    right: 0;
    color: white;
    padding: 5px;
    height: 40px;
    width: 40px;
    cursor: pointer;
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