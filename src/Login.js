import "./App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import Header from "./Header";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const credentials = { email, password, longExpiry: false };
    try {
      const response = await fetch("http://sefdb02.qut.edu.au:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const { bearerToken, refreshToken } = await response.json();
        localStorage.setItem("bearerToken", bearerToken.token);
        localStorage.setItem("refreshToken", refreshToken.token);
        localStorage.setItem("userEmail", JSON.stringify(email));
        setLoggedInUser(email);
        navigate("/");
      } else if (response.status === 429) {
        console.error(response.status, response.statusText);
        throw new Error("Too many requests, please try again later.");
      } else {
        console.error(response.status, response.statusText);
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bearerToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    setLoggedInUser(null);
    navigate("/login");
  };

  const renderLoginLogoutButton = () => {
    if (loggedInUser) {
      return (
        <Button color="danger" onClick={handleLogout}>
          Logout
        </Button>
      );
    } else {
      return (
        <Button color="primary" type="submit">
          Login
        </Button>
      );
    }
  };

  const renderLoggedInUser = () => {
    if (loggedInUser) {
      return (
        <div className="ml-auto">
          <p className="mb-0">Logged in as {loggedInUser}</p>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <Header renderLoginLogoutButton={renderLoginLogoutButton} renderLoggedInUser={renderLoggedInUser} /><br></br>
      <h1 class="display-4 text-center mb-5">Login</h1>
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <Form onSubmit={handleLogin}>
            <div className="mb-3">
             <FormGroup>
              <Label for="email">Email</Label>
               <Input
               type="email"
               name="email"
                id="email"
               value={email}
               onChange={(event) => setEmail(event.target.value)}
               required
               />
              </FormGroup>
            </div>
        <div className="mb-3">
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
               type="password"
               name="password"
               id="password"
               value={password}
               onChange={(event) => setPassword(event.target.value)}
               required
             />
            </FormGroup>
        </div>
          <Button type="submit" color="primary">
             Login
           </Button>
        </Form>
      </div>
     </div>
          <footer class="pt-3 mt-5 text-muted border-top text-center">
            &copy; 2023
          </footer>
    </div>
  );
}
