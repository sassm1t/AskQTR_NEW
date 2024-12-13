import React, { useState, useEffect, useContext } from "react";
import { 
  Button, 
  Typography, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { 
  LocalizationProvider, 
  DateCalendar,
  TimePicker 
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import dayjs from "dayjs";
import { Context } from "../../context/Context";

const CalendarPage = () => {
  const { events, updateEvents } = useContext(Context);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [openAddEventModal, setOpenAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    details: "",
    startTime: null,
    endTime: null
  });

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events"));
    if (Array.isArray(savedEvents)) {
      const loadedEvents = savedEvents.map((event) => ({
        ...event,
        date: dayjs(event.date),
        startTime: event.startTime ? dayjs(event.startTime) : null,
        endTime: event.endTime ? dayjs(event.endTime) : null,
      }));
      updateEvents(loadedEvents);
    } else {
      updateEvents([]);
    }
  }, []);

  // Save events to localStorage whenever the events state changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Add Event
  const handleAddEvent = () => {
    if (
      newEvent.title.trim() && 
      newEvent.details.trim() && 
      newEvent.startTime && 
      newEvent.endTime
    ) {
      const eventToAdd = {
        date: selectedDate,
        ...newEvent
      };
      
      updateEvents([...events, eventToAdd]);
      
      // Reset form and close modal
      setNewEvent({
        title: "",
        details: "",
        startTime: null,
        endTime: null
      });
      setOpenAddEventModal(false);
    }
  };

  // Delete Event
  const deleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    updateEvents(updatedEvents);
  };

  // Filter events for the selected day
  const filteredEvents = events.filter(
    (event) => event.date.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <DateCalendar 
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">
                  Events on {selectedDate.format('dddd, MMMM D, YYYY')}
                </Typography>
              </Grid>
              <Grid item>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => setOpenAddEventModal(true)}
                >
                  Add Event
                </Button>
              </Grid>
            </Grid>

            {filteredEvents.length > 0 ? (
              <List>
                {filteredEvents.map((event, index) => (
                  <ListItem 
                    key={index} 
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        onClick={() => deleteEvent(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.startTime.format('h:mm A')} - ${event.endTime.format('h:mm A')}`}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                      {event.details}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                No events scheduled for this day.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Add Event Modal */}
        <Dialog 
          open={openAddEventModal} 
          onClose={() => setOpenAddEventModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({
                    ...prev, 
                    title: e.target.value
                  }))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Details"
                  multiline
                  rows={3}
                  value={newEvent.details}
                  onChange={(e) => setNewEvent(prev => ({
                    ...prev, 
                    details: e.target.value
                  }))}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="Start Time"
                  value={newEvent.startTime}
                  onChange={(value) => setNewEvent(prev => ({
                    ...prev, 
                    startTime: value
                  }))}
                  renderInput={(props) => <TextField fullWidth {...props} />}
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="End Time"
                  value={newEvent.endTime}
                  onChange={(value) => setNewEvent(prev => ({
                    ...prev, 
                    endTime: value
                  }))}
                  renderInput={(props) => <TextField fullWidth {...props} />}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleAddEvent}
                >
                  Create Event
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </LocalizationProvider>
  );
};

export default CalendarPage;