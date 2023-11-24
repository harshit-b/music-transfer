import React from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";

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
    margin-top: 12vh;
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
    cursor: pointer;`
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
    return (
        <MainArea>
            <Navbar />
            <Title>Our Services</Title>
            <ServicesSection>
                <Container>
                    <Library>
                        <Content>Library Transfer</Content>
                    </Library>
                    <Description>Choose this option to transfer your entire music library</Description>
                </Container>
                <Container>
                    <Playlist>
                        <Content>Playlist Transfer</Content>
                    </Playlist>
                    <Description>Choose this option to transfer a playlist using a link</Description>
                </Container>
            </ServicesSection>
        </MainArea>
    )
}



export default Services