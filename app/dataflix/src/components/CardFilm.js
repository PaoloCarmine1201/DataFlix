import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CardFilm (props) {
    return (
        <Card className='col-md-3 col-12'>
            <Card.Img variant="top" src="https://www.ceotech.it/wp-content/uploads/2022/05/Netflix-offre-a-pochi-laccesso-anticipato-a-film-e-serie.jpg" />
            <Card.Body>
                <Card.Title>{props.elemento.title}</Card.Title>
                <Card.Text>
                {props.elemento.description}
                </Card.Text>
                <Button variant="primary">Vai ai dettagli</Button>
            </Card.Body>
        </Card>
    )
}

export default CardFilm;