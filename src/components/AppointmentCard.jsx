/* eslint-disable react/prop-types */
import './AppointmentCard.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import { Button, Card, ButtonToolbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { requestStatuses } from './constants';
import { saveAppointmentChangeRequestData } from '../services/data';

export function AppointmentCard({ request, appointmentChangeRequests, setData }) {
    function setNewAppointmentDate(selectedDate, request) {
        request.newAppointmentDate = selectedDate;
        setData([...appointmentChangeRequests]);
    }

    function saveChanges(requestToUpdate) {
        saveAppointmentChangeRequestData(requestToUpdate)
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
        setData([...appointmentChangeRequests]);
    }

    function confirmRequest(requestToUpdate) {
        requestToUpdate.status = requestStatuses[1];
        saveChanges(requestToUpdate);
    }

    function updateRequest(requestToUpdate) {
        if (!isValidRequestDate(requestToUpdate.newAppointmentDate)) {
            alert('Date is required and must be a date and time in the future.');
            return;
        }
        requestToUpdate.status = requestStatuses[2];
        requestToUpdate.requestedDateTimeOffset = requestToUpdate.newAppointmentDate;
        saveChanges(requestToUpdate);
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
                    <Card.Title className="AppointmentCardTitle">
                        {request.user?.firstName} {request.user?.lastName}
                    </Card.Title>
                    <Card.Text className="AppointmentCardText">
                        <span className="AppointmentCardLabel">Pet: </span>
                        <span className="AppointmentCardText" title={request.animal.firstName}>
                            {request.animal.firstName}
                        </span>
                        <br></br>
                        <span className="AppointmentCardLabel">Species: </span>
                        <span className="AppointmentCardText" title={request.animal.species}>
                            {request.animal.species}
                        </span>
                        <br></br>
                        <span className="AppointmentCardLabel">Breed: </span>
                        <span className="AppointmentCardText" title={request.animal.breed}>
                            {request.animal.breed}
                        </span>
                        <br></br>
                        <span className="AppointmentCardLabel">Type: </span>
                        <span className="AppointmentCardText" title={request.appointmentType}>
                            {request.appointmentType}
                        </span>
                        <br></br>
                        <span className="AppointmentCardLabel">Date: </span>
                        <span
                            title={new Date(Date.parse(request.requestedDateTimeOffset)).toLocaleString()}
                            className={
                                'AppointmentCardText' +
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
                                'AppointmentCardConfirm ' +
                                (isValidRequestDate(request.requestedDateTimeOffset)
                                    ? 'AppointmentCardButton'
                                    : 'AppointmentCardHidden')
                            }
                            onClick={() => confirmRequest(request)}
                            title="Confirm Request"
                        >
                            <FontAwesomeIcon icon={faCheck} /> Confirm
                        </Button>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker
                                label="Select New Date"
                                disablePast={true}
                                format="MM/DD/YY h:mm a"
                                onAccept={(value) => setNewAppointmentDate(value, request)}
                            />
                        </LocalizationProvider>

                        <Button
                            className="AppointmentCardUpdate"
                            variant="primary"
                            onClick={() => updateRequest(request)}
                            title="Update Appointment Date"
                        >
                            Update
                        </Button>
                    </ButtonToolbar>
                    <span
                        className={
                            request.status != requestStatuses[0] ? 'AppointmentCardStatus' : 'AppointmentCardHidden'
                        }
                    >
                        <FontAwesomeIcon
                            icon={faCheck}
                            className={request.status == requestStatuses[1] ? '' : 'AppointmentCardHidden'}
                        />{' '}
                        {request.status == requestStatuses[1] ? 'Confirmed' : 'Updated'}
                    </span>
                </Card.Footer>
            </Card>
        </>
    );
}
