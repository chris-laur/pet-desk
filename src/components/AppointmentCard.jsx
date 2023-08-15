/* eslint-disable react/prop-types */
import './AppointmentCard.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import { useContext } from 'react';
import { Button, Card, ButtonToolbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { DateTimePicker } from 'react-datetime-picker';
import { Context } from '../App';

export function AppointmentCard({ request }) {
    const { appointmentChangeRequests, setData, requestStatuses } = useContext(Context);

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
        if (!isValidRequestDate(requestToUpdate.newAppointmentDate)) {
            alert('Date is required and must be a date and time in the future.');
            return;
        }
        requestToUpdate.status = requestStatuses[2];
        requestToUpdate.requestedDateTimeOffset = requestToUpdate.newAppointmentDate;
        setData([...appointmentChangeRequests]);
    }

    function isValidRequestDate(requestDate) {
        return new Date(requestDate) >= new Date();
    }

    return (
        <>
            <Card
                className={
                    'AppointmentCard' +
                    (request.status == requestStatuses[0] ? ' AppointmentCardDefault' : ' AppointmentCardActionTaken')
                }
            >
                <Card.Img className="AppointmentCardImage" variant="top" src={request.image} />
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
                            className={
                                'AppointmentCardRequestDate' +
                                (!isValidRequestDate(request.requestedDateTimeOffset) ? ' AppointmentCardInvalid' : '')
                            }
                        >
                            {new Date(Date.parse(request.requestedDateTimeOffset)).toLocaleString()}
                        </span>
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="AppointmentCardFooter">
                    <ButtonToolbar className={request.status == requestStatuses[0] ? '' : 'AppointmentCardHidden'}>
                        <Button
                            variant="primary"
                            className={
                                isValidRequestDate(request.requestedDateTimeOffset)
                                    ? 'AppointmentCardButton'
                                    : 'AppointmentCardHidden'
                            }
                            onClick={() => confirmRequest(request)}
                            title="Confirm Request"
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
                            variant="primary"
                            onClick={() => updateRequest(request)}
                            title="Update Appointment Date"
                        >
                            Update
                        </Button>
                    </ButtonToolbar>
                </Card.Footer>
            </Card>
        </>
    );
}
