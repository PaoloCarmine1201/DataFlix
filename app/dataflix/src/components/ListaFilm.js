import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CardFilm from "./CardFilm";
import { Modal, Button } from 'react-bootstrap';
import './styles/ListaFilm.css';

// Assicurati di avere l'elenco delle opzioni disponibili
const colourOptions = [
    { value: "TV Shows", label: "TV Shows" },
    { value: "Cult Movies", label: "Cult Movies" },
    { value: "Spanish-Language TV Shows", label: "Spanish-Language TV Shows" },
    { value: "Anime Features", label: "Anime Features" },
    { value: "TV Sci-Fi & Fantasy", label: "TV Sci-Fi & Fantasy" },
    { value: "Teen TV Shows", label: "Teen TV Shows" },
    { value: "Comedies", label: "Comedies" },
    { value: "TV Action & Adventure", label: "TV Action & Adventure" },
    { value: "TV Horror", label: "TV Horror" },
    { value: "LGBTQ Movies", label: "LGBTQ Movies" },
    { value: "Horror Movies", label: "Horror Movies" },
    { value: "Sci-Fi & Fantasy", label: "Sci-Fi & Fantasy" },
    { value: "Children & Family Movies", label: "Children & Family Movies" },
    { value: "British TV Shows", label: "British TV Shows" },
    { value: "TV Dramas", label: "TV Dramas" },
    { value: "Sports Movies", label: "Sports Movies" },
    { value: "Classic & Cult TV", label: "Classic & Cult TV" },
    { value: "Action & Adventure", label: "Action & Adventure" },
    { value: "Reality TV", label: "Reality TV" },
    { value: "Crime TV Shows", label: "Crime TV Shows" },
    { value: "TV Thrillers", label: "TV Thrillers" },
    { value: "International TV Shows", label: "International TV Shows" },
    { value: "Kids' TV", label: "Kids' TV" },
    { value: "Science & Nature TV", label: "Science & Nature TV" },
    { value: "Movies", label: "Movies" },
    { value: "Romantic Movies", label: "Romantic Movies" },
    { value: "Anime Series", label: "Anime Series" },
    { value: "International Movies", label: "International Movies" },
    { value: "Dramas", label: "Dramas" },
    { value: "Korean TV Shows", label: "Korean TV Shows" },
    { value: "TV Comedies", label: "TV Comedies" },
    { value: "Faith & Spirituality", label: "Faith & Spirituality" },
    { value: "Thrillers", label: "Thrillers" },
    { value: "Documentaries", label: "Documentaries" },
    { value: "Romantic TV Shows", label: "Romantic TV Shows" },
    { value: "Classic Movies", label: "Classic Movies" },
    { value: "TV Mysteries", label: "TV Mysteries" },
    { value: "Music & Musicals", label: "Music & Musicals" },
    { value: "Independent Movies", label: "Independent Movies" },
    { value: "Docuseries", label: "Docuseries" },
    { value: "Stand-Up Comedy & Talk Shows", label: "Stand-Up Comedy & Talk Shows" },
    { value: "Stand-Up Comedy", label: "Stand-Up Comedy" }
];

const animatedComponents = makeAnimated();

function ListaFilm() {
    const [contenuti, setContenuti] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [years, setYears] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchParams, setSearchParams] = useState({
        year: '',
        type: 'Movie',
        title: '',
        fullname: '',
        listed_in: [], // Generi selezionati
        limit: 80
    });
    const [noContentFound, setNoContentFound] = useState(false);

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
                setNoContentFound(data.length === 0);
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
        setSearchParams(prevParams => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const handleGenreChange = (selectedOptions) => {
        setSelectedGenres(selectedOptions);
        setSearchParams(prevParams => ({
            ...prevParams,
            listed_in: selectedOptions.map(option => option.value),
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

                {/* Componente Select per generi */}
                <div className="genre-select inputText">
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        value={selectedGenres}
                        onChange={handleGenreChange}
                        options={colourOptions}
                    />
                </div>
            </div>

            {noContentFound ? (
                <h1 className="text-center">Nessun contenuto trovato</h1>
            ) : (
                contenuti.map((contenuto, index) => (
                    <CardFilm key={index} elemento={contenuto} onShowModal={handleShowModal} />
                ))
            )}

            <Modal show={showModal} onHide={handleCloseModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <h1 className="display-6">{selectedContent?.title}</h1>
                </Modal.Header>
                <Modal.Body>
                    <span>{selectedContent?.description}</span> <br/><br/>
                    <span><span className='grassetto'>Release Date: </span>{selectedContent?.release_year}</span> <br/><br/>
                    <span><span className='grassetto'>Country: </span>{selectedContent?.country}</span> <br/><br/>
                    <span><span className='grassetto'>Rating: </span>{selectedContent?.rating}</span> <br/><br/>
                    <span><span className='grassetto'>Genres: </span>{selectedContent?.listed_in}</span> <br/><br/>
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
