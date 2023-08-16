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
import { Row, Container } from 'react-bootstrap';
import { AppointmentCard } from './components/AppointmentCard';
import { AppointmentRequestsHeader } from './components/AppointmentRequestsHeader.jsx';
import { requestStatuses } from './components/constants';

// future enhancements:
// add toggle button to view requests in table with sorting (more compact view)
// loading progress indicator while getting data
// pretty message when filtering and no results

const API_URL = import.meta.env.DEV ? '/api' : 'https://petdeskapi2.azurewebsites.net/api';

export function App() {
    const petImages = [ImageLila, ImageMushka, ImageEva];
    const [appointmentChangeRequests, setData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(-1);

    function saveChanges(request) {
        axios
            .put(API_URL + '/updateappointmentchangerequest/' + request.appointmentId, {
                status: request.status,
                requestedDateTimeOffset: request.requestedDateTimeOffset,
            })
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    }

    function getFilteredData() {
        if (selectedFilter >= 0) {
            return appointmentChangeRequests.filter((request) => request.status == requestStatuses[selectedFilter]);
        }
        return appointmentChangeRequests;
    }

    useEffect(() => {
        axios
            .get(API_URL + '/appointmentchangerequests')
            .then(({ data }) => {
                setData(
                    data.map((request, index) => {
                        const image = index <= 2 ? petImages[index] : ImageNone;
                        return {
                            ...request,
                            status: request.status || requestStatuses[0],
                            image: image,
                            newAppointmentDate: new Date(),
                        };
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
                    <AppointmentRequestsHeader
                        appointmentChangeRequests={appointmentChangeRequests}
                        setData={setData}
                        selectedFilter={selectedFilter}
                        setSelectedFilter={setSelectedFilter}
                    />
                </Row>
                <Row className="mt-3 d-flex justify-content-center">
                    {getFilteredData().map((request) => (
                        <AppointmentCard
                            key={request.appointmentId}
                            request={request}
                            appointmentChangeRequests={appointmentChangeRequests}
                            setData={setData}
                            saveChanges={saveChanges}
                        />
                    ))}
                </Row>
            </Container>
        </>
    );
}
