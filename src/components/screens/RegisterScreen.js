import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import "./RegisterScreen.css";


const RegisterScreen = ({history}) => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [error, setError] = useState("");

    useEffect(()=>{
        if(localStorage.getItem("authToken")) {
            history.push('/');
        }
    });

    const registerHandler = async(e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json"
            }
        }

        if(password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");

            setTimeout(()=>{
                setError("");
            }, 5000);
            return setError("Passwords do not match");
        }

        try{
            const {data} = await axios.post("http://localhost:5000/api/auth/register", {username, email, password}, config);
            localStorage.setItem("authToken", data.token);

            history.push("/");
        }catch(err){
            setError(err.response.data.error);
            setTimeout(()=>{
                setError("");
            }, 5000);
        }
    }

    return (
        <div>
            <form onSubmit={registerHandler}>
                <h3>Register</h3>
                {error && <span>{error.message}</span>}
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input type="email" require id="email" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor='name'>username:</label>
                    <input type="text" require id="name" placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor='password'>password:</label>
                    <input type="password" require id="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor='confirmpassword'>confirm password:</label>
                    <input type="password" require id="confirmPassword" placeholder='Confirm password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                </div>
                <button type="submit">Register</button>
                <span>Already have an account <Link to="/login">Login</Link></span>
            </form>
        </div>
    )
}


export default RegisterScreen;