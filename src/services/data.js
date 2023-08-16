import axios from 'axios';

const API_URL = import.meta.env.DEV ? '/api' : 'https://petdeskapi2.azurewebsites.net/api';

export function getAppointmentChangeRequestData() {
    return axios.get(API_URL + '/appointmentchangerequests');
}

export function saveAppointmentChangeRequestData(request) {
    return axios.put(API_URL + '/updateappointmentchangerequest/' + request.appointmentId, {
        status: request.status,
        requestedDateTimeOffset: request.requestedDateTimeOffset,
    });
}
