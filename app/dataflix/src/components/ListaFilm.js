import React, { useState, useEffect } from 'react';
import CardFilm from "./CardFilm";
import { Modal, Button } from 'react-bootstrap';
import './styles/ListaFilm.css';

function ListaFilm() {
    const [films, setFilms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [years, setYears] = useState([]);

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
                const response = await fetch('http://127.0.0.1:5000/get_first_80_entries', {
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

    useEffect(() => {
        const fetchReleaseYears = async () => {
          try {
            const response = await fetch('http://127.0.0.1:5000/get_release_years', {
              method: 'POST', // Metodo POST
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({}), // Corpo della richiesta, se necessario
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setYears(data);
          } catch (error) {
            console.error('Errore nella fetch degli anni di rilascio:', error);
          }
        };
    
        fetchReleaseYears(); // Chiama la funzione per ottenere gli anni di rilascio
    }, []);

    const handleYearChange = async (event) => {
        const selectedYear = event.target.value;
        
        try {
            const response = await fetch('http://127.0.0.1:5000/find_by_year', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ year: selectedYear }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setFilms(data); // Imposta i film nello stato con i risultati filtrati
        } catch (error) {
            console.error('Errore nella fetch dei film per anno:', error);
        }
    };

    return (
        <div className="row containerCards">

            <div className='containerInput mb-3'>
                <input type="text" className="form-control inputText" id="titleSearch" placeholder="Ricerca per titolo"/> 
                <input type="text" className="form-control inputText" id="actorsSearch" placeholder="Ricerca per attori/regista"/> 
                <select className="form-select inputText" aria-label="Default select example" onChange={handleYearChange}>
                    <option selected>Anno di rilascio</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select className="form-select inputText" id='annoRilascio' aria-label="Default select example">
                    <option selected>Tipo di contenuto</option>
                    <option value="Movie">Film</option>
                    <option value="TV Show">Serie</option>
                </select>
            </div>

            {films.map((film, index) => (
                <CardFilm key={index} elemento={film} onShowModal={handleShowModal} />
            ))}

            <Modal show={showModal} onHide={handleCloseModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
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
