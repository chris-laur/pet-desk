/* eslint-disable react/prop-types */
import './AppointmentRequestsHeader.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import { useState } from 'react';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { requestStatuses, sortOptions } from './constants';

export function AppointmentRequestsHeader({ appointmentChangeRequests, setData, selectedFilter, setSelectedFilter }) {
    const [sortedBy, setSortedBy] = useState(sortOptions[0]);

    function filterChange(newFilter) {
        setSelectedFilter(newFilter);
        setData([...appointmentChangeRequests]);
    }

    function sortChange(eventKey) {
        setSortedBy(sortOptions[eventKey]);

        // appointment date asc
        if (eventKey == 0) {
            setData(
                [...appointmentChangeRequests].sort(
                    (obj1, obj2) => new Date(obj1.requestedDateTimeOffset) - new Date(obj2.requestedDateTimeOffset)
                )
            );
        }
        // appointment date desc
        if (eventKey == 1) {
            setData(
                [...appointmentChangeRequests].sort(
                    (obj1, obj2) => new Date(obj2.requestedDateTimeOffset) - new Date(obj1.requestedDateTimeOffset)
                )
            );
        }
        // appointment type asc
        if (eventKey == 2) {
            setData(
                [...appointmentChangeRequests].sort((obj1, obj2) =>
                    obj1.appointmentType > obj2.appointmentType ? 1 : -1
                )
            );
        }
        // appointment type desc
        if (eventKey == 3) {
            setData(
                [...appointmentChangeRequests].sort((obj1, obj2) =>
                    obj1.appointmentType > obj2.appointmentType ? -1 : 1
                )
            );
        }
    }

    return (
        <>
            <Dropdown className="AppointmentRequestsSort" onSelect={(eventKey) => sortChange(eventKey)}>
                <Dropdown.Toggle variant="primary">Sorted By {sortedBy}</Dropdown.Toggle>

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
        </>
    );
}
