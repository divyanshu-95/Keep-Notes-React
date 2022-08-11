import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom';
const Login = (props) => {
    let history=useNavigate();
    const [credentials, setcredentials] = useState({email:"",password:""});
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const response=await fetch('http://localhost:5000/api/auth/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email:credentials.email,password:credentials.password})
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
    <div className='mt-3'>
      <h2>Login To Continue</h2>
        <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange}  aria-describedby="emailHelp"/>
    <div id="emailHelp"  className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password"  value={credentials.password} onChange={onChange} className="form-control" id="password" name='password'/>
  </div> 
  <button type="submit" className="btn btn-primary" >Login</button>
</form>
    </div>
  )
}

export default Login