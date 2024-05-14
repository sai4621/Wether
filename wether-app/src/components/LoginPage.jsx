import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { useAuth } from './AuthContext';  // Make sure this path is correct relative to LoginPage
import "./styles.css";


const LoginPage = () => {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const handleSignIn = async (event) => {
      event.preventDefault();
      try {
          const response = await axios.post('http://localhost:5000/login', { username, password });
          if (response.data.status === 'success') {
              // Pass the entire user data object to the login function
              login(response.data);
              navigate('/');  // Redirect to home or another page
          } else {
              throw new Error(response.data.message);
          }
      } catch (error) {
          console.error("Login error:", error);
          setError("Failed to login: " + (error.response?.data?.message || error.message));
      }
  };
  

    const handleSignUp = async (event) => {
        event.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/signup', { username, password });
            if (response.data.status === 'success') {
                alert('Signup successful!');
                navigate('/');  // Redirect to home page on successful signup
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            setError("Failed to sign up: " + (error.response?.data?.message || error.message));
        }
    };

  return (
<div className="login-container">
  <div className="form-container">
    <button className="signin-button" onClick={() => setIsSigningUp(false)}>
      Sign In
    </button>
    <button className="signup-button" onClick={() => setIsSigningUp(true)}>
      Sign Up
    </button>

    <div className="signup-form" style={{ display: isSigningUp ? "block" : "none" }}>
      <form onSubmit={handleSignUp}>
        <div className="form-element">
          <label className = "username"htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="form-element">
          <label className="password" htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="form-element">
          <label className = "confirm-password" htmlFor="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>

        <div className="form-element">
          <button className="" type="submit">Sign Up</button> {/* Use the correct class here */}
        </div>
      </form>
    </div>

    <form onSubmit={handleSignIn} style={{ display: isSigningUp ? "none" : "block" }}>
      <div className="form-element">
        <label className = "username" htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>

      <div className="form-element">
        <label className="password" htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      <div className="form-element">
        <button className="signin-button" type="submit">Sign In</button> {/* Use the correct class here */}
      </div>
    </form>

    {error && <p>{error}</p>}
  </div>
</div>


  );
};

export default LoginPage;
