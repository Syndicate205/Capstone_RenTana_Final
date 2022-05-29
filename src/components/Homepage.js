import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom"
import { Form, Container, Col, Row, Modal, Table, Card } from 'react-bootstrap'
import { getDatabase, ref, update, remove, onValue } from "firebase/database"
import { getStorage, deleteObject, ref as fileRef} from "firebase/storage"
import { useAuth } from "../contexts/AuthContext"
import { useSnackbar } from 'notistack';
import Navigation from './Navigation'
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button';

export default function Homepage() {
  const db = getDatabase()
  const storage = getStorage()
  const { enqueueSnackbar } = useSnackbar()
  const { currentUser } = useAuth()
  const [updateUID, setUpdateUID] = useState()
  const [readList, setReadList] = useState("");
  //for modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [showView, setShowView] = useState(false)
  const handleCloseView = () => setShowView(false)
  const handleShowView = () => setShowView(true)
  //for Data
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [descp, setDescp] = useState("")
  const [deposit, setDeposit] = useState("")
  const [status, setStatus] = useState("")
  const [image, setImage] = useState()

  const handlePrice = (e) => { 
    const rawValue = e.target.value.toLocaleString();
    setPrice(rawValue) 
  }
  const handleUpdate = (item) => {
    setUpdateUID(item.refId)
    setName(item.name)
    setQuantity(item.quantity)
    setPrice(item.price)
    setDescp(item.descp)
    setDeposit(item.deposit)
    setStatus(item.status)
  }
  const handleView = (item) => {
    setName(item.name)
    setQuantity(item.quantity)
    setPrice(item.price)
    setDescp(item.descp)
    setDeposit(item.deposit)
    setStatus(item.status)
    setImage(item.imageURL)
  }
  //for Read
  useEffect(() => {
    onValue(ref(db, `Items/${currentUser.uid}/`), snapshot => {
      const data = snapshot.val()
      const readList = []
      for(let id in data){
        readList.push({id, ...data[id]})
      }
        setReadList(readList)
    })
  }, [])
  //for Delete
  const deleteData = (item) => {    
    remove(ref(db, `Items/${currentUser.uid}/${item.refId}`))
    .then(() => enqueueSnackbar("Data Deleted", {variant:'success'}))
    .catch(() => enqueueSnackbar("Data Not Deleted", {variant:'error'}));
    
    remove(ref(db, `Products/${item.refId}`));
  
    deleteObject(fileRef(storage, `Items/${currentUser.email}/${item.imageName}`))
    .then(() => enqueueSnackbar("Photo Deleted", {variant:'success'}))
    .catch(() =>  enqueueSnackbar("Photo not deleted", {variant:'error'}));
  }; 
  //for update
  const updateData = () => { 
    update(ref(db, `Items/${currentUser.uid}/${updateUID}`),{
      name, quantity, price, descp, deposit, status, refId: updateUID 
    })
    .then(() => enqueueSnackbar("Data Updated!", {variant:'success'}))
    .catch(() => enqueueSnackbar("Data not Updated!", {variant:'error'}))
    
    update(ref(db, `Products/${updateUID}`),{
      name, quantity, price, descp, deposit, status, refId: updateUID 
    })
    handleClose()
  }
  //Modal function 
  function modalView(item){
    handleShowView()
    handleView(item)
  }
  function modalUpdate(item){
    handleShow()
    handleUpdate(item)
  }
  return (
    <div>
      <Navigation />
      <Container className="d-flex justify-content-center" style={{ minHeight: "10vh"}}>
        <div className="w-100" style= {{ maxWidth: "1000px" }}>                             <br />
          <div style={{ top: "10px" }}>
            <Button variant="success" style={{float: "right"}}>
              <Link to="/home/add-item" className="link-text-black">
                <AddIcon/>ADD
              </Link>
            </Button>
          </div>
        </div>
      </Container>
      <Modal id="Update" show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg" aria-labelledby="modal-add-item" centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Form.Group as={Col} md="4">
                  <Form.Label>Name: </Form.Label>
                  <Form.Control 
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name} />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Quantity: </Form.Label>
                  <Form.Control 
                    type="text"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity} />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Price: </Form.Label>
                  <Form.Control 
                    type="text"
                    onChange={handlePrice}
                    value={price} />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" className="mb-4">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={"None"} onChange={(e) => setStatus(e.target.value)} aria-label="Default select option">
                    <option value="None" disabled>Choose one</option>
                    <option value="Available">Available</option>
                    <option value="Out of Stack">Out of Stack</option>
                    <option value="Coming Soon">Comming Soon</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Security Deposit: </Form.Label>
                  <Form.Control 
                    type="text"
                    onChange={(e) => setDeposit(e.target.value)} 
                    value={deposit}/>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="12">
                  <Form.Label>Description: </Form.Label>
                  <Form.Control 
                    type="text"
                    onChange={(e) => setDescp(e.target.value)}
                    value={descp} />
                </Form.Group>
              </Row>    
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Row className="text-right">
              <Form.Group id="SaveBtn">
                <Button   
                  variant="success"
                  active
                  onClick={updateData}>
                    Save Changes
                </Button>
              </Form.Group>
            </Row>
          </Modal.Footer>
      </Modal>
      <Modal id="ViewDetail" show={showView} backdrop="static" keyboard={false} size="sm" onHide={handleCloseView} centered>
        <Modal.Header closeButton> 
          Item Details
        </Modal.Header>
        <Modal.Body>
          <Card /* style={{ width: '60%'}} */ className="d-flex justify-content-center">
            <Card.Img variant="top" src={image || "https://via.placeholder.com/296x280"} />
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Text>
                {quantity}pcs. - ${price} - {deposit}
              </Card.Text>
              <Card.Text>
                {descp} 
              </Card.Text>
              <Card.Text>
                {status}
              </Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>        
      </Modal>
      <Container className="d-flex justify-content-center" style={{ minHeight: "15%" }}>
        <div className="w-100" style= {{ maxWidth: "100%" }}>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                {/* <th>Description</th> */}
                <th>Quantity</th>
                <th>Price</th>
                <th>Security Deposit</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {readList ? readList.map((item, index) => {
                return(
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    {/* <td>{item.descp}</td> */}
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.deposit}</td>
                    <td>{item.status}</td>
                    <td>
                      <IconButton className="icon-view" onClick={() => {modalView(item)}}>
                        <VisibilityIcon/>
                      </IconButton>
                      <IconButton className="icon-update" onClick={() => {modalUpdate(item)}}>
                        <UpdateIcon/>
                      </IconButton>
                      <IconButton className="icon-delete" onClick={() => {deleteData(item)}}>
                        <DeleteIcon/>
                      </IconButton>
                    </td>
                  </tr>
                )
              }): ""}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  )
}