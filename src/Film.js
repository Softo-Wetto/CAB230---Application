import "./App.css";
import "./css/MovieData.css";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button, Badge } from "reactstrap";
import Header from "./Header";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Film() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const imdbID = searchParams.get("imdbID");
  const [principals, setPrincipals] = useState([]);
  const [movieData, setMovieData] = useState(null); // Added state for movie data
  const [gridApi, setGridApi] = useState(null);

  const columns = [
    { field: "category", headerName: "Category",  width: 380 },
    { field: "name", headerName: "Name", cellRendererFramework: NameRenderer, width: 400 },
    { field: "characters", headerName: "Characters", valueGetter: getCharacters, width: 500 },
  ];

  function NameRenderer({ data }) {
    return (
      <Link to={{ pathname: "/People", search: `?id=${data.id}` }}>
        {data.name}
      </Link>
    );
  }

  function getCharacters(params) {
    return params.data.characters.join(", ");
  }

  useEffect(() => {
    async function fetchPrincipals() {
      try {
        const response = await fetch(`http://sefdb02.qut.edu.au:3000/movies/data/${imdbID}`);
        const data = await response.json();
        setPrincipals(data.principals);
        setMovieData(data); // Store the movie data in state
      } catch (error) {
        console.error(error);
      }
    }

    fetchPrincipals();
  }, [imdbID]);

  function onGridReady(params) {
    setGridApi(params.api);
  }

  return (
    <div className="container">
      <Header />
      {movieData && (
        <div className="movie-data">
          <div className="row">
            <div className="col-md-4">
              <img src={movieData.poster} alt={`Poster for ${movieData.title}`} className="img-fluid mb-3" />
            </div>
            <div className="col-md-8">
              <h1 className="mb-4">{movieData.title}</h1>
              <p>{movieData.plot}</p>
              <div className="row">
                <div className="col-sm-6">
                  <p><strong>Year:</strong> {movieData.year}</p>
                  <p><strong>Runtime:</strong> {movieData.runtime} minutes</p>
                  <p><strong>Genres:</strong> {movieData.genres.map(genre => (<Badge color="primary" className="mr-2">{genre}</Badge>))}</p>
                </div>
                <div className="col-sm-6">
                  <p><strong>Country:</strong> {movieData.country}</p>
                  <p><strong>IMDb Rating:</strong> {movieData.ratings[0].value}</p>
                  <p><strong>Box Office:</strong> {movieData.boxoffice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <h1>People</h1>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact columnDefs={columns} rowData={principals} onGridReady={onGridReady} />
      </div>
      <Button color="info" size="sm" className="mt-3 back-button" onClick={() => navigate(-1)}>
         Back
      </Button>
      <footer class="pt-3 mt-4 text-body-secondary border-top">
        &copy; 2023
      </footer><br></br>
    </div>
  );
}
