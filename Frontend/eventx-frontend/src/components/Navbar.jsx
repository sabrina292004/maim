import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '12px 20px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 20, textDecoration: 'none', color: '#111' }}>EventX</Link>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/events" style={{ textDecoration: 'none', color: '#333' }}>Events</Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#333' }}>Dashboard</Link>
          <Link to="/admin" style={{ textDecoration: 'none', color: '#333' }}>Admin</Link>
          <Link to="/my-tickets" style={{ textDecoration: 'none', color: '#333' }}>My Tickets</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
