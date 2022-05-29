import React from "react"
import { Nav, Navbar, Container } from 'react-bootstrap'
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import "../style.css"
import Logo from "../Image/logo.png"
import { useSnackbar } from 'notistack';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function Navigation() {

    const { logout } = useAuth()

    const { enqueueSnackbar } = useSnackbar()

    async function handleLogout(){
        try{
            await logout()
        }
        catch{
            enqueueSnackbar("Failed to logout")
        }
    }
    return (
        <div className="navigation">
            <Navbar bg="success" variant="dark" expand="lg" >
                <Container>
                    <Navbar.Brand>
                        <Link to="/home" className="link-text-white">
                            <img 
                            src={ Logo } 
                            alt="Rentana logo" 
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            />{" "}
                            RenTana
                        </Link>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto justify-content-end">
                            <Nav.Item>
                                <Nav.Link 
                                    as={Link} 
                                    to="/home" 
                                    className="link-text-white"
                                    startIcon={<DashboardIcon/>}>
                                        Dashboard
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link 
                                    as={Link} 
                                    to="/profile" 
                                    className="link-text-white">
                                        Profile
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link 
                                    as={Link}
                                    to="/tracking" 
                                    className="link-text-white">
                                        Tracking
                                </Nav.Link>
                            </Nav.Item>
                            {/* <Nav.Item>
                                <Nav.Link
                                    as={Link}
                                    to="/reserve"
                                    className="link-text-white">
                                        Reservation
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link 
                                    as={Link} 
                                    to="/notification"
                                    className="link-text-white">
                                        Notification
                                </Nav.Link>
                            </Nav.Item> */}
                            <Nav.Item>
                                <Nav.Link 
                                    as={Link}
                                    to="/login" 
                                    className="link-text-white" 
                                    onClick={handleLogout}>
                                        Logout
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}