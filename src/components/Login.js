import React, {useRef, useState/* , useEffect */ } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom"
import { Container } from 'react-bootstrap'
import { useSnackbar } from 'notistack';
import Logo from "../Image/logo1.png"

export default function Login() {
    const { enqueueSnackbar } = useSnackbar()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login/* , currentUser */ } = useAuth()
    const [ error, setError] = useState("")
    const [ loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e){
        e.preventDefault()
        try{
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            .then(() => {history.push("/home")})
            .catch(() => {enqueueSnackbar("Login failed", {variant:'error'})})
        }
        catch{
            setError("Something went wrong! Please try again")
        }
        setLoading(false)
    }
    
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            {/*{profileList ? profileList.map((profile, index) => */}
            <div className="w-100" style= {{ maxWidth: "400px" }}>
                <div className="text-center mb-4" >
                    <img src={ Logo } alt="Rentana logo" height="95px"/>
                    <h1>Welcome to RenTana</h1>
                </div>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email" className="mb-4">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="pass" className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group>
                                <Button disabled={loading} className="w-100 mb-4" type="submit" variant="success">
                                    Login
                                </Button>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="w-100 text-center mt-3">
                                    <Link to="/forgot-password" className="link-text-black">
                                        Forgot Password?
                                    </Link>
                                </Form.Label>
                                <Form.Label className="w-100 text-center mt-3">
                                    Don't have an account? 
                                    <Link to="/signup" className="link-text-black"> Sign up</Link>
                                </Form.Label>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            {/*): ""}*/}
        </Container>           
    )
}