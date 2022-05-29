import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { /* Container, */ Card, Form, Row, Col, FloatingLabel, Modal, InputGroup} from "react-bootstrap"
import { getDatabase, ref, onValue, update } from "firebase/database"
import { getStorage, uploadBytesResumable, getDownloadURL, ref as fileRef} from "firebase/storage"
import { useSnackbar } from 'notistack'
import Container from '@mui/material/Container';
import Navigation from "./Navigation"
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Dashboard() {
    const db = getDatabase()
    const storage = getStorage()
    const { enqueueSnackbar } = useSnackbar()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const emailRef = useRef()
    const passwordRef = useRef()
    const passConfirmRef = useRef()
    const firstRef = useRef()
    const lastRef = useRef()
    const middleRef = useRef()
    const bnameRef = useRef()
    const contactRef = useRef()
    const addressRef = useRef()
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [repeat, setRepeat] = useState()
    const [first, setFirst] = useState()
    const [middle, setMiddle] = useState()
    const [last, setLast] = useState()
    const [bname, setBname] = useState()
    const [contact, setContact] = useState()
    const [address, setAddress] = useState()
    const [updateUID, setUpdateUID] = useState()
    const [permitFile, setPermitFile] = useState() //mu hold sa value sa file sulod sa input field
    const [clearanceFile, setClearanceFile] = useState()
    const [tinFile, setTinFile] = useState()
    const [dtiFile, setDtiFile] = useState()
    const[profileList, setProfileList] = useState();
    const fileType = ['application/pdf']

    const handleUpdate = (profile) => {
        setUpdateUID(profile.refId)
        setEmail(profile.email)
        setFirst(profile.first)
        setMiddle(profile.middle)
        setLast(profile.last)
        setBname(profile.bname)
        setContact(profile.contact)
        setAddress(profile.address)
    }    
    const handlePermit = (e) => {
        const {target} = e 
        if(target.value.length > 0){
            let selectedFile = e.target.files[0]
            if(selectedFile){ 
                if(selectedFile && fileType.includes(selectedFile.type)){
                    setPermitFile(e.target.files[0]) 
                }
                else{
                    enqueueSnackbar("Wrong Format", {variant:'warning'})
                }
            }
        }
    }
    const handleClearance = (e) => {
        const {target} = e 
        if(target.value.length > 0){
            let selectedFile = e.target.files[0]
            if(e.target.files[0]){ 
                if(selectedFile && fileType.includes(selectedFile.type)){
                    setClearanceFile(e.target.files[0])
                } 
                else{
                    enqueueSnackbar("Wrong Format", {variant:'warning'})
                }
            }
        }
    }
    const handleTin = (e) => {
        const {target} = e 
        if(target.value.length > 0){
            let selectedFile = e.target.files[0]
            if(selectedFile){
                if(selectedFile && fileType.includes(selectedFile.type)){ 
                    setTinFile(e.target.files[0])
                }
                else{
                    enqueueSnackbar("Wrong Format", {variant:'warning'})
                }
            }
        }
    }
    const handleDti = (e) => {
        const {target} = e 
        if(target.value.length > 0){
            let selectedFile = e.target.files[0]
            if(selectedFile){ 
                if(selectedFile && fileType.includes(selectedFile.type)){
                    setDtiFile(e.target.files[0]) 
                }
                else{
                    enqueueSnackbar("Wrong Format", {variant:'warning'})
                }
            }
        }
    }
    useEffect(() => {
        onValue(ref(db, `ServiceCenters/${currentUser.uid}/`), snapshot => {
            const data = snapshot.val()
            const profileList = []
            for(let id in data){
                profileList.push({id, ...data[id]})
            }
            setProfileList(profileList)
            console.log(profileList)
        })
    }, []); 
    const updateData = () => { 
        if((password === "" && repeat === "") && email !== currentUser.email){
            updateEmailPass()
        }
        if(document.getElementById("permitControlForm").files.length !== 0) {
            permitFunction()
            console.log("permit check")
        }
        if(document.getElementById("clearanceControlForm").files.length !== 0) {
            clearanceFunction()
            console.log("barangay check")
        }
        if(document.getElementById("tinControlForm").files.length !== 0) {
            tinFunction()
            console.log("Tin")
        }
        if(document.getElementById("dtiControlForm").files.length !== 0) {
            dtiFunction()
            console.log("DTI")
        }
        else { console.log("fail") }
        dataUpdate()
    }
    function dataUpdate(){
        update(ref(db, `ServiceCenters/${currentUser.uid}/${updateUID}`),{
            email, 
            first, 
            last, 
            middle, 
            bname,
            contact, 
            address, 
            refId: updateUID
        })
        .then(() => enqueueSnackbar("Data Updated!", {variant:'success'}))
        .catch(() => enqueueSnackbar("Data not Updated!", {variant:'error'}))
    }
    function updateEmailPass() {
        if(passwordRef.current.value !== passConfirmRef.current.value){
            enqueueSnackbar("Password does not match")
        }
        const promises = []

        if(emailRef.current.value !== currentUser.email){
            promises.push(updateEmail(emailRef.current.value))
        }
        if(passwordRef.current.value){
            promises.push(updatePassword(passwordRef.current.value))
        }
        Promise.all(promises).then(() => {
            enqueueSnackbar("Account Updated", {variant:'success'})
        }).catch(() =>{
            enqueueSnackbar("Failed to update account", {variant:'error'})
        })
    }

    console.log("permit file:", permitFile)
    console.log("clearance file:", clearanceFile)

    function permitFunction(){
        const storageRef = fileRef(storage, `ServiceCenters/${currentUser.email}/${permitFile.name}`) //${permit.name}`)
        const uploadTask = uploadBytesResumable(storageRef, permitFile)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('upload: ' +progress + '%')
            if(progress < 100){ enqueueSnackbar(progress+"%", {variant:'info'}) }
            else{ enqueueSnackbar(progress+"%", {variant:'success'}); enqueueSnackbar("Upload complete", {variant:'success'})}
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
        }, (error) => { console.log(error)}, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((permitURL) => { 
                console.log("File: ", permitURL)
                update(ref(db, `ServiceCenters/${currentUser.uid}/${updateUID}`),{
                    refId: updateUID, 
                    permit: permitURL
                })
            })
        })    
    }
    function clearanceFunction(){
        const storageRef = fileRef(storage, `ServiceCenters/${currentUser.email}/${clearanceFile.name}`)
        const uploadTask = uploadBytesResumable(storageRef, clearanceFile)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('upload: ' +progress + '%')
            if(progress < 100){ enqueueSnackbar(progress+"%", {variant:'info'}) }
            else{ enqueueSnackbar(progress+"%", {variant:'success'}); enqueueSnackbar("Upload complete", {variant:'success'})}
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
        }, (error) => { console.log(error)}, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((clearanceURL) => { 
                console.log("File: ", clearanceURL)
                update(ref(db, `ServiceCenters/${currentUser.uid}/${updateUID}`),{
                    refId: updateUID, 
                    clearance: clearanceURL
                })
            })
        })            
    }
    function tinFunction(){
        const storageRef = fileRef(storage, `ServiceCenters/${currentUser.email}/${tinFile.name}`)
        const uploadTask = uploadBytesResumable(storageRef, tinFile)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('upload: ' +progress + '%')
            if(progress < 100){ enqueueSnackbar(progress+"%", {variant:'info'}) }
            else{ enqueueSnackbar(progress+"%", {variant:'success'}); enqueueSnackbar("Upload complete", {variant:'success'})}
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
        }, (error) => { console.log(error)}, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((tinURL) => { 
                console.log("File: ", tinURL)
                update(ref(db, `ServiceCenters/${currentUser.uid}/${updateUID}`),{
                    refId: updateUID,  
                    tin: tinURL
                })
            })
        })   
    }
    function dtiFunction(){
        const storageRef = fileRef(storage, `ServiceCenters/${currentUser.email}/${dtiFile.name}`)
        const uploadTask = uploadBytesResumable(storageRef, dtiFile)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('upload: ' +progress + '%')
            if(progress < 100){ enqueueSnackbar(progress+"%", {variant:'info'}) }
            else{ enqueueSnackbar(progress+"%", {variant:'success'}); enqueueSnackbar("Upload complete", {variant:'success'})}
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
        }, (error) => { console.log(error)}, 
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((dtiURL) => { 
                console.log("File: ", dtiURL)
                update(ref(db, `ServiceCenters/${currentUser.uid}/${updateUID}`),{
                    refId: updateUID,  
                    dti: dtiURL
                })
            })
        })           
    }

    function modalProfile(profile){
        handleShow()
        handleUpdate(profile)
    }

    //new window PDF 
    function viewPermit(profile){ 
        const permitLink = profile.permit
        if(permitLink !== ""){
            const pdfWindow = window.open()
            pdfWindow.location.href = permitLink 
        }
        else{ enqueueSnackbar("No File", {variant: "warning"}) }
    }
    function viewClearance(profile){ 
        const clearanceLink = profile.clearance
        if(clearanceLink !== ""){
            const pdfWindow = window.open()
            pdfWindow.location.href = profile.clearance
        }
        else{ enqueueSnackbar("No File", {variant: "warning"}) }
    }
    function viewTin(profile){ 
        const tinLink = profile.tin
        if(tinLink !== ""){
            const pdfWindow = window.open()
            pdfWindow.location.href = tinLink
        }
        else{ enqueueSnackbar("No File", {variant: "warning"}) }
    }
    function viewDti(profile){ 
        const dtiLink = profile.dti
        if(dtiLink !== ""){
            const pdfWindow = window.open()
            pdfWindow.location.href = dtiLink
        }
        else{ enqueueSnackbar("No File", {variant: "warning"})}
    }

    return(
        <div>
            <Navigation />
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Profile
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Email</Form.Label>
                                <Form.Control 
                                    type="email"
                                    ref={emailRef}
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    ref={passwordRef}
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    ref={passConfirmRef}
                                    onChange={(e) => setRepeat(e.target.value)}/>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} md="4">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={firstRef}
                                    onChange={(e) => setFirst(e.target.value)}
                                    value={first}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>Middle Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={middleRef}
                                    onChange={(e) => setMiddle(e.target.value)}
                                    value={middle}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={lastRef}
                                    onChange={(e) => setLast(e.target.value)}
                                    value={last}/>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} md="6">
                                <Form.Label>Bussiness Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={bnameRef}
                                    onChange={(e) => setBname(e.target.value)}
                                    value={bname}/>
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Contact No.</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={contactRef}
                                    onChange={(e) => setContact(e.target.value)}
                                    value={contact}/>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={addressRef}
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={address}/>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} md="6">
                                <Form.Label>Business Permit</Form.Label>
                                <Form.Control
                                    id="permitControlForm"
                                    type="file"
                                    onChange={handlePermit}/>
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>Barangay Clearance</Form.Label>
                                <Form.Control
                                    id="clearanceControlForm"
                                    type="file"
                                    onChange={handleClearance}/>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} md="6">
                                <Form.Label>TIN</Form.Label>
                                <Form.Control
                                    id="tinControlForm"
                                    type="file"
                                    onChange={handleTin}/>
                            </Form.Group>

                            <Form.Group as={Col} md="6">
                                <Form.Label>DTI</Form.Label>
                                <Form.Control
                                    id="dtiControlForm"
                                    type="file"
                                    onChange={handleDti}/>
                            </Form.Group>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Group>
                        <Button variant="success" type="submit" onClick={updateData}>
                            Save Changes
                        </Button>
                    </Form.Group>
                </Modal.Footer>
            </Modal>

            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
                <div className="w-100" style= {{ maxWidth: "700px" }}>
                    {profileList ? profileList.map((profile, index) => 
                        <Card>
                            <Card.Body>
                                <Form>
                                    <h2 className="text-center mb-4">Profile</h2>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6">
                                            <FloatingLabel label="Email">
                                                <Form.Control 
                                                    type="email" 
                                                    value={profile.email}
                                                    disabled/>
                                            </FloatingLabel>
                                        </Form.Group>

                                        <Form.Group as={Col} md="6">
                                            <FloatingLabel label="Name">
                                                <Form.Control
                                                    type="text"
                                                    value={`${profile.first} ${profile.middle} ${profile.last}`}
                                                    disabled/>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="4">
                                            <FloatingLabel label="First Name">
                                                <Form.Control 
                                                    type="text"
                                                    value={profile.first}
                                                    disabled/>
                                            </FloatingLabel>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4">
                                            <FloatingLabel label="Middle Name">
                                                <Form.Control
                                                    type="text"
                                                    value={profile.middle}
                                                    disabled/>
                                            </FloatingLabel>
                                        </Form.Group>
                                        
                                        <Form.Group as={Col} md="4">
                                            <FloatingLabel label="Last Name">
                                                <Form.Control
                                                    type="text"
                                                    value = {profile.last}
                                                    disabled/>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group  as={Col} md="6">
                                            <FloatingLabel label="Bussiness Name">
                                                <Form.Control
                                                    type="text"
                                                    value={profile.bname}
                                                    disabled/>
                                            </FloatingLabel>    
                                        </Form.Group>

                                        <Form.Group as={Col} md="6">
                                            <FloatingLabel label="Contact">
                                                <Form.Control
                                                    type="text"
                                                    value={profile.contact}
                                                    disabled/>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group>
                                            <FloatingLabel label="Address">
                                                <Form.Control
                                                    type="text"
                                                    value={profile.address}
                                                    disabled/>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group controlId="formFile" className="mb-1">
                                            <Form.Text>Business Permit</Form.Text>
                                            <InputGroup>
                                                <Form.Control 
                                                    type="text"
                                                    value={profile.permit}
                                                    disabled/>
                                                <IconButton className="icon-view" onClick={() => {viewPermit(profile)}}>
                                                    <VisibilityIcon/>
                                                </IconButton>
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="formFile" className="mb-1">
                                            <Form.Text>Barangay Clearance</Form.Text>
                                            <InputGroup>
                                                <Form.Control 
                                                    type="text"
                                                    value={profile.clearance}
                                                    disabled/>
                                                <IconButton className="icon-view" onClick={() => {viewClearance(profile)}}>
                                                    <VisibilityIcon/>
                                                </IconButton>
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="formFile" className="mb-1">
                                            <Form.Text>TIN</Form.Text>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    value={profile.tin}
                                                    disabled/>
                                                <IconButton className="icon-view" onClick={() => {viewTin(profile)}}>
                                                    <VisibilityIcon/>
                                                </IconButton>
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="formFile" className="mb-1">
                                            <Form.Text>DTI</Form.Text>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    value={profile.dti}
                                                    disabled/>
                                                <IconButton className="icon-view" onClick={() => {viewDti(profile)}}>
                                                    <VisibilityIcon/>
                                                </IconButton>
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                    
                                    <Row className="mb-3">
                                        <Form.Group className="text-center mb-4">
                                            <Button 
                                                variant="success"
                                                onClick={() => {modalProfile(profile)}}>
                                                    Update Profile
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