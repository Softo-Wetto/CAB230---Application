import "./App.css";
import "./css/SearchBox.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import React, { useState, useEffect, useRef } from "react";
import { Button, Badge } from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Chart from "chart.js/auto";
import { debounce } from "lodash";

export default function Movies() {
  const [rowData, setRowData] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const navigate = useNavigate();

  const columns = [  
    { headerName: "#", valueGetter: "node.rowIndex + 1", width: 50 }, 
    { headerName: "Title", field: "title" },  
    { headerName: "Year", field: "year", width: 150 },  
    { headerName: "IMDB Rating", field: "imdbRating", width: 150 },  
    { headerName: "Rotten Tomatoes Rating", field: "rottenTomatoesRating", width: 200 },  
    { headerName: "Metacritic Rating", field: "metacriticRating", width: 150 },  
    { headerName: "Classification", field: "classification" },  
    { headerName: "IMDB ID", field: "imdbID", width: 170 }];

    useEffect(() => {
      fetch(
        `http://sefdb02.qut.edu.au:3000/movies/search?title=${searchTitle}&year=${searchYear}`
      )
        .then((res) => res.json())
        .then((data) => setRowData(data.data));
    }, [searchTitle, searchYear]);
  
    const onGridReady = (params) => {
      const gridApi = params.api;
    
      const handleScroll = debounce(() => {
        const currentRowCount = gridApi.getDisplayedRowCount();
        const totalRowCount = gridApi.getDisplayedRowCount();
    
        if (currentRowCount === totalRowCount) {
          return;
        }
    
        const lastDisplayedRowIndex = gridApi.getLastDisplayedRow();
        const batchEndIndex = Math.min(
          lastDisplayedRowIndex + 50,
          totalRowCount - 1
        );
    
        if (batchEndIndex > lastDisplayedRowIndex) {
          gridApi.ensureIndexVisible(batchEndIndex);
        }
    
        // update row IDs
        gridApi.forEachNode((node, index) => {
          node.setDataValue("id", index + 1);
        });
      }, 300);
    
      gridApi.addEventListener("bodyScroll", handleScroll);
    };
  

  const handleTitleSearch = (event) => {
    setSearchTitle(event.target.value);
  };

  const handleYearSearch = (event) => {
    setSearchYear(event.target.value);
  };

  useEffect(() => {
    fetch(`http://sefdb02.qut.edu.au:3000/movies/search?title=${searchTitle}&year=${searchYear}`)
      .then((res) => res.json())
      .then((data) => {
        setRowData(data.data);
        const ratings = data.data.map(movie => ({
          imdbRating: Number(movie.imdbRating),
          rottenTomatoesRating: Number(movie.rottenTomatoesRating),
          metacriticRating: Number(movie.metacriticRating)
        }));
        const avgRatings = {
          imdbRating: ratings.reduce((sum, movie) => sum + movie.imdbRating, 0) / ratings.length,
          rottenTomatoesRating: ratings.reduce((sum, movie) => sum + movie.rottenTomatoesRating, 0) / ratings.length,
          metacriticRating: ratings.reduce((sum, movie) => sum + movie.metacriticRating, 0) / ratings.length
        };

        // Create chart
        const chartCanvas = document.getElementById("ratingsChart");
        const chart = new Chart(chartCanvas, {
          type: "bar",
          data: {
            labels: ["IMDB", "Rotten Tomatoes", "Metacritic"],
            datasets: [{
              label: "Average Ratings", 
              data: [avgRatings.imdbRating, avgRatings.rottenTomatoesRating, avgRatings.metacriticRating],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)"
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      });
  }, [searchTitle, searchYear]);



  return (
    <div className="container">
      <Header /><br></br>
      <h1>Movie Catalogue</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by Title"
          value={searchTitle}
          onChange={handleTitleSearch}
        />
        <input
          type="text"
          placeholder="Search by Year (1990 - 2023)"
          value={searchYear}
          onChange={handleYearSearch}
        />
      </div>
      <p>
  <Badge color="success">{rowData ? rowData.length : 0}</Badge> Movies Showing (Click On The Movies To Get Started!)
      </p>
      <div className="table-wrapper">
        <div className="ag-theme-balham" style={{ height: "500px" }}>
          <AgGridReact
            columnDefs={columns}
            rowData={rowData}
            pagination={true}
            onGridReady={onGridReady}
            onRowClicked={(row) =>
            navigate(`/Film?imdbID=${row.data.imdbID}`)
            }
          />
        </div>
      </div><br></br>
      <canvas id="ratingsChart" width="400" height="200"></canvas>

    <div className="button-group">
      <Button color="info" size="sm" className="mt-3 back-button" href="https://www.imdb.com/" target="_blank" style={{backgroundColor: "red"}} >
        Check out IMDB!
      </Button>
      <Button color="info" size="sm" className="mt-3 back-button" href="https://www.rottentomatoes.com/" target="_blank" style={{marginLeft: "20px"}}>
        Check out RottenTomatoes!
      </Button>
      <Button color="info" size="sm" className="mt-3 back-button" href="https://www.metacritic.com/" target="_blank" style={{marginLeft: "20px", color: "black", backgroundColor: "yellow"}}>
        Check out Metacritic!
      </Button>
    </div>

      <footer class="pt-3 mt-4 text-body-secondary border-top">
        &copy; 2023
      </footer><br></br>
    </div>
  );
}

