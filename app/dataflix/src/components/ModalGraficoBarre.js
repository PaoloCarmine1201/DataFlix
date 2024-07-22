import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BarChart } from '@mui/x-charts/BarChart';
import './styles/ModalGraficoBarre.css';

function ModalGraficoBarre() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [countries, setCountries] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/group_by_country', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const result = await response.json();
            const counts = result.map(item => item.count);
            const countryNames = result.map(item => item.country_name);
            setData(counts);
            setCountries(countryNames);
        } catch (error) {
            console.error('Errore durante il fetch:', error);
        }
    };

    useEffect(() => {
        if (show) {
            fetchData();
        }
    }, [show]);

    return (
        <>
            <Button variant="primary" className='mb-3 me-3' onClick={handleShow}>
                Contenuti per nazione
            </Button>

            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Contenuti per nazione</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body-barGraph'>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: countries }]}
                        series={[{ data: data }]}
                        width={1500}
                        height={500}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalGraficoBarre;
