import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom';
const Signup = (props) => {
  let history=useNavigate();
  const [credentials, setcredentials] = useState({email:"",password:"",name:"",cpassword:""});
  const handleSubmit=async (e)=>{
    e.preventDefault();
    const {name,email,password}=credentials;
    const response=await fetch('http://localhost:5000/api/auth/createUser',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({name,email,password})
    });
    const json=await response.json();
    console.log(json);
    if(json.success){
      localStorage.setItem('token',json.authToken);
      props.showAlert('Success','success');
      history("/");
    }else{
      props.showAlert('Invalid Credentials','danger');
    }

    
}
  const onChange=(e)=>{
    setcredentials({...credentials,[e.target.name]:e.target.value})
}
  return (
    <div className='container'>
      <h2>SignUp for use Notes App</h2>
        <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" required/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" required className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" onChange={onChange} className="form-control" id="password" name='password' required minLength={5}/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" onChange={onChange} className="form-control" id="cpassword" name='cpassword' required minLength={5}/>
  </div>
  <button type="submit" className="btn btn-primary">Sign Up</button>
</form>
    </div>
  )
}

export default Signup