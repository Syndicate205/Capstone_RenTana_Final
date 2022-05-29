import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom"
import { Form, Container, Col, Row, Card } from 'react-bootstrap'
import { getDatabase, set, ref, onValue } from "firebase/database"
import { getStorage, uploadBytesResumable, getDownloadURL, ref as imageRef } from "firebase/storage" 
import { v4 as uid } from "uuid"
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext'
import Navigation from './Navigation'
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


export default function AddItem() {
    const { enqueueSnackbar } = useSnackbar() 

    const history = useHistory()
    const db = getDatabase()
    const storage = getStorage()
    const uuid = uid()
    const { currentUser } = useAuth()
    
    //for Data
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState("")
    const [price, setPrice] = useState("")
    const [descp, setDescp] = useState("")
    const [deposit, setDeposit] = useState("")
    const [status, setStatus] = useState("")
    const [imageFile, setImageFile] = useState(""); // mu hold sa value sa gi send sa user
    const [storeName, setStoreName] = useState()
    const [storeAddress, setStoreAddress] = useState()
    const [storeLatitude, setStoreLatitude] = useState()
    const [storeLongitude, setStoreLongitude] = useState()
    const [readList, setReadList] = useState("")
    //const [latitude, setLatitude] = useState(); //Geolocation
    //const [longitude, setLongitude] = useState() //Geolocation
    const [lowercase, setLowercase] = useState()
    useEffect(() => {
        onValue(ref(db, `ServiceCenters/${currentUser.uid}/`), snapshot => {
          const data = snapshot.val()
          const readList = []
          for(let id in data){ readList.push({id, ...data[id]}) }
            setReadList(readList)
        })
        /* getLocation() */
    }, [])
    const handleProfileData = (read) => { 
        setStoreName(read.bname)
        setStoreAddress(read.address)
        setStoreLatitude(read.storeLatitude)
        setStoreLongitude(read.storeLongitude)
    }
    console.log("store address", storeAddress)
    console.log("Normal", name)
    console.log("lower", lowercase)
    const handleName = (e) => {
        const nameValue = e.target.value
        setName(nameValue)
        const lower = nameValue.toLowerCase()
        setLowercase(lower)
    }
    const handlePrice = (e) => { 
      const rawValue = e.target.value.toLocaleString();
      setPrice(rawValue) 
    }
    const handleImage = (e) => {
        const {target} = e 
        if(target.value.length > 0){
            if(e.target.files[0]){ setImageFile(e.target.files[0]) }
        }
    }
    const clear = () => {
        setName("")
        setQuantity("")
        setPrice("")
        setDescp("")
        setDeposit("")
        setStatus("")
        document.getElementById("imageControlForm").value = null
        const select = document.getElementById("statusControlForm")
        select.selectedIndex = 0
    }
    function addImage(){
        try{
            const storageRef = imageRef(storage, `Items/${currentUser.email}/${imageFile.name}`)
            const uploadTask = uploadBytesResumable(storageRef, imageFile)

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('upload: ' +progress + '%')
                if(progress < 100){
                    enqueueSnackbar(progress+"%", {variant:'info'})
                }
                else{
                    enqueueSnackbar(progress+"%", {variant:'success'})
                    enqueueSnackbar("Upload complete", {variant:'success'})
                }
                switch (snapshot.state){
                    case 'paused':
                        console.log('upload paused')
                        break;
                    case 'running':
                        console.log('upload running')
                        break;
                    default: 
                        console.log('upload complete')
                }
            }, (error) => { 
                console.log(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { 
                    console.log("File: ", downloadURL)
                    itemTable(downloadURL)
                    productTable(downloadURL)
                })
            })
        }
        catch(error){
            console.log(error)
        }
    }
    async function handleSubmit(e){
        e.preventDefault()
        if(name !== "" || quantity!== "" || price !== "" || descp!== "" || deposit !== "" || status === "None"){
            if(document.getElementById("imageControlForm").files.length !== 0) {
                try{
                    addImage()
                    clear()
                }
                catch{
                    enqueueSnackbar("Try Again!", {variant:'warning'})
                }
            }
            else{ enqueueSnackbar("No Image!", {variant: 'warning'}) }
        }
        else{ enqueueSnackbar("No Input", {variant: 'warning'}) }
    }
    function itemTable(downloadURL){
        set(ref(db, `Items/${currentUser.uid}/${uuid}`), {
            name, 
            nameLower: lowercase,
            quantity,
            price,
            descp,
            deposit,
            status,
            imageName: `${imageFile.name}`,
            imageURL: downloadURL,
            refId: uuid, 
            storeName,
            storeAddress, 
            storeLatitude,      //: //latitude,
            storeLongitude      //: //longitude
        })
        .then(() => {enqueueSnackbar("Data Added", {variant:'success'}); })
        .catch(() => enqueueSnackbar("Data Not Added", {variant:'error'}));    
    }
    function productTable(downloadURL){
        set(ref(db, `Products/${uuid}`), {
            name,
            nameLower: lowercase,
            quantity,
            price, 
            descp, 
            deposit, 
            status, 
            imageName: `${imageFile.name}`,
            imageURL: downloadURL,
            refId: uuid, 
            storeName,
            storeAddress, 
            storeID: currentUser.uid,
            storeLatitude,      //: //latitude,
            storeLongitude      //: //longitude
        })
    }
    /* function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(getCoordinates, handleLocationError)
        }
        else{
            enqueueSnackbar("Geolocation is not supported by this browser.") 
        }
    } */
    //Geolocation
    /* function getCoordinates(position){
        console.log(position.coords.latitude) 
        console.log(position.coords.longitude)

        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        /* reverseGeocodeCoordinates *
    } */
    /* function reverseGeocodeCoordinates(){
        fetch()
    }  *
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
    } */
    console.log("Name", name)
    console.log("image: ", `${imageFile.name}`)
    console.log("store address", storeAddress)
    return (
        <div>
            <Navigation />
            <Container className="d-flex justify-content-center" style={{ minHeight: "10vh"}}>
                <div className="w-100" style= {{ maxWidth: "1000px" }}>                             <br />
                    <div style={{ top: "10px" }}>
                        <Button variant="success" onClick={() => history.goBack()} style={{float: "right"}}>
                            <ArrowBackIcon/>Go Back
                        </Button>
                    </div>
                </div>
            </Container>
            <Container className="d-flex align-items-center justify-content-center"  style={{ minHeight: "10%" }}>
                <div className="w-100" style= {{ maxWidth: "660px" }}>
                {readList ? readList.map((read) =>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Add Item</h2>
                        <Form id="add-form" onSubmit={handleSubmit} noValidate >
                            <Row>
                                <Form.Group as={Col} md="4">
                                    <Form.Label>Name: </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        onChange={handleName}
                                        value={name} 
                                        required />
                                </Form.Group>
                                <Form.Group as={Col} md="4">
                                    <Form.Label>Quantity: </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        onChange={(e) => setQuantity(e.target.value)}
                                        value={quantity} 
                                        required />
                                </Form.Group>
                                <Form.Group as={Col} md="4">
                                    <Form.Label>Price: </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        onChange={handlePrice}
                                        value={price}
                                        required />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md="6" className="mb-4">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select 
                                        id="statusControlForm"
                                        defaultValue={"None"} 
                                        onChange={(e) => setStatus(e.target.value)} 
                                        aria-label="Default select option">
                                            <option value="None" disabled>Choose one</option>
                                            <option value="Available">Available</option>
                                            <option value="Coming Soon">Coming Soon</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group as={Col} md="6">
                                    <Form.Label>Security Deposit: </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        onChange={(e) => setDeposit(e.target.value)} 
                                        value={deposit}
                                        required />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md="12">
                                    <Form.Label>Description: </Form.Label>
                                    <Form.Control 
                                        type="text"
                                        onChange={(e) => setDescp(e.target.value)}
                                        value={descp}
                                        required />
                                </Form.Group>
                            </Row>   
                            <Row>
                                <Form.Group as={Col} md="12">
                                    <Form.Label>Product Image: </Form.Label>
                                    <Form.Control 
                                        id="imageControlForm"
                                        type="file"
                                        onChange={handleImage}
                                        required />
                                </Form.Group>
                            </Row>     
                            <Row className="text-right">
                                <Form.Group id="SaveBtn">
                                    <Button  
                                        className="mt-3" 
                                        type="submit"
                                        variant="success"
                                        active
                                        onClick={() => {handleProfileData(read)}}>
                                            Save Changes
                                    </Button>
                                </Form.Group>
                            </Row>                          
                        </Form>
                    </Card.Body>
                </Card>
                ): ""}
                </div>
            </Container>
        </div>
    )
}