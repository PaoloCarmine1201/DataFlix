import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BarChart } from '@mui/x-charts/BarChart';

function ModalContenutiPerAnno() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [years, setYears] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/group_by_release_year', {
                method: 'POST', // Se il metodo è GET, modifica qui
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const result = await response.json();

            const counts = result.map(item => item.count);
            const releaseYears = result.map(item => item.release_year);
            setData(counts);
            setYears(releaseYears);
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
                Numero contenuti per Anno
            </Button>

            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Numero contenuti per Anno</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modal-body-barGraph'>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: years }]}
                        series={[{ data: data }]}
                        width={1500}
                        height={500}
                        colors={['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF3', '#F3FF33', '#A133FF', '#FF5733']}
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

export default ModalContenutiPerAnno;
