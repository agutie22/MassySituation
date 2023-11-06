import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import "./index.css"; // Import your CSS file

const MapComponent = ({ events }) => {
  return (
    <div className="map-container">
      <MapContainer
        center={[39.8283, -98.5795]} // Set an initial center (center of the United States)
        zoom={4} // Adjust the zoom level as needed
        style={{ height: "600px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {events.map((event, index) => (
          <Marker position={[event.latitude, event.longitude]} key={index}>
            <Popup>
              Date: {event.date}
              <br />
              Name: {event.name}
              <br />
              Location: {event.location}
              <br />
              County: {event.county}
              <br />
              State: {event.state}
              <br />
              Estimated Number of People: {event.estimatedNumber}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

const EventDetail = ({ event, onBack }) => {
  return (
    <div className="event-detail">
      <button onClick={onBack}>Back to Event List</button>
      <h2>{event.name}</h2>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>County: {event.county}</p>
      <p>State: {event.state}</p>
      <p>Estimated Number of People: {event.estimatedNumber}</p>
      {event.state_code && <p>State Code: {event.state_code}</p>}
      {event.zip_code && <p>Zip Code: {event.zip_code}</p>}
      {event.estimated_count_rscript && <p>Estimated Count (RScript): {event.estimated_count_rscript}</p>}
      {event.count_mobility_data && <p>Count Mobility Data: {event.count_mobility_data}</p>}
    </div>
  );
};

const App = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]); // Add filteredEvents state

  useEffect(() => {
    // Load and parse event data from events.csv
    Papa.parse("events.csv", {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setEvents(results.data);
        setFilteredEvents(results.data); // Initialize filteredEvents with all events
      },
    });
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
  };

  const handleSearch = () => {
    // Filter events based on the search term
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <div className="dashboard">
      <h1>Sports Event Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="content">
        <div className="event-list">
          {filteredEvents.map((event) => (
            <div key={event.date} onClick={() => handleEventClick(event)}>
              {event.name} - {event.date}
            </div>
          ))}
        </div>
        {selectedEvent && (
          <EventDetail event={selectedEvent} onBack={clearSelectedEvent} />
        )}
        <MapComponent events={filteredEvents} />
      </div>
    </div>
  );
};

export default App;
