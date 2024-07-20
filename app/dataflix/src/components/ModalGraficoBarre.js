import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BarChart } from '@mui/x-charts/BarChart';

function ModalGraficoBarre() {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <Button variant="primary" className='mb-3 me-3' onClick={handleShow}>
            Grafico divisione tra film e serie tv
        </Button>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Grafico divisione tra film e serie tv</Modal.Title>
            </Modal.Header>
            <Modal.Body>

            <BarChart
                xAxis={[{ scaleType: 'band', data: ['Italy', 'France', 'USA', 'Germany', 'UK'] }]}
                series={[{ data: [20,10,13, 2, 7] }]}
                width={500}
                height={300}
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