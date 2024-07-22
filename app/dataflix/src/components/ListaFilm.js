import React, { useState, useEffect } from 'react';
import CardFilm from "./CardFilm";
import { Modal, Button } from 'react-bootstrap';
import './styles/ListaFilm.css';

function ListaFilm() {
    const [contenuti, setContenuti] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [years, setYears] = useState([]);
    const [searchParams, setSearchParams] = useState({
        year: '',
        type: 'Movie',
        title: '',
        fullname: '',
        limit: 80
    });

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
                const response = await fetch('http://127.0.0.1:5000/search_entries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(searchParams),
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
    }, [searchParams]);

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    return (
        <div className="row containerCards">
            <div className='containerInput mb-3'>
                <input
                    type="text"
                    className="form-control inputText"
                    id="titleSearch"
                    name="title"
                    placeholder="Ricerca per titolo"
                    value={searchParams.title}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    className="form-control inputText"
                    id="actorsSearch"
                    name="fullname"
                    placeholder="Ricerca per attori/regista"
                    value={searchParams.fullname}
                    onChange={handleInputChange}
                />
                <select
                    className="form-select inputText"
                    aria-label="Default select example"
                    name="year"
                    value={searchParams.year}
                    onChange={handleInputChange}
                >
                    <option value="">Anno di rilascio</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select
                    className="form-select inputText"
                    id="contentType"
                    aria-label="Default select example"
                    name="type"
                    value={searchParams.type}
                    onChange={handleInputChange}
                >
                    <option disabled value="">Tipo di contenuto</option>
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
                    <span><span className='grassetto'>Director: </span>{selectedContent?.director}</span> <br/><br/>
                    <span><span className='grassetto'>Cast: </span>{selectedContent?.cast}</span> <br/><br/>
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