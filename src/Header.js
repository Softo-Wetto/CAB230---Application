import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

export default function Header() {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("userEmail"));
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    
    const checkTokenExpiration = async () => {
      const bearerToken = localStorage.getItem("bearerToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!bearerToken) {
        return;
      }

      const tokenExpiration = JSON.parse(atob(bearerToken.split(".")[1])).exp * 1000;
      const timeToExpire = tokenExpiration - Date.now();
      
      // Refresh token if it is going to expire in 1 minute
      if (timeToExpire <= 60 * 1000) {
        try {
          const response = await fetch("http://sefdb02.qut.edu.au:3000/user/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (response.ok) {
            const { bearerToken: newBearerToken, refreshToken: newRefreshToken } = await response.json();
            localStorage.setItem("bearerToken", newBearerToken.token);
            localStorage.setItem("refreshToken", newRefreshToken.token);
            setLoggedInUser(localStorage.getItem("userEmail"));
          } else {
            const errorResponse = await response.json();
            if (errorResponse.message === "Request body incomplete, refresh token required") {
              throw new Error("Request body incomplete, refresh token required");
            } else if (errorResponse.message === "JWT token has expired") {
              throw new Error("JWT token has expired");
            } else {
              throw new Error("Failed to refresh token");
            }
          }
        } catch (error) {
          localStorage.clear();
          setLoggedInUser(null);
          alert(`${error.message}. Please log in again.`);
          navigate("/login");
        }
      }
      
      timer = setTimeout(checkTokenExpiration, 60 * 1000);
    };
    
    checkTokenExpiration();
    
    return () => clearTimeout(timer);
  }, [navigate, setLoggedInUser]);
  

  const handleLogout = async () => {
    try {
      const response = await fetch("http://sefdb02.qut.edu.au:3000/user/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: localStorage.getItem("refreshToken"),
        }),
      });
      if (response.ok) {
        localStorage.removeItem("bearerToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        setLoggedInUser(null);
        navigate("/login");
      } else if (response.status === 429) {
        console.error(response.status, response.statusText);
        throw new Error("Too many requests, please try again later.");
      } else {
        console.error(response.status);
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  

  const renderLogoutButton = () => {
    if (loggedInUser) {
      return (
        <button className="btn btn-link" onClick={handleLogout}>
          Logout ({loggedInUser})
        </button>
      );
    } else {
      return (
        <Link className="nav-link" to="/login">
          Login
        </Link>
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
    } else {
      return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          MovieFanatics
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/movies">
                Movies
              </Link>
            </li>
            {!loggedInUser && (
              <li className="nav-item">
                <Link className="nav-link" to="/registration">
                  Register
                </Link>
              </li>
            )}
            <li className="nav-item">{renderLogoutButton()}</li>
          </ul>
          {renderLoggedInUser()}
        </div>
      </div>
    </nav>
  );
}
