import React, { useState, useEffect} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Container, Button, Form, Card, Row, Col, InputGroup} from "react-bootstrap"
import { getDatabase, set, ref } from "firebase/database"
import { v4 as uid } from "uuid"
import { useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom"
import Logo from "../Image/logo1.png"

export default function SignupInfo() {

    const { currentUser, logout } = useAuth()
    const db = getDatabase()
    const uuid = uid() 
    const { enqueueSnackbar } = useSnackbar()
    const history = useHistory()

    //const [Email, setEmail] = useState("");
    //const [Password, setPassword] = useState("");
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [MiddleName, setMiddleName] = useState("");
    const [BName, setBName] = useState("");
    const [ContactNo, setContactNo] = useState("");
    const [Address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("")

    const handleContactNo = (e) => {
        const ContactValue = e.target.value.replace(/\D/g, "")
        setContactNo(ContactValue);
    }
    useEffect(() => {
        getLocation()
    }, [])
    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(getCoordinates, handleLocationError)
        }
        else{
            enqueueSnackbar("Geolocation is not supported by this browser.") 
        }
    }
    function getCoordinates(position){
        console.log(position.coords.latitude) 
        console.log(position.coords.longitude)

        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        /* reverseGeocodeCoordinates */
    }
    /* function reverseGeocodeCoordinates(){
        fetch()
    }  */
    function handleLocationError(error){
        switch(error.code){
            case error.PERMISSION_DENIED:
                enqueueSnackbar("User denied the request for Geolocation")
                break;
            case error.POSITION_UNAVAILABLE:
                enqueueSnackbar("Location information is unavailable")
                break;
            case error.TIMEOUT:
                enqueueSnackbar("The request to get user location timed out")
                break;
            case error.UNKNOWN_ERROR:
                enqueueSnackbar("An unknown error occured")
                break;
            default:
                enqueueSnackbar("An unknown error occured")
        }
    }
    
    function handleSubmit(e){
        e.preventDefault()
        set(ref(db, `ServiceCenters/${currentUser.uid}/${uuid}`), {
            email: currentUser.email, 
            first: FirstName, 
            last: LastName, 
            middle: MiddleName, 
            bname: BName, 
            contact: ContactNo, 
            address: Address,
            refId: uuid,
            storeLatitude: latitude,
            storeLongitude: longitude,
            permit: "",
            clearance: "",
            tin: "",
            dti: ""
        }).then(() => {enqueueSnackbar("Registered Successfully!",{variant:'success'}); handleLogout(); history.push("/login")})
        .catch(() => enqueueSnackbar("Register Failed!", {variant:'warning'})); 

        set(ref(db, `Profile/${uuid}`), {
            email: currentUser.email, 
            first: FirstName, 
            last: LastName, 
            middle: MiddleName, 
            bname: BName, 
            contact: ContactNo, 
            address: Address,
            refId: uuid,
            storeID: currentUser.uid,
            storeLatitude: latitude,
            storeLongitude: longitude,
            permit: "",
            clearance: "",
            tin: "",
            dti: ""
        })
    }
    async function handleLogout(){
        await logout()
    }
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style= {{ maxWidth: "700px" }}>
                <div className="text-center mb-4" >
                    <img src={ Logo } alt="Rentana logo" height="95px"/>
                    <h1>Welcome to RenTana</h1>
                    <h2 className="text-center mb-4">User Information</h2>
                    {/* {currentUser.email}
                    <h1>{latitude}</h1>
                    <h1>{longitude}</h1> */}
                </div>
            <Card>
                <Card.Body> 
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group id="email" as={Col} md="12" controlid="validationCustom01" className="mb-4">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                type="text"
                                defaultValue={currentUser.email}
                                disabled
                                readOnly/>
                            </Form.Group>
                        </Row>

                        <Row id="First-Middle-Last">
                            <Form.Group id="FirstNameForm" as={Col} md="4" controlid="validationCustom03" className="mb-4">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text" 
                                    placeholder="First Name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={FirstName}
                                    required />
                            </Form.Group>

                            <Form.Group id="MiddleNameForm" as={Col} md="4" controlid="validationCustom04" className="mb-4">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Middle Name"
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    value={MiddleName} 
                                    required />
                            </Form.Group>

                            <Form.Group id="LastNameForm" as={Col} md="4" controlid="validationCustom05" className="mb-4">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Last Name"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={LastName}
                                    required />
                            </Form.Group>
                        </Row>

                        <Row id="StoreName-Contact">
                            <Form.Group id="BusinessName" as={Col} md="6" controlid="validationCustom07" className="mb-4">
                                <Form.Label>Business Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Address"
                                    onChange={(e) => setBName(e.target.value)}
                                    value={BName}
                                    required />
                            </Form.Group>

                            <Form.Group id="ContactForm" as={Col} md="6" controlid="validationCustom10" className="mb-4">
                                <Form.Label>Contact Number</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend">+63</InputGroup.Text>
                                    <Form.Control 
                                        type="tel" 
                                        placeholder="Enter Contact Number"
                                        minLength={11}
                                        maxLength={11}
                                        onChange={handleContactNo}
                                        value={ContactNo}
                                        required
                                        aira-describedby="inputGroupPrepend"/>
                                    <Form.Control.Feedback type="invalid">
                                        Input Contact Number
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Row id="Address">
                            <Form.Group id="AddressForm" as={Col} md="12" contolid="validationControl09" className="mb-4">
                                <Form.Label>Address</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Address"
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={Address}
                                    required />
                            </Form.Group>
                        </Row>

                        <Form.Group id="button" className="text-center">
                            <Button className="w-50 mb-4" type="submit" variant="success">
                                Signup
                            </Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </Container>
    )
}
