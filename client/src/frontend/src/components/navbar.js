import React from "react"
import styled from "styled-components"
import {BiMenu} from "react-icons/bi"

const Nav = styled.nav`
    background: #393B40;
    height: 60px;
    display: flex;
    flex-direction: row;
    position: fixed;
    width: 100%;
    align-items: center;
    box-shadow: 0 0 20px 10px #48abe0;
    z-index: 999;
`
const Title = styled.h1`
    position: absolute;
    left: 0;
    color: #2085B0;
    font-size: 30px;
    margin: auto;
    font-weight: 500;
    padding-left: 10px;
`
const Menu  = styled.ul`
    display: flex;
    flex-direction: row;
    margin: auto;
    padding-right: 20px;
    display: none;
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
`

const Navbar = () => {
    
    return (
        <Nav>
            <Title>Treble Music Transfer</Title>
            <Bars />
            <Menu>
                <MenuItem>Account</MenuItem>
                <MenuItem>Library Transfer</MenuItem>
                <MenuItem>Playlist Transfer</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </Nav>
    )
}


export default Navbar