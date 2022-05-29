import React, {useRef, useState } from 'react'
import { Form, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom"
import { useSnackbar } from 'notistack';
import Logo from "../Image/logo1.png"
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passConfirmRef = useRef()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()
    const { signup, login } = useAuth()
    const [ handleError, setError] = useState("")
    const [ loading, setLoading] = useState(false)
    //For data
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repeat, setRepeat] = useState("")

    const clear = () => {
        setEmail("")
        setPassword("")
        setRepeat("")
    }
    async function handleSubmit(e){
        e.preventDefault()
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(document.getElementById("emailControlForm").value.match(validRegex)){
        if(passwordRef.current.value.length >= 6){
            if(passwordRef.current.value === passConfirmRef.current.value){
                try{
                    setError("")
                    setLoading(true)
                    await signup(emailRef.current.value, passwordRef.current.value).then(() => {
                        handleLogin(e)
                        history.push("/signup/user-info")
                    })
                    .catch((error) => {
                        console.log(error)
                        enqueueSnackbar("Account already Existed! Try Again!", {variant:'success'})
                        clear()
                    })
                }
                catch(error){
                    console.log(error)
                    enqueueSnackbar("Something went wrong!", {variant:'warning'})
                }
            }
            else{
                document.getElementById("passwordControlForm").focus()
                return enqueueSnackbar("Password does not match", {variant:'warning'})
            }
        }
        else{
            document.getElementById("passwordControlForm").focus()
            enqueueSnackbar("Password must be more than 6 character!", {variant:'warning'})
        }
        }
        else{
            document.getElementById("emailControlForm").focus()
            enqueueSnackbar("Invalid email address!", {variant: 'warning'})
        }
        setLoading(false)
    }
    async function handleLogin(e){
        e.preventDefault()
        await login(emailRef.current.value, passwordRef.current.value)
    }
    return (
    <>
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="w-100" style= {{ maxWidth: "400px" }}>
            <div className="text-center mb-4" >
                <img src={ Logo } alt="Rentana logo" height="95px"/>
                <h1>Welcome to RenTana</h1>
                <h2 className="text-center mb-4">Sign up</h2>
            </div>
            <Card>
                <Card.Body> 
                    {handleError && <Alert variant="danger">{handleError}</Alert>}
                    <Form noValidate /* validated={validated} */ onSubmit={handleSubmit}>
                        
                        <Form.Group id="email" contolid="validationControl01" className="mb-4">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                id="emailControlForm"
                                type="email" 
                                ref={emailRef} 
                                onChange={(e) => setEmail(emailRef.current.value)}
                                value={email}
                                placeholder="example@example.com"
                                required />
                        </Form.Group>

                        <Form.Group id="pass" contolid="validationControl02" className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                id="passwordControlForm"
                                type="password" 
                                ref={passwordRef} 
                                onChange={(e) => setPassword(passwordRef.current.value)}
                                value={password}
                                required />
                        </Form.Group>

                        <Form.Group id="pass-confirm" contolid="validationControl01" className="mb-4">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                ref={passConfirmRef} 
                                onChange={(e) => setRepeat(passConfirmRef.current.value)}
                                value={repeat}
                                required />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                            <Form.Check
                                required
                                label="Terms and Agreement"
                                feedback="Must agree to continue"
                                feedbackType="invalid"/>
                        </Form.Group>
                        
                        <Form.Group id="button" className="text-center">
                            <Button disabled={loading} className="w-50 mb-4" type="submit" variant="success">
                                Continue <ArrowForwardIcon/>
                            </Button>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="w-100 text-center mb-4">
                                Already have an account? 
                                <Link to="/login" className="link-text-black"> Log In</Link>
                            </Form.Label>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>            
        </div>
    </Container>
    </>
    )
}