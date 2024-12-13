import React, { useState, useEffect, useContext } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Calendar from "react-calendar";
import { Context } from "../../context/Context";
import dayjs from "dayjs"; // Ensure you have this imported
import "./Calender.css";

const CalendarPage = () => {
  const { events, updateEvents } = useContext(Context);
  const [date, setDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events"));
    if (Array.isArray(savedEvents)) {
      // Convert saved event date strings back into Date objects
      const loadedEvents = savedEvents.map((event) => ({
        ...event,
        date: new Date(event.date), // Ensure the date is a Date object
        startTime: event.startTime ? dayjs(event.startTime) : null,
        endTime: event.endTime ? dayjs(event.endTime) : null,
      }));
      updateEvents(loadedEvents); // Set the events state to loaded events
    } else {
      updateEvents([]);
    }
  }, []);

  // Save events to localStorage whenever the events state changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Handle Calendar Date Change
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // Add Event
  const handleAddEvent = () => {
    if (eventTitle.trim() && eventDetails.trim() && startTime && endTime) {
      const newEvent = {
        date,
        title: eventTitle,
        details: eventDetails,
        startTime,
        endTime,
      };
      updateEvents([...events, newEvent]);
      // Reset form
      setEventTitle("");
      setEventDetails("");
      setStartTime(null);
      setEndTime(null);
    }
  };

  // Delete Event
  const deleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    updateEvents(updatedEvents);
  };

  // Filter events for the selected day
  const filteredEvents = events.filter(
    (event) => event.date.toDateString() === date.toDateString()
  );

  return (
    <div className="calendar-page">
      <h1>Schedule Your Meeting</h1>
      <div className="calendar-container">
        <Calendar onChange={handleDateChange} value={date} className="calendar" />
        <div className="event-input-container">
          <h3>Add New Event</h3>
          <TextField
            label="Event Title"
            variant="outlined"
            fullWidth
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="event-title-input"
          />
          <TextField
            label="Event Details"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={eventDetails}
            onChange={(e) => setEventDetails(e.target.value)}
            className="event-details-input"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="time-picker-container">
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
                renderInput={(props) => <TextField {...props} />}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={setEndTime}
                renderInput={(props) => <TextField {...props} />}
              />
            </div>
          </LocalizationProvider>
          <Button onClick={handleAddEvent} variant="contained" className="add-event-btn">
            Add Event
          </Button>
        </div>
      </div>
      <div className="events-list">
        <h3>Events on {date.toDateString()}</h3>
        {filteredEvents.length > 0 ? (
          <ul>
            {filteredEvents.map((event, index) => (
              <li key={index} className="event-item">
                <span className="event-title">{event.title}</span>
                <span className="event-details">{event.details}</span>
                <span className="event-time">
                  {event.startTime.format("h:mm A")} - {event.endTime.format("h:mm A")}
                </span>
                <button onClick={() => deleteEvent(index)} className="delete-btn">
                  <i className="fa fa-trash"></i> Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events scheduled for this day.</p>
        )}
      </div>
      <Button variant="outlined" className="back-to-home-btn">
        Back to Home
      </Button>
    </div>
  );
};

export default CalendarPage;
