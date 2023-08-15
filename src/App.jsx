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
import { Button, Card, Row, Col, Container, ButtonToolbar, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { DateTimePicker } from 'react-datetime-picker';

function App() {
    const petImages = [ImageLila, ImageMushka, ImageEva];
    const requestStatuses = ['No Action Taken', 'Confirmed', 'New Date Suggested'];
    const sortOptions = [
        'Date Ascending',
        'Date Descending',
        'Appointment Type Ascending',
        'Appointment Type Descending',
    ];
    const [appointmentChangeRequests, setData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(-1);

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
        if (!requestToUpdate.newAppointmentDate) {
            alert('Date is required.');
            return;
        }
        requestToUpdate.status = requestStatuses[2];
        requestToUpdate.requestedDateTimeOffset = requestToUpdate.newAppointmentDate;
        setData([...appointmentChangeRequests]);
    }

    function isValidRequestDate(request) {
        return new Date(request.requestedDateTimeOffset) >= new Date();
    }

    function filterChange(newFilter) {
        setSelectedFilter(newFilter);
        setData([...appointmentChangeRequests]);
    }

    function getFilteredData() {
        if (selectedFilter >= 0) {
            return appointmentChangeRequests.filter((request) => request.status == requestStatuses[selectedFilter]);
        }
        return appointmentChangeRequests;
    }

    function sortChange(eventKey) {
        if (eventKey == 0) {
            setData(
                [...appointmentChangeRequests].sort(
                    (obj1, obj2) => new Date(obj1.requestedDateTimeOffset) - new Date(obj2.requestedDateTimeOffset)
                )
            );
        }
        if (eventKey == 1) {
            setData(
                [...appointmentChangeRequests].sort(
                    (obj1, obj2) => new Date(obj2.requestedDateTimeOffset) - new Date(obj1.requestedDateTimeOffset)
                )
            );
        }
        if (eventKey == 2) {
            setData(
                [...appointmentChangeRequests].sort((obj1, obj2) =>
                    obj1.appointmentType > obj2.appointmentType ? 1 : -1
                )
            );
        }
        if (eventKey == 3) {
            setData(
                [...appointmentChangeRequests].sort((obj1, obj2) =>
                    obj1.appointmentType > obj2.appointmentType ? -1 : 1
                )
            );
        }
    }

    useEffect(() => {
        axios.get('https://petdeskapi2.azurewebsites.net/api/appointmentchangerequests').then(({ data }) => {
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
                <h3 style={{ paddingTop: '20px', paddingBottom: '20px' }}>PetDesk Appointment Change Requests</h3>

                <Dropdown
                    onSelect={(eventKey) => sortChange(eventKey)}
                    style={{ display: 'inline', marginRight: '20px' }}
                >
                    <Dropdown.Toggle style={{ borderColor: '#0BC98C', backgroundColor: '#0BC98C' }}>
                        Sort By
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {sortOptions.map((sort, index) => (
                            <Dropdown.Item key={index} eventKey={index}>
                                {sort}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <ButtonGroup>
                    <Button active={true} onClick={() => filterChange(-1)}>
                        All
                    </Button>
                    {requestStatuses.map((status, index) => (
                        <Button key={index} onClick={() => filterChange(index)}>
                            {status}
                        </Button>
                    ))}
                </ButtonGroup>

                <Row className="g-4 mt-3">
                    {getFilteredData().map((request) => (
                        <Col key={request.appointmentId}>
                            <Card
                                style={{
                                    width: '26rem',
                                    height: '24rem',
                                    alignItems: 'center',
                                    paddingTop: '10px',
                                    borderWidth: '2px',
                                    backgroundColor: request.status == requestStatuses[0] ? '#F2E4FF' : '#D6EEF5',
                                    borderColor: request.status == requestStatuses[0] ? '#BA77FF' : '#08A9C6',
                                }}
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
                                                fontStyle:
                                                    request.status == requestStatuses[2] || !isValidRequestDate(request)
                                                        ? 'italic'
                                                        : 'normal',
                                                fontWeight: 'bold',
                                                color:
                                                    request.status == requestStatuses[2]
                                                        ? '#BA77FF'
                                                        : !isValidRequestDate(request)
                                                        ? '#F9629C'
                                                        : '',
                                            }}
                                        >
                                            {new Date(Date.parse(request.requestedDateTimeOffset)).toLocaleString()}
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="AppointmentCardFooter">
                                    <ButtonToolbar
                                        style={{
                                            visibility: request.status == requestStatuses[0] ? 'visible' : 'hidden',
                                            flexWrap: 'nowrap',
                                        }}
                                    >
                                        <Button
                                            onClick={() => confirmRequest(request)}
                                            title="Confirm Request"
                                            style={{
                                                marginRight: '10px',
                                                backgroundColor: '#BA77FF',
                                                borderColor: '#BA77FF',
                                                display: isValidRequestDate(request) ? 'block' : 'none',
                                                whiteSpace: 'nowrap',
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
                                            className="AppointmentCardDateTimePicker"
                                        />
                                        <Button
                                            onClick={() => updateRequest(request)}
                                            title="Update Appointment Date"
                                            style={{
                                                marginLeft: '10px',
                                                backgroundColor: '#08A9C6',
                                                borderColor: '#08A9C6',
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </ButtonToolbar>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default App;
