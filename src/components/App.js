import React from "react"
import Signup from "./Signup"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Login from "./Login"
//import Dashboard from "./Dashboard"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
//import UpdateProfile from "./UpdateProfile"                   //Empty
import Home from "./Homepage"
import NotFound from "./NotFound"
import Profile from "./Profile"
//import Verification from "./Verification"                     // Subject to delete //Empty
//import Notification from "./Notification"                     //Empty
//import Chat from "./Chat"                                     //Empty
//import ItemDetail from "./ItemDetail"                         //Empty
//import ItemProcess from "./ItemProcess"                       //Empty
import AddItem from "./AddItem"
//import UpdateItem from "./UpdateItem"                         //Empty
import SignupInfo from "./SignupInfo"
import Tracking from "./Tracking"
//import ReservationRequest from "./ReservationRequest"         //Empty
//import Testpage from "./Testpage"                             //Test page
//import TestProfile from "./TestProfile"                       //Test page
//import TestHome from "./TestHome"                             //Test page
//import TestData from "./TestData"                             //Test page
//import TestImage from "./TestImage"                           //Test page
//import TestReadOnce from "./TestReadOnce"                     //Test page
import { SnackbarProvider } from "notistack"

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
    <div>
    <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Login} />
            <Route exact path="/login" component={ Login } />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/signup" component={ Signup } />
            <Route exact path="/signup/user-info" component={ SignupInfo } />

            <PrivateRoute exact path="/home" component={ Home } />
            <PrivateRoute exact path="/home/add-item" component={AddItem} />
            
            <PrivateRoute exact path="/tracking" component={Tracking} />
            <PrivateRoute exact path="/profile" component={Profile} />


            {/*Below kay mga components wala pa na gamit or pang test purposes */}
            {/* 
            <PrivateRoute exact path="/home/update-item" component={ UpdateItem } />
            <PrivateRoute exact path="/reserve" component={ReservationRequest}/>
            <PrivateRoute path="/profile/update-profile" component={UpdateProfile} />
            <Route path="/verification" component={Verification} /> 
            <Route path="/notification" component={Notification} />
            <Route path="/chat" component={Chat} />``
            <Route path="/detail" component={ItemDetail} />
            <Route path="/process" component={ItemProcess} />
            
              <PrivateRoute path="/test-data" component={TestData} />
            <Route path="/test" component={Testpage} />
            <Route path="/test-home" component={TestHome} />
            <Route path="/test-profile" component={TestProfile}/>
            <Route path="/test-image" component={TestImage}/>
            <Route path="/test-read-once" component={TestReadOnce}/>
            <Route path="*"><NotFound /></Route>
            <Route path="dash" component={Dashboard}></Route>
            */}           
          </Switch>
        </AuthProvider>
      </Router>
    </div>
    </SnackbarProvider>
  );
}

export default App;
