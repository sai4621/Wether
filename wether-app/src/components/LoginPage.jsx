import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { useAuth } from './AuthContext';  // Make sure this path is correct relative to LoginPage


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
      console.log("Attempting to log in with", username, password); // Debugging
      setError("");
      try {
          const response = await axios.post('http://localhost:5000/login', { username, password });
          console.log("Login response:", response); // Debugging
          if (response.data.status === 'success') {
              login(username);  // This should update the context
              navigate('/');    // Redirect to home or another page
          } else {
              throw new Error(response.data.message);
          }
      } catch (error) {
          console.error("Login error:", error); // Debugging
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ maxWidth: "300px", width: "100%" }}>
        <button onClick={() => setIsSigningUp(false)}>Sign In</button>
        <button onClick={() => setIsSigningUp(true)}>Sign Up</button>

        <form onSubmit={isSigningUp ? handleSignUp : handleSignIn}>
          <div style={{ marginBottom: "1em" }}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div style={{ marginBottom: "1em" }}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {isSigningUp && (
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}

          <div style={{ marginBottom: "1em" }}>
            <button type="submit">{isSigningUp ? "Sign Up" : "Sign In"}</button>
          </div>

          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
