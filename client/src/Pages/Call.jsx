import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Call = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const name = params.get('name');

    if (email) {
      localStorage.setItem('email', email);
    }
    if (name) {
      localStorage.setItem('name', name);
    }

    navigate('/');
  }, [navigate]);

  return <h2>Logging in with Google...</h2>;
};

export default Call;