import React from "react";
import Navbar from "../components/navbar";
import styled from "styled-components";

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
    margin-top: 15vh;
    color: white;
    font-size: 40px;
    @media (max-width: 768px) {
        margin-top: 12vh;
    }
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
        align-items: start;
    }
    
`
const MusicProvider1 = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 25vh;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    text-decoration: none;
    background: #5C5C5C;
    padding: 15px;
    overflow: hidden;`
const MusicProvider2 = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 25vh;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    text-decoration: none;
    background: #5C5C5C;
    padding: 15px;
    overflow: hidden;`

const Content = styled.button`
    color: white;
    font-size: 30px;
    background: none;
    border: none;
    width: 100%;
    height: fit-content;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    &:hover {
        background: #4F4D4D;
    }
    @media (max-width: 768px) {
        flex-direction: row;
        font-size: 20px;
        margin: 25px;
    }`
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    height: fit-content;
    text-align:center;
    align-items: center;
    margin: 2rem;
    @media (max-width: 768px) {
        flex-direction: row;
        width: 40%;
    }`
const Description = styled.p`
    color: white;
    font-size: 20px;
    @media (max-width: 768px) {
        display: flex;
        position: absolute;
        width: 30%;
        right: 15%;
    }`

const Start = styled.button`
    background: #2085B0;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    width: 10%;
    height: 80px;
    font-size: 20px;
    &:hover {
        background: #60C3EE;
        translate: scale(1.1);
        transform: scale(1.1);
    }
    @media (max-width: 768px) {
        width: 40%;
        margin-left: 25%;
    }`
const Library = () => {
    return (
        <MainArea>
            <Navbar/>
            <Title>Library Transfer</Title>
            <ServicesSection>
                <Container>
                    <MusicProvider1>
                        <Content>Amazon-Music</Content>
                        <Content>Spotify</Content>
                    </MusicProvider1>
                    <Description>The music provider you are transferring from</Description>
                </Container>
                <Start>Start Transfer</Start>
                <Container>
                    <MusicProvider2>
                        <Content>Amazon-Music</Content>
                        <Content>Spotify</Content>
                    </MusicProvider2>
                    <Description>The music provider you are transferring to</Description>
                </Container>
            </ServicesSection>
        </MainArea>
    )
}


export default Library;