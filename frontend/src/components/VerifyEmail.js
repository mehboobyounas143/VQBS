import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/students/verify/${token}`);
        setMessage(res.data);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setMessage('Verification failed or expired.');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="p-4 text-center">
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
