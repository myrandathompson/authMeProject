// import React from 'react-router-dom';
import Calendar from 'react-calendar';
import { useState, useRef } from 'react';
import './Booking.css';
// import OpenModalButton from '../OpenModalButton'

function Booking() {
  // State variables to manage calendar menus and selected dates
  const [showCalMenuOne, setShowCalMenuOne] = useState(false);
  const [showCalMenuTwo, setShowCalMenuTwo] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Ref to reference the dropdown menu
  const ulRef = useRef();

  // Class name to control the visibility of the calendar dropdown
  const calendarClassName = "calendar-dropdown" + (showCalMenuOne ? "" : "-hidden");

  // Toggle functions to show/hide calendar menus
  const openMenuOne = () => setShowCalMenuOne(!showCalMenuOne);
  const openMenuTwo = () => setShowCalMenuTwo(!showCalMenuTwo);

  return (
    <div id='booking-component-parent-div'>
      <div id='booking-reserve-buttons-parent'>
        <div id='top-row-button-div'>
          {/* Check-In date selection */}
          <button className={calendarClassName} id='start-date-calendar-button' onClick={openMenuOne}>
            <span id='check-in-text-span'>Check-In:</span>
            <p id='check-in-p-tag'>{startDate.toDateString()}</p>
          </button>

          {/* Check-Out date selection */}
          <button className={calendarClassName} id='end-date-calendar-button' onClick={openMenuTwo}>
            <span id='check-out-text-span'>Check-Out:</span>
            <p id='check-out-p-tag'>{endDate.toDateString()}</p>
          </button>
        </div>
        <div id='bottom-row-button-div'>
          {/* Number of guests selection */}
          <label htmlFor='guests' id='guests-input-label'>Guests</label>
          <select id='guests-num-select' name='guests'>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>
        </div>
        <div id='calendar-menu-dropdown-div' ref={ulRef}>
          {/* Calendar dropdown menus */}
          <div id='calendar-menu-dropdown-one'>
            {showCalMenuOne && <Calendar onChange={setStartDate} value={startDate} />}
          </div>
          <div id='calendar-menu-dropdown-two'>
            {showCalMenuTwo && <Calendar onChange={setEndDate} value={endDate} />}
          </div>
        </div>
        <div id='confirm-or-cancel-booking'>
          {/* Booking confirmation and cancellation buttons */}
          <button id='confirm-booking-button'>Confirm Booking</button>
          <button id='cancel-booking-button'>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Booking;