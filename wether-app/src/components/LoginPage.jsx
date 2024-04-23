import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await axios.post("/login", { username, password });
      console.log(response.data.message);
      alert("Login successful!");
    } catch (error) {
      setError("Failed to login: " + error?.response?.data?.message || error.message);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");
  
    // Validate password and confirmPassword
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      const response = await axios.post("/signup", { username, password });
      console.log(response.data.message);
      alert("Signup successful!");
      setIsSigningUp(false); // Switch to sign-in view
    } catch (error) {
      // More robust error handling
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        setError("Failed to sign up: " + (error.response.data.message || error.response.data.error || "Unknown error"));
      } else if (error.request) {
        // The request was made but no response was received
        setError("Failed to sign up: No response from server.");
      } else {
        // Something happened in setting up the request that triggered an error
        setError("Failed to sign up: " + error.message);
      }
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
