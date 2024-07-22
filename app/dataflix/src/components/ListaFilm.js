import React, { useState, useEffect } from 'react';
import CardFilm from "./CardFilm";
import { Modal, Button } from 'react-bootstrap';
import './styles/ListaFilm.css';

function ListaFilm() {
    const [contenuti, setContenuti] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [years, setYears] = useState([]);
    const [selectedType, setSelectedType] = useState('Movie'); // Tipo di contenuto selezionato

    const handleShowModal = (movie) => {
        setSelectedContent(movie);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedContent(null);
    };

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/get_first_80_entries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Includi un corpo della richiesta se necessario (qui è vuoto)
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setContenuti(data);
            } catch (error) {
                console.error('Errore nella fetch dei contenuti:', error);
            }
        };

        fetchEntries();
    }, []);

    useEffect(() => {
        const fetchReleaseYears = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/get_release_years', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
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

        fetchReleaseYears();
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
            setContenuti(data);
        } catch (error) {
            console.error('Errore nella fetch dei contenuti per anno:', error);
        }
    };

    const handleContentTypeChange = async (event) => {
        const selectedType = event.target.value;
        setSelectedType(selectedType);

        let endpoint = '';
        if (selectedType === 'Movie') {
            endpoint = 'http://127.0.0.1:5000/get_first_80_movies'; // Endpoint per film
        } else if (selectedType === 'TV Show') {
            endpoint = 'http://127.0.0.1:5000/get_first_80_series'; // Endpoint per serie TV
        }

        if (endpoint) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setContenuti(data);
            } catch (error) {
                console.error('Errore nella fetch dei contenuti:', error);
            }
        }
    };

    return (
        <div className="row containerCards">
            <div className='containerInput mb-3'>
                <input type="text" className="form-control inputText" id="titleSearch" placeholder="Ricerca per titolo"/> 
                <input type="text" className="form-control inputText" id="actorsSearch" placeholder="Ricerca per attori/regista"/> 
                <select className="form-select inputText" aria-label="Default select example" onChange={handleYearChange}>
                    <option value="">Anno di rilascio</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select className="form-select inputText" id='annoRilascio' aria-label="Default select example" onChange={handleContentTypeChange} defaultValue="Tipo di contenuto">
                    <option disabled>Tipo di contenuto</option>
                    <option value="Movie">Film</option>
                    <option value="TV Show">Serie</option>
                </select>
            </div>

            {contenuti.map((contenuto, index) => (
                <CardFilm key={index} elemento={contenuto} onShowModal={handleShowModal} />
            ))}

            <Modal show={showModal} onHide={handleCloseModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <h1 className="display-6">{selectedContent?.title}</h1>
                </Modal.Header>
                <Modal.Body>
                    <span>{selectedContent?.description}</span> <br/><br/>
                    <span><span className='grassetto'>Release Date: </span>{selectedContent?.release_year}</span> <br/><br/>
                    <span><span className='grassetto'>Country: </span>{selectedContent?.country}</span> <br/><br/>
                    <span><span className='grassetto'>Rating: </span>{selectedContent?.rating}</span> <br/><br/>
                    <span><span className='grassetto'>Duration: </span>{selectedContent?.duration}</span> <br/><br/>
                    <span><span className='grassetto'>Date added on Netflix: </span>{selectedContent?.date_added}</span> <br/><br/>
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