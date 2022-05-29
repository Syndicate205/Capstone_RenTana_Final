import React, {useRef, useState } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from "react-router-dom"
import Logo from "../Image/logo1.png"
import { useSnackbar } from 'notistack';

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [ error, setError] = useState("")
    const [ message, setMessage] = useState("")
    const [ loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    async function handleSubmit(e){
        e.preventDefault()
        try{
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            enqueueSnackbar("check your inbox for instructions", {variant: 'info'})
        }
        catch{
            enqueueSnackbar("Accout dosent exsist", {variant: 'error'})
        }
        setLoading(false)
    }
    return (
    <>
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="w-100" style= {{ maxWidth: "400px" }}>
            <div className="text-center mb-4" >
                <img src={ Logo } alt="Rentana logo" height="95px"/>
                <h1>Welcome to RenTana</h1>
            </div>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email" className="mb-4">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group>
                            <Button disabled={loading} className="w-100" type="submit" variant="success">
                                Reset Password
                            </Button>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="w-100 text-center mt-4">
                                Remember your password?
                                <Link to="/login" class="link-text-black"> Go Back</Link>
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>    
                            <Form.Label className="w-100 text-center mb-4">
                                Don't have an account? <Link to="/signup" class="link-text-black">Sign up</Link>
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