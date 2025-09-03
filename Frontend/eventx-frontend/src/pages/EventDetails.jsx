import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  return (
    <div style={{ padding: 24 }}>
      <h1>Event Details (stub)</h1>
      <p>Details for event ID: {id}</p>
    </div>
  );
};

export default EventDetails;
