import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Table, Button } from "reactstrap";
import Header from "./Header";
import Chart from "chart.js/auto";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function People() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const imdbID = searchParams.get("id");
  const [actor, setActor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const chartRef = useRef(null);


  useEffect(() => {
    // check for authentication status here and set the isLoggedIn state accordingly
    const bearerToken = localStorage.getItem("bearerToken");
    setIsLoggedIn(!!bearerToken); // convert bearerToken to boolean
  
    // move the API call inside this condition
    if (!!bearerToken) {
      async function fetchPeople() {
        try {
          const response = await fetch(`http://sefdb02.qut.edu.au:3000/people/${imdbID}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearerToken}`,
            },
          });
          const data = await response.json();
          setActor(data);
        } catch (error) {
          console.error(error);
        }
      }
      fetchPeople();
    }
  }, [imdbID]);

  //Chart START
  useEffect(() => {
    if (actor && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const imdbRatings = actor.roles.map((role) => role.imdbRating);
      const avgImdbRating = imdbRatings.reduce((a, b) => a + b, 0) / imdbRatings.length;

      // destroy any existing chart instance using the same canvas element
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // create new chart instance
      chartRef.current.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Average IMDb Rating"],
          datasets: [
            {
              label: "Average IMDb Rating",
              data: [avgImdbRating.toFixed(1)],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    }
  }, [actor]);


  if (!isLoggedIn) {
    return <div className="container">
      <Header/><br></br>
      <h1>Please log in to view this page.</h1>
      <a href="/Login">
          <button class="btn btn-danger" type="button">Login Now</button>
      </a><br></br><br></br>
      <h2>Or if you haven't registered already.</h2>
      <a href="/Registration">
          <button class="btn btn-success" type="button">Register Now</button>
      </a><br></br><br></br>
      <h3>Or if you want to go back.</h3>
      <button class="btn btn-warning" type="button" onClick={() => navigate(-1)}>Go Back</button>
      <footer class="pt-3 mt-4 text-body-secondary border-top">
        &copy; 2023
      </footer>
      </div>;
  }

  if (!actor) {
    return <div>Loading...</div>;
  }

  const gridOptions = {
    defaultColDef: {
      resizable: true,
    },
    columnDefs: [
      {
        headerName: 'Movie Name',
        field: 'movieName',
        cellRendererFramework: ({ value, data }) => (
          <Link to={{ pathname: '/Film', search: `?imdbID=${data.movieId}` }}>{value}</Link>
        ),
      },
      { headerName: 'Category', field: 'category' },
      { headerName: 'Characters', field: 'characters', valueFormatter: (params) => params.value.join(', ') },
      { headerName: 'IMDb Rating', field: 'imdbRating' },
    ],
    rowData: actor.roles,
    onFirstDataRendered: (params) => {
      params.api.sizeColumnsToFit();
    },
  };


  return (
    <div className="container">
      <Header /><br></br>
      <div className="card">
      <div className="card-header">
        <h3>{actor.name}</h3>
      </div>
      <div className="card-body">
        <p className="card-text">Birth Year: {actor.birthYear}</p>
        <p className="card-text">Death Year: {actor.deathYear || "N/A"}</p>
      </div>
    </div>
    <h2>Roles</h2>
    <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact {...gridOptions} />
      </div><br></br>
      <canvas ref={chartRef}></canvas>
      <Button color="info" size="sm" className="mt-3 back-button" onClick={() => navigate(-1)}>
         Back
      </Button>
      <footer class="pt-3 mt-4 text-body-secondary border-top">
        &copy; 2023
      </footer><br></br>
    </div>
  );
}
