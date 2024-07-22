import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BarChart } from '@mui/x-charts/BarChart';

function ModalTopActorsDirectors() {
    const [show, setShow] = useState(false);
    const [actorsTitles, setActorsTitles] = useState([]);
    const [actorsCounts, setActorsCounts] = useState([]);
    const [directorsTitles, setDirectorsTitles] = useState([]);
    const [directorsCounts, setDirectorsCounts] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchActorsData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_top10_number_actors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            const movieTitles = result.map(item => truncateString(item.title, 10));
            const actorCounts = result.map(item => item.num_actors);
            setActorsTitles(movieTitles);
            setActorsCounts(actorCounts);
        } catch (error) {
            console.error('Errore durante il fetch:', error);
        }
    };

    const fetchDirectorsData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/get_top10_number_directors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();

            const movieTitles = result.map(item => truncateString(item.title, 10));
            const directorCounts = result.map(item => item.num_directors);
            setDirectorsTitles(movieTitles);
            setDirectorsCounts(directorCounts);
        } catch (error) {
            console.error('Errore durante il fetch:', error);
        }
    };

    const truncateString = (str, num) => {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    };

    useEffect(() => {
        if (show) {
            fetchActorsData();
            fetchDirectorsData();
        }
    }, [show]);

    const generateColors = (length) => {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF3',
            '#F3FF33', '#A133FF', '#FF5733', '#33FF57', '#3357FF'
        ];
        return Array.from({ length }, (_, i) => colors[i % colors.length]);
    };

    return (
        <>
            <Button variant="primary" className='mb-3 me-3' onClick={handleShow}>
                Top 10 Attori e Registi
            </Button>

            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Top 10 Attori e Registi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs defaultActiveKey="actors" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="actors" title="Top 10 Attori">
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: actorsTitles }]}
                                series={[
                                    { data: actorsCounts, color: generateColors(actorsCounts.length) }
                                ]}
                                width={1500}
                                height={500}
                            />
                        </Tab>
                        <Tab eventKey="directors" title="Top 10 Registi">
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: directorsTitles }]}
                                series={[
                                    { data: directorsCounts, color: generateColors(directorsCounts.length) }
                                ]}
                                width={1500}
                                height={500}
                            />
                        </Tab>
                    </Tabs>
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

export default ModalTopActorsDirectors;
