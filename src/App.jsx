import './App.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import ImageLila from './images/lila.jpg';
import ImageMushka from './images/mushka.jpg';
import ImageEva from './images/eva.jpg';
import ImageNone from './images/no-image.jpg';
import axios from 'axios';

import { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Container, ButtonToolbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
import { DateTimePicker } from 'react-datetime-picker';

function App() {
    const petImages = [ImageLila, ImageMushka, ImageEva];
    const requestStatuses = ['No Action Taken', 'Confirmed', 'New Date Suggested'];
    const [appointmentChangeRequests, setData] = useState([]);

    function setNewAppointmentDate(selectedDate, request) {
        request.newAppointmentDate = selectedDate;
        setData([...appointmentChangeRequests]);
    }

    function getPetDetails(pet) {
        let details = [];

        if (pet) {
            if (pet.firstName) {
                details.push(pet.firstName);
            }
            if (pet.species) {
                details.push(pet.species);
            }
            if (pet.breed) {
                details.push(pet.breed);
            }
        }

        if (details.length) {
            return details.join(', ');
        }

        return '';
    }

    function confirmRequest(requestToUpdate) {
        requestToUpdate.status = requestStatuses[1];
        setData([...appointmentChangeRequests]);
    }

    function updateRequest(requestToUpdate) {
        requestToUpdate.status = requestStatuses[2];
        requestToUpdate.requestedDateTimeOffset = requestToUpdate.newAppointmentDate;
        setData([...appointmentChangeRequests]);
    }

    useEffect(() => {
        axios.get('/api/appointmentchangerequests').then(({ data }) => {
            setData(
                data.map((request, index) => {
                    const image = index <= 2 ? petImages[index] : ImageNone;
                    return { ...request, status: requestStatuses[0], image: image, newAppointmentDate: new Date() };
                })
            );
        });
    }, []);

    return (
        <>
            <Container fluid style={{ padding: '20px' }}>
                <Row style={{ padding: '20px' }}>
                    <h3>PetDesk Appointment Change Requests</h3>
                </Row>
                <Row className="g-4">
                    {appointmentChangeRequests.map((request) => (
                        <Col key={request.appointmentId}>
                            <Card
                                style={{ width: '28rem', alignItems: 'center', paddingTop: '10px', borderWidth: '2px' }}
                                border={request.status == requestStatuses[0] ? 'primary' : 'secondary'}
                                bg={request.status == requestStatuses[0] ? 'info' : 'light'}
                                text={request.status == requestStatuses[0] ? 'white' : 'dark'}
                            >
                                <Card.Img
                                    variant="top"
                                    src={request.image}
                                    style={{
                                        borderRadius: '50%',
                                        width: '160px',
                                        height: '160px',
                                    }}
                                />
                                <Card.Body>
                                    <Card.Title>
                                        {request.user?.firstName} {request.user?.lastName}
                                    </Card.Title>
                                    <Card.Text>
                                        {getPetDetails(request.animal)}
                                        <br></br>
                                        {request.appointmentType}
                                        <br></br>
                                        <span
                                            style={{
                                                fontStyle: request.status == requestStatuses[2] ? 'italic' : 'normal',
                                                fontWeight: 'bold',
                                                color: request.status == requestStatuses[2] ? 'red' : '',
                                            }}
                                        >
                                            {new Date(Date.parse(request.requestedDateTimeOffset)).toLocaleString()}
                                        </span>
                                    </Card.Text>

                                    <ButtonToolbar
                                        style={{
                                            visibility: request.status == requestStatuses[0] ? 'visible' : 'hidden',
                                        }}
                                    >
                                        <Button
                                            variant="success"
                                            onClick={() => confirmRequest(request)}
                                            title="Confirm Request"
                                            style={{
                                                marginRight: '10px',
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCheck} /> Confirm
                                        </Button>
                                        <DateTimePicker
                                            calendarIcon={null}
                                            clearIcon={null}
                                            minDate={new Date()}
                                            value={request.newAppointmentDate}
                                            required={true}
                                            disableClock={true}
                                            onChange={(selectedDate) => setNewAppointmentDate(selectedDate, request)}
                                            className="PetDeskDateTimePicker"
                                        />
                                        <Button
                                            variant="primary"
                                            onClick={() => updateRequest(request)}
                                            title="Update Appointment Date"
                                            style={{
                                                marginLeft: '10px',
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faCloudArrowUp} /> Update
                                        </Button>
                                    </ButtonToolbar>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default App;
