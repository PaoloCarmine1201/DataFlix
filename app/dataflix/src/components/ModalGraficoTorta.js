import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PieChart } from '@mui/x-charts/PieChart';

function ModalGraficoTorta() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        fetchData(); // Fetch data when modal opens
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/group_by_type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const formattedData = result.map((item, index) => ({
                id: index, // Use the actual id
                value: item.count,
                label: item._id, // Use the actual id as label
            }));
            console.log(formattedData); // Log the formatted data to the console
            setData(formattedData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Define a color scheme manually
    const colorScheme = {
        "TV Show": "#ff6384",
        "Movie": "#36a2eb",
    };

    return (
        <>
            <Button variant="primary" className='mb-3 me-3' onClick={handleShow}>
                Grafico torta divisione per film e serie tv
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Grafico torta divisione per film e serie tv</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && <div>Loading...</div>}
                    {error && <div>Error: {error}</div>}
                    {!loading && !error && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <PieChart
                                series={[
                                    {
                                        data: data,
                                    },
                                ]}
                                width={400}
                                height={200}
                                colorScheme={Object.values(colorScheme)} // Apply color scheme
                            />
                        </div>
                    )}
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