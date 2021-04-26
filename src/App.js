import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser]=useState(false)
  const [user, setUser]=useState({
    isSignedIn:false,
    name:'',
    email:'',
    password :'',
    photo:'',
    error:'',
    success:false
  })
  const googleprovider = new firebase.auth.GoogleAuthProvider();
  const fbprovider = new firebase.auth.FacebookAuthProvider();
  const handleSingIn =()=>{
    firebase.auth()
  .signInWithPopup(googleprovider)
  .then(result => {
    const{displayName,photoURL,email}=result.user;
    const signedInUser={
      isSignedIn:true,
      name:displayName,
      email:email,
      photo:photoURL
    }
    setUser(signedInUser);
    console.log(displayName,photoURL,email);
  }) 
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console.log(error.message);
  });
  }
  const handleSingout =()=>{
    firebase.auth().signOut()
    .then((res) => {
     const signOutUser={
       isSignedIn:false,
       newUser:false,
       name:'',
       email:'',
       phone:''
     }
     setUser(signOutUser);
    }).catch((error) => {
      // An error happened.
    });
  }
 const  handleChange=(event)=>{
let isFormvalid = true;
if(event.target.name==='email'){
  isFormvalid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(event.target.value)
}
if(event.target.name==='password'){
 const isPasswordValid = event.target.value.length>6;
 const passwordHasNumber =/\d{1}/.test(event.target.value);
 isFormvalid=(isPasswordValid && passwordHasNumber);
}
if(isFormvalid){
  const newUserInfo ={...user}
  newUserInfo[event.target.name]=event.target.value; 
  setUser(newUserInfo);
}
  }
  const handleSubmit=(event)=>{
if( newUser && user.name && user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo)
     updateUsername(user.name);
    // ...
  })
  .catch((error) => {
    const newUserInfo={...user}
    var errorCode = error.code;
    var errorMessage = error.message;
    newUserInfo.success=false;
    newUserInfo.error=error.message;
    setUser(newUserInfo);
    // ..
  });
}
if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    var user = userCredential.user;
    const newUserInfo={...user};
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo)
    console.log('sign in user info',userCredential.user)
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    const newUserInfo={...user}
    newUserInfo.success=false;
    newUserInfo.error=error.message;
    setUser(newUserInfo);
  });
}
event.preventDefault();
  }

  const handleFbsignIn = () =>{
    firebase.auth().signInWithPopup(fbprovider)
  .then(function(result) {
    /** @type {firebase.auth.OAuthCredential} */
    // var credential = result.credential;
var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // var accessToken = credential.accessToken;
console.log('fb user after sign in',user);
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
console.log(error);
    // ...
  });
  }

  const updateUsername= name =>{
    var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
})
.then(function() {
 console.log('username updated successfully')
}).catch(function(error) {
  console.log(error)
});
  }
  return (
    <div className="App">
      {
   user.isSignedIn?<button onClick={handleSingout}>Sign out</button>:<button onClick={handleSingIn}>Sign in</button>
      }
      <br/>
      <button onClick={handleFbsignIn}>Sign in Using Facebook</button>
      {
        user.isSignedIn &&
        <div>
           <p>welcome mr. {user.name}</p>
           <p>your email is:{user.email} </p>
           <img src={user.photo} alt=""/>
           </div>
      }
      <h1>our own authentication</h1>
      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
      <lebel htmlFor="newUser" >new User sign Up</lebel>
      <form onSubmit={handleSubmit} action="">
      {newUser && <input name="name" type="text" onBlur={handleChange} placeholder="Name" required/>}
      <br/>
      <input type="text" name="email" onBlur={handleChange} placeholder="email" required />
      <br/>
      <input type="password" onBlur={handleChange} name="password" placeholder="password" required />
      <br/>
      <input type="submit"  value={newUser?'Sign Up':'Sign In'}/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {user.success && <p style={{color:'green'}}>User { newUser? 'created' :'log in'} successfully</p>  }
      
    </div>
  );
}

export default App;
