import "./App.css";
import { Carousel } from 'react-bootstrap';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import React, { useState, useEffect } from "react";
import { Button, Badge } from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";

export default function App() {
  const navigate = useNavigate();

  const handleListClick = () => {
    navigate("/Movies");
  };

  return (
    <div className="container">
    <Header /><br></br>
    <div class="p-5 mb-4 bg-light border rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">MovieFanatics</h1>
        <p class="col-md-8 fs-4">Welcome to our movie API website! Here, you can explore a vast collection of movies from different 
        genres and countries. With our user-friendly interface, you can easily search and filter movies based on your preferences. </p>
        <a href="/Movies">
        <button class="btn btn-success btn-lg" type="button">Check Out Now!</button>
        </a>
      </div>
    </div>

    <div className="carousel-container">
    <Carousel>
      <Carousel.Item>
        <img
          className="carousel-img"
          src="https://images6.alphacoders.com/118/1184503.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>El Camino: A Breaking Bad Movie</h3>
          <p>After a dramatic escape from captivity, Jesse Pinkman must deal with his past in order to make some kind of future for himself.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="carousel-img"
          src="https://images2.alphacoders.com/685/685629.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Better Call Saul</h3>
          <p>Ex-con artist Jimmy McGill turns into a small-time attorney and goes through a series of trials and tragedies, as he transforms 
            into his alter ego Saul Goodman, a morally challenged criminal lawyer.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="carousel-img"
          src="https://wallpapercave.com/wp/wp4119526.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3 class="text-dark">One Flew Over the Cuckoo's Nest</h3>
          <p class="text-dark">In order to escape the prison labour, McMurphy, a prisoner, fakes insanity and is shifted to the special ward for the mentally 
            unstable. In this ward, he must rise up against a cruel nurse, Ratched.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </div><br></br>

    <div class="row align-items-md-stretch">
      <div class="col-md-6">
        <div class="h-100 p-5 text-bg-dark rounded-3">
          <h2>Instant Information</h2>
          <p> Our API provides you with detailed information on each movie, including the plot, cast, crew, ratings, and more. Whether 
            you're a casual movie-goer or a film enthusiast, our website is your one-stop-shop for everything related to movies. So 
            sit back, relax, and start exploring the world of cinema with us!</p>
          <a href="/Movies">
          <button class="btn btn-outline-light" type="button">Check Out Now!</button>
          </a>
        </div>
      </div>
      <div class="col-md-6">
        <div class="h-100 p-5 bg-body-tertiary border rounded-3">
          <h2>Get in Now</h2>
          <p>Our website aims to provide movie enthusiasts with an all-in-one platform to search, discover, and learn more about their 
            favorite movies. We utilize a powerful movie API to gather comprehensive information about movies, including their ratings,
             reviews, cast, crew, trailers, and more. Our user-friendly interface allows users to easily search for movies.</p>
          <a href="/Movies">
          <button class="btn btn-outline-secondary" type="button">Check Out Now!</button>
          </a>
        </div>
      </div>
    </div>
      <footer class="pt-3 mt-4 text-body-secondary border-top">
        &copy; 2023
      </footer><br></br>
    </div>
  );
}
