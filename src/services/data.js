import axios from 'axios';

// TODO: Update code to address Axios vulnerabilities

const API_URL = import.meta.env.DEV ? '/api' : 'https://petdeskapi2.azurewebsites.net/api';

export function getAppointmentChangeRequestData() {
    return null;
    //return axios.get(API_URL + '/appointmentchangerequests');
}

export function saveAppointmentChangeRequestData(request) {
    return null;
    //return axios.put(API_URL + '/updateappointmentchangerequest/' + request.appointmentId, {
        //status: request.status,
        //requestedDateTimeOffset: request.requestedDateTimeOffset,
    //});
}
