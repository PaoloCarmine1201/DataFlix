import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PieChart } from '@mui/x-charts/PieChart';

function ModalGraficoTorta() {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <Button variant="primary" className='mb-3 me-3' onClick={handleShow}>
            Grafico a barre contenuti per nazione
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Grafico a barre contenuti per nazione</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <PieChart
                series={[
                    {
                    data: [
                        { id: 0, value: 10, label: 'Movie' },
                        { id: 1, value: 15, label: 'TV Show' },
                    ],
                    },
                ]}
                width={400}
                height={200}
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

export default ModalGraficoTorta;