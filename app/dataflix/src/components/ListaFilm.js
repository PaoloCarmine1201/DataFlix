import React, { useState, useEffect } from 'react';
import CardFilm from "./CardFilm";

function ListaFilm() {
    const [films, setFilms] = useState([]);

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
    }, []); // L'array vuoto assicura che l'effetto venga eseguito solo al montaggio del componente

    return (
        <div className="row">
            {films.map((film, index) => (
                <CardFilm key={index} elemento={film} />
            ))}
        </div>
    );
}

export default ListaFilm;
