import React, {useState} from "react"
import styled from "styled-components"


const LoginPage = styled.div`
    background: #1E1F22;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
`
const MainArea = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 768px) {
        flex-direction: column;
        justify-content: center;
    }
`
const TitleArea = styled.div`
    width: 30%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 5%;
    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        align-items: center;
        margin-left: 0;
        text-align: center;
        padding-bottom: 0;
        padding-right: 0;
    }
`
const Title = styled.h1`
    color: #2085B0;
    font-size: 100px;
    margin: 0;
    text-shadow: 0 0 5px #60C3EE, 0 0 10px #60C3EE, 0 0 15px #60C3EE, 0 0 20px #2085B0;
    @media (max-width: 768px) {
        font-size: 50px;
    }
`
const Logo = styled.h2`
    color: #2085B0;
    font-size: 30px;
    margin-top: none;
    text-shadow: 0 0 4px #60C3EE, 0 0 8px #60C3EE, 0 0 16px #2085B0;
`
const LoginArea = styled.div`
    width: 30%;
    height: 50%;
    margin-right: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #5C5C5C;
    border-radius: 5px;
    box-shadow: 0 0 4px #60C3EE, 0 0 8px #60C3EE, 0 0 16px #2085B0;
    @media (max-width: 768px) {
        display: flex;
        position: relative;
        width: 80%; 
        height: auto;
        top: 0;
        margin-right: 0;
    }
`
const LoginText = styled.h1`
    color: white;
    font-size: 30px;`
const Form = styled.form`
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;`
const Input = styled.input`
    width: 75%;
    height: 30px;
    margin: 10px;
    border-radius: 5px;
    border: none;
    background: #1E1F22;
    color: white;
    transition: background-color 5000s ease-in-out 0s;
    &:-webkit-autofill {
        -webkit-text-fill-color: white !important; // Override text color
        -webkit-box-shadow: 0 0 0px 1000px #1E1F22 inset; // Trick to override background color
        transition: background-color 5000s ease-in-out 0s;
    }
`
const Button = styled.button`
    width: 25%;
    height: 30px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background: #2085B0;
    &:hover {
        background: #60C3EE;
    }
`
const BottomText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    `
const SignUpButton = styled.button`
    background: none;
    border: none;
    text-decoration: underline;
    font-size: 15px;
    color: white;
    cursor: pointer;
    &:hover {
        color: #2085B0;
        font-size: 14px;
    }`

const SignupArea = styled.div`
    display: flex;
    width: 30%;
    height: 60%;
    margin-right: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #5C5C5C;
    border-radius: 5px;
    box-shadow: 0 0 4px #60C3EE, 0 0 8px #60C3EE, 0 0 16px #2085B0;
    @media (max-width: 768px) {
        display: flex;
        position: relative;
        width: 80%; 
        height: auto;
        top: 0;
        margin-right: 0;
        padding-bottom: 3rem;
    }
    `
const PasswordWrapper = styled.div`
    position: relative;
    width: 80%;
    margin: 10px;
`
const PasswordButton = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
`

const Login = () => {
    
    const [showLogin, setShowLogin] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = (event) => {
        event.preventDefault();
        setPasswordVisible(!passwordVisible);
    };

    
    // Toggle between login and signup
    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <LoginPage>
           <MainArea>
                <TitleArea>
                    <Title>Treble Music Transfer</Title>
                    <Logo>Music has no boundaries</Logo>
                </TitleArea>
                {showLogin ? (
                <LoginArea id='Login'>
                    <LoginText>Login</LoginText>
                    <Form>
                        <Input type="text" placeholder="Username" />
                        <PasswordWrapper>
                            <Input 
                                type={passwordVisible ? "text" : "password"} 
                                placeholder="Password" 
                            />
                            <PasswordButton onClick={togglePasswordVisibility}>
                                {passwordVisible ? "Hide" : "Show"}
                            </PasswordButton>
                        </PasswordWrapper>
                        <Button type="submit">Login</Button>
                        <BottomText>
                            <p>Don't have an account?<SignUpButton id='Signup' onClick={toggleForm}>Sign up here</SignUpButton></p>
                            <SignUpButton id='continue'>Continue without account</SignUpButton>
                        </BottomText>
                    </Form>
                </LoginArea>
                ) : (
                <SignupArea id='SignupArea' display='none'>
                    <Form>
                        <LoginText>Welcome Friend!</LoginText>
                        <Input type="text" placeholder="Username" />
                        <Input type="text" placeholder="First Name" />
                        <Input type="text" placeholder="Email" />
                        <Input type="password" placeholder="Password" />
                        <Input type="password" placeholder="Confirm Password" />
                        <Button type="submit">Sign Up</Button>
                    </Form>
                </SignupArea>
                )}
           </MainArea>
        </LoginPage>
    )
}



export default Login