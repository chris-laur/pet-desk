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
import { Button, Row, Container, Dropdown, ButtonGroup } from 'react-bootstrap';
import { AppointmentCard } from './components/AppointmentCard';
import { requestStatuses } from './components/constants';
// future enhancement:
// add toggle button to view requests in table with sorting (more compact view)

// export const Context = createContext({
//     appointmentChangeRequests: [],
//     setData: () => {},
// });

export function App() {
    const petImages = [ImageLila, ImageMushka, ImageEva];

    const sortOptions = [
        'Date Ascending',
        'Date Descending',
        'Appointment Type Ascending',
        'Appointment Type Descending',
    ];
    const [appointmentChangeRequests, setData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(-1);

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
        axios
            .get('https://petdeskapi2.azurewebsites.net/api/appointmentchangerequests')
            .then(({ data }) => {
                setData(
                    data.map((request, index) => {
                        const image = index <= 2 ? petImages[index] : ImageNone;
                        return { ...request, status: requestStatuses[0], image: image, newAppointmentDate: new Date() };
                    })
                );
            })
            .catch(function (error) {
                console.log(error);
                alert('There was an error loading the data.');
            });
    }, []);

    return (
        <>
            <Container fluid className="App">
                <Row className="mt-3 d-flex justify-content-center">
                    <h3>PetDesk Appointment Change Requests</h3>
                </Row>
                <Row className="mt-3 d-flex justify-content-center">
                    <Dropdown className="AppointmentRequestsSort" onSelect={(eventKey) => sortChange(eventKey)}>
                        <Dropdown.Toggle variant="primary">Sort By</Dropdown.Toggle>

                        <Dropdown.Menu>
                            {sortOptions.map((sort, index) => (
                                <Dropdown.Item key={index} eventKey={index}>
                                    {sort}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <ButtonGroup className="AppointmentRequestsFilter">
                        <Button variant="primary" active={selectedFilter == -1} onClick={() => filterChange(-1)}>
                            All
                        </Button>
                        {requestStatuses.map((status, index) => (
                            <Button variant="primary" key={index} onClick={() => filterChange(index)}>
                                {status}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Row>
                <Row className="mt-3 d-flex justify-content-center">
                    {/* <Context.Provider value={{ appointmentChangeRequests, setData, requestStatuses }}> */}
                    {getFilteredData().map((request) => (
                        <AppointmentCard
                            key={request.appointmentId}
                            request={request}
                            appointmentChangeRequests={appointmentChangeRequests}
                            setData={setData}
                        />
                    ))}
                    {/* </Context.Provider> */}
                </Row>
            </Container>
        </>
    );
}
