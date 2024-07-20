import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './styles/CardFilm.css';

function CardFilm (props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className='containerCard col-md-3 col-12'>
            <Card className='col-12'>
            <Card.Img variant="top" src="https://www.ceotech.it/wp-content/uploads/2022/05/Netflix-offre-a-pochi-laccesso-anticipato-a-film-e-serie.jpg" />
            <Card.Body>
                <Card.Title>{props.elemento.title}</Card.Title>
                <Card.Text>
                {props.elemento.description}
                </Card.Text>
                <Button variant="primary"  onClick={() => props.onShowModal(props.elemento)}>
                    Vai ai dettaglio
                </Button>
            </Card.Body>
            </Card>
        </div>
    )
}

export default CardFilm;