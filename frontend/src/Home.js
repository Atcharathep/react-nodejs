import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="text-center mt-5">
        <h1>Welcome to Our Website!</h1>
        <p>Your one-stop solution for everything you need.</p>
        <div className="mt-4">
          <Link to="/login" className="btn btn-primary mx-2">Login</Link>
          <Link to="/signup" className="btn btn-secondary mx-2">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
