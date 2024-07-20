import React, { useState, useEffect } from 'react';
import CardFilm from "./CardFilm";
import { Modal, Button } from 'react-bootstrap';
import './styles/ListaFilm.css'


function ListaFilm() {
    const [films, setFilms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const handleShowModal = (movie) => {
        setSelectedMovie(movie);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMovie(null);
    };

    useEffect(() => {
        // Funzione per fare la fetch dei film con POST
        const fetchFilms = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/movie/findAllMovie', {
                    method: 'POST', // Cambia il metodo a POST
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Includi un corpo della richiesta se necessario (qui è vuoto)
                    body: JSON.stringify({}),
                });

                // Controlla se la risposta è ok
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setFilms(data); // Imposta i film nello stato
            } catch (error) {
                console.error('Errore nella fetch dei film:', error);
            }
        };

        fetchFilms(); // Chiama la funzione per ottenere i film
    }, []); 




    return (
        <div className="row containerCards">

            <div className='containerInput mb-3'>
                <input type="text" className="form-control inputText" id="titleSearch" placeholder="Ricerca per titolo"/> 
                <input type="text" className="form-control inputText" id="actorsSearch" placeholder="Ricerca per attori"/> 
                <select class="form-select inputText" aria-label="Default select example">
                    <option selected>Anno di rilascio</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                </select>
                <select class="form-select inputText" aria-label="Default select example">
                    <option selected>Tipo di contenuto</option>
                    <option value="Movie">Film</option>
                    <option value="TV Show">Serie</option>
                </select>
                <button type="button" className="btn btn-primary">Cerca</button>
            </div>


            {films.slice(0, 10).map((film, index) => (
                <CardFilm key={index} elemento={film} onShowModal={handleShowModal} />
            ))}


            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <h1 className="display-6">{selectedMovie?.title}</h1>
                </Modal.Header>
                <Modal.Body>
                    <span>{selectedMovie?.description}</span> <br/><br/>
                    <span><span className='grassetto'>Release Date: </span>{selectedMovie?.release_year}</span> <br/><br/>
                    <span><span className='grassetto'>Country: </span>{selectedMovie?.country}</span> <br/><br/>
                    <span><span className='grassetto'>Rating: </span>{selectedMovie?.rating}</span> <br/><br/>
                    <span><span className='grassetto'>Duration: </span>{selectedMovie?.duration}</span> <br/><br/>
                    <span><span className='grassetto'>Date added on Netflix: </span>{selectedMovie?.date_added}</span> <br/><br/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default ListaFilm;
