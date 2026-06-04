import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Call = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const token = params.get('token');

    if (email && token) {
      localStorage.setItem('email', email);
      localStorage.setItem('token', token);
      navigate('/student'); // redirect to protected page
    } else {
      navigate('/'); // redirect to login if missing
    }
  }, [navigate]);

  return <h2>Logging in with Google...</h2>;
};

export default Call;
