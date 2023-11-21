import "./App.css";
import React, { useState } from "react";
import { Button, Badge } from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";

export default function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const requestBody = {
      email: email,
      password: password,
    };
  
    try {
      const response = await fetch("http://sefdb02.qut.edu.au:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else if (response.status === 429) {
        console.error(response.status, response.statusText);
        throw new Error("Too many requests, please try again later.");
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <div className="container">
  <Header /><br></br>
  <h1 class="display-4 text-center mb-5">Registration</h1>
  <div class="row justify-content-center">
    <div class="col-lg-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" class="form-label">Email</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" class="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary mb-3">
          Register
        </button>
      </form>
    </div>
  </div>
  <footer class="pt-3 mt-5 text-muted border-top text-center">
    &copy; 2023
  </footer>
</div>
  );
}
