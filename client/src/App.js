import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Loginpage from "./LoginPage/Loginpage";
import Registerpage from "./LoginPage/Registerpage";
import ForgotPasswordpage from "./LoginPage/Forgotpassword";
import OtpFormRegistrationpage from "./LoginPage/Otpformpage";
import Landingpage from "./LoginPage/Landingpage";
import ResetPasswordpage from "./LoginPage/Resetpassword";



const App = () => {
  return(
       <>
       <Router>
      <Routes>
        <Route path="/" element={<Landingpage/>} />
        <Route path="/login" element={<Loginpage />} /> 
        <Route path="/register" element={<Registerpage/>} /> 
        <Route path = "/otp-verification" element = {<OtpFormRegistrationpage/>}/>
        <Route path = "/forgot-password" element = {<ForgotPasswordpage/>}/>
        <Route path = "/login" element = {<ResetPasswordpage/>}/>
        
    </Routes>
    </Router>
       </>
  )
}
export default App;