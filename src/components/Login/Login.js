import React, { useState ,useCallback } from 'react';
import './Login.css';
import FacebookLogin from 'react-facebook-login';
import { withRouter } from 'react-router'
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/action/auth';
import axios from 'axios';
const apiUrl = "https://boutive.test";


const  Login  = (props) => {
  const dispatch = useDispatch();

  const [register,setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [message, setmessage] = useState('');
  const [info, setInfo] = useState('');
  const[loading,setLoading] = useState(false);
  const [name,setName] = useState('');
  const [email, setEmail] = useState("");
  const [mail, setMail] = useState("");
  const [passw, setPassw] = useState("");
  const [view, setView] = useState("loginView");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    setRegister(!register);
   }
  const responseFacebook = (response) => {
    setData(response);
    if (response.accessToken) {
      const validUser = authHandler(response);
      if(!validUser){
        setLogin(true);
        setRegister(false);
        setmessage('Login Fails');
      }
      setLogin(false);
      setRegister(false);
  }
  }

  const authHandler = async(response) => {
    let action;
    setLoading(true);
    if (login) {
      action = authActions.login(
        response.email,
        response.password
      );
    }
    else if (register) {
      action = authActions.signUp(
        response.name,
        response.mail,
        response.passw

      );
    }
    else {
      action = authActions.loginFacebook(
        response.name,
        response.email,
        response.id  )
    }
    try{
      await  dispatch(action);
      props.closeModal();
      if(props.chkLogUser){
        props.history.push('/favorites');
      }

      }
      catch(err){
        setmessage(err.message);
        setLoading(false);
      }
      setLoading(false);
  };


  function handleLogin(event) {
    event.preventDefault();
   const request = {
      email ,
      password
    }
      const validUser = authHandler(request);
      if(!validUser){
        setLogin(true);
        setRegister(false);
        setmessage('Login Fails');
      }
      setLogin(false);
      setRegister(false);

    }
  const handleRegister =(event)=>{
    event.preventDefault();
     const request = {
        name,
        mail ,
        passw
      }
       const validUser = authHandler(request);
        if(!validUser){
          setLogin(false);
          setRegister(true);
          setmessage('SignUp Fails');
        }
        setLogin(false);
        setRegister(false);

      };

  let setRegisterView = () => {
    setView("registerView");
    setRegister(true);
    setLogin(false);

  }

  let setLoginView = () => {
    setView("loginView");
    setRegister(false);
    setLogin(true);
  }

  let setForgotPasswordView = () => {
    setView("forgotPasswordView")
  }


  const handleForgotPassword = async(event) => {
    event.preventDefault();
    setLoading(true);
    setmessage(null);
    setInfo(null)
    const request = {
      email 
    }  

  try{
    const res = await axios.post(`${apiUrl}/facebook/password/email`,
    {         email: email
    });
  const response  = await res;
    if(response.status == '200'){
      if(response.data.message){
        setInfo(response.data.message);
        setTimeout(()=> {
          props.closeModal();
       }, 3000)
      }
      else{
        setmessage(response.data);
  
      }
    }
    else{
      setmessage(response.data.message);
    }
    console.log(loading);
  }
  catch(err){
    setmessage("Can't find a user with that e-mail address");

  }
  setLoading(false);
  }
  const formStyle = {
    cursor: "not-allowed", 

  };
  const inputStyle = {
    pointerEvents: "none",

  };
  let registerView = (
    <div className="Login-center" style={(loading) ? formStyle : null}>
      <h3>Sign Up</h3>
      <form className ="Sign-in-form"  name="signUP" onSubmit={handleRegister}>
        <p> Full Name </p>
        <input type="text" required  name="name" autoFocus   autocomplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        <p> Email </p>
        <input type="email" required  name="mail"    autocomplete="off"  value={mail} onChange={(e) => setMail(e.target.value)} />
        <p> Password </p>
        <input type="password" required  name="passw"   value={passw} onChange={(e) => setPassw(e.target.value)} />
        <input type="submit" value="Submit"  style={(loading) ? inputStyle : null}></input>   { /* This is where the data request should go on submit */ }
      </form>

      <FacebookLogin
        //appId= "826605911144482"
        appId="292587972118608"
        fields="name,email"
        scope="public_profile,user_friends"
        callback={responseFacebook}
        icon="fa-facebook"
        cssClass="Facebook-login"
        textButton="Continue with Facebook"
      />

      <p> Already a member?  <a onClick={setLoginView}>Login.</a> </p>
    </div>
  )

  let loginView = (
    <div className="Login-center" style={(loading) ? formStyle : null}>
      <h3>Sign in</h3>
      <form className ="Sign-in-form" onSubmit={handleLogin}>
        <p> Email </p>
        <input type="email" required name="email"   autoFocus  autocomplete="off" value={email}  onChange={(e) => setEmail(e.target.value)} />
        <p> Password </p>
        <input type="password"  required name="password"   autocomplete="off" value={password}  onChange={(e) => setPassword(e.target.value)}/>
        <input type="submit" value="Submit" style={(loading) ? inputStyle : null} onClick={() => {setLogin(prevState => !prevState)}} />
         { /* This is where the data request should go on submit */ }
      </form>

      <FacebookLogin
        //appId= "826605911144482"
        appId="292587972118608"
        fields="name,email"
        scope="public_profile,user_friends"
        callback={responseFacebook}
        icon="fa-facebook"
        cssClass="Facebook-login"
      />
        <p>Not a member? <a onClick={setRegisterView} >Sign up.</a> </p>
        <br/>
        <p> <a onClick={setForgotPasswordView} >Forgot password?</a> </p>
    </div>
  )

  let forgotPasswordView = (
  <div className="Login-center" style={(loading) ? formStyle : null}  >
    <h3>Forgot Password?</h3>
    <p style={{textAlign:"center"}}>Enter your login email to receive password reset instructions.</p>
    <br/>
    <form className ="Sign-in-form" onSubmit={handleForgotPassword}>
      <p> Email </p>
      <input type="email" required name="email"   autoFocus  autocomplete="off" value={email}  onChange={(e) => setEmail(e.target.value)} />  { /* TO DO: rework this component for password reset */ }
      <input type="submit" value="Submit" style={(loading) ? inputStyle : null} onClick={() => {setLogin(prevState => !prevState)}} />
    </form>
    <br/>
    <p>  Not a member? <a onClick={setRegisterView} >Sign up.</a> </p>
    <br/>
    <p>  Already have an account? <a onClick={setLoginView} >Sign in.</a> </p>
  </div>
  )

  const renderSwitch = (param) => {
      switch (param) {
            case "loginView":          return loginView;
            case "registerView":       return registerView;
            case "forgotPasswordView": return forgotPasswordView;
          }
        }



 return (

    <div className="Login">
      {renderSwitch(view)}
      { /* Below is for trouble shooting and should be removed */ }
      {
        <div>
          <span>{data.name}</span>
          <p>
            {data.email}
          </p>
        </div>
      }
      {message ? <div style={{color:'red'}}>{message}</div> : null }
      {info ? <div style={{color:'green'}}>{info}</div> : null }

      </div>
  );
}



export default withRouter(Login);
