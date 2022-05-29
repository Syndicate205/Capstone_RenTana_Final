import { Link } from "react-router-dom"
import { Container } from "react-bootstrap"
import Navigation from "./Navigation"

const NotFound = () => {
    return (  
        <div>
            <Navigation/>
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
                <div className="not-found w-100 mt-4" style= {{ maxWidth: "400px" }}>
                    <h2>Error 404 page not found</h2>
                    <h3>Please Try again!</h3>
                    <Link to="/login">Back to home</Link>
                </div>
            </Container>
        </div>
    );
}

export default NotFound;