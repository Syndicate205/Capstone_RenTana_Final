import React, {useState, useEffect} from 'react'
import { Card, Container, Form, Row, Col, Modal } from "react-bootstrap"
import { useSnackbar } from 'notistack';
import { getDatabase, ref, update, onValue } from "firebase/database"
import { useAuth } from '../contexts/AuthContext'
import Navigation from "./Navigation"
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import UpdateIcon from '@mui/icons-material/Update';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Tracking(){

    const { enqueueSnackbar } = useSnackbar()
    const { currentUser } = useAuth()
    const db = getDatabase()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    /* const [email, setEmail] = useState()
    const [name, setName] = useState() */
    const [itemName, setItemName] = useState()
    const [itemQuantity, setItemQuantity] = useState()
    const [itemPrice, setitemPrice] = useState()
    const [itemDeposit, setItemDeposit] = useState()
    const [itemSub, setItemSub] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [status, setStatus] = useState()
    const [statusValue, setStatusValue] = useState()
    const [rentID, setRentID] = useState()
    const [itemUUID, setItemUUID] = useState()
    const [itemUserName, setItemUserName] = useState()
    const [readList, setReadList] = useState()

    const handleView = (read) => {
        setRentID(read.itemUserID) //uid sa renter
        setItemUUID(read.id)    //uid sa reservation details
        setItemName(read.itemName)
        setItemUserName(read.itemUserName)
        setItemQuantity(read.itemQuantity)
        setitemPrice(read.itemPrice)
        setStartDate(read.itemDateRented)
        setEndDate(read.itemDateReturned)
        setItemDeposit(read.itemSecurityDeposit)
        setItemSub(read.itemSubTotal)
        if(read.itemStatus === ""){ setStatusValue("No Status") }
        else if(read.itemStatus !== ""){ setStatusValue(read.itemStatus) }
    }
    console.log("rent ID", rentID)
    useEffect(() => {
        onValue(ref(db, `ForTracking/${currentUser.uid}/`), snapshot => {
            const data = snapshot.val()
            const readList = []
            for(let id in data){
                readList.push({id, ...data[id]})
            }
            setReadList(readList)
            console.log("Array",readList)
            console.log("snapshot", snapshot.val())
        }) 
    }, [])    
    const updateStatus = () => { 
        update(ref(db, `ForTracking/${currentUser.uid}/${itemUUID}`),{
            itemStatus: status
        })
        .then(() => enqueueSnackbar("Status Updated!", {variant:'success'}))
        .catch(() => enqueueSnackbar("Status not Updated!", {variant:'error'})) 
        
        update(ref(db, `ReservationDetails/${rentID}/${itemUUID}`),{
            itemStatus: status 
        })

        handleClose()
    }
    function modalView(read){
        handleShow()
        handleView(read)
    }
    return (
        <div>
            <Navigation />
            <Container className="d-flex justify-content-center" style={{ minHeight: "10vh"}}>
                <div className="w-100" style={{ maxWidth: "1000px" }}> <br/>
                    <div style={{ top: "10px" }}>
                        <Form action="/" method="get">
                            <Row>
                                <Form.Group as={Col} md="10">
                                    <Form.Control
                                        type="search"
                                        id="header-search"
                                        placeholder="Search"
                                        name="s"/>
                                </Form.Group>

                                <Form.Group as={Col} md="2">
                                    <Button 
                                        variant="success" 
                                        onClick={() => enqueueSnackbar('No Function', {variant: "info"})}
                                        startIcon={<SearchIcon/>}>
                                            Search
                                    </Button>
                                </Form.Group>                                
                            </Row>
                        </Form>
                    </div>
                </div>
            </Container>
            <Modal id="ViewDetail" show={show} backdrop="static" keyboard={false} size="lg" onHide={handleClose} centered>
                <Modal.Header closeButton> 
                    Reservation Details
                </Modal.Header>
                <Modal.Body>
                    <Card /* style={{ width: '60%'}} */ className="d-flex justify-content-center">
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label>User: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={itemUserName}
                                            disabled/>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Item Name: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={itemName}
                                            disabled/>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Item Quantity: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={itemQuantity}
                                            disabled/>
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Item Deposit: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={itemDeposit}
                                            disabled/>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Item Price: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={itemPrice}
                                            disabled/>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Item Subtotal: </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={itemSub}
                                            disabled/>
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            value={startDate}
                                            disabled/>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            value={endDate}
                                            disabled/>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4" className="mb-4">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select 
                                            onChange={(e) => setStatus(e.target.value)} 
                                            aria-label="Default select option">
                                                <option value={statusValue} readOnly>{statusValue}</option> 
                                                <option value="Approved">Approved</option>
                                                <option value="Returned">Returned</option>
                                                <option value="Rented">Rented</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Modal.Body> 
                <Modal.Footer>
                    <Button className="icon-update" variant="success" onClick={() => { updateStatus() }}>
                        <UpdateIcon/>Update 
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container className="d-flex justify-content-center" style={{ minHeight: "15%" }}>
                <div className="w-100" style= {{ maxWidth: "1000px" }}>
                    {readList ? readList.map((read, index) =>     
                    <div className="track-item" >                
                        <Card className="mt-4" border="dark">
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Form.Group as={Col} md="6">
                                            <Form.Label>User: </Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={read.itemUserName}
                                                disabled/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="6">
                                            <Form.Label>Item Name: </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={read.itemName}/* {read.iName} */
                                                disabled/>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={read.itemDateRented}
                                                disabled/>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4">
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={read.itemDateReturned}
                                                disabled/>
                                        </Form.Group>
                                    {/* </Row>
                                    <Row className="justify-content-md-center"> */}
                                        <Form.Group as={Col} md="4">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                value={read.itemStatus}/* {read.resStatus} */
                                                disabled/>
                                        </Form.Group>
                                    </Row>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                <Row className="justify-content-md-center">
                                    <Form.Group as={Col} md="auto">
                                        <Button
                                            className="icon-view w-50"
                                            variant="success"
                                            onClick={() => { modalView(read) }}
                                            startIcon={<VisibilityIcon/>}> 
                                                View 
                                        </Button>    
                                    </Form.Group>    
                                </Row>
                            </Card.Footer>
                        </Card>
                    </div>
                    ): ""}
                </div>
            </Container>
        </div>
    ) 
}