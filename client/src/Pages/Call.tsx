import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuth, clearAuth, fetchCurrentUser } from '../auth';

const Call: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    const name = params.get('name');

    const finish = () => {
      if (cancelled) return;
      const from = localStorage.getItem('redirectFrom') || '/';
      localStorage.removeItem('redirectFrom');
      navigate(from, { replace: true });
    };

    const start = async () => {
      setAuth({ token, email, name });
      const user = await fetchCurrentUser();
      if (cancelled) return;
      if (user) {
        finish();
      } else {
        clearAuth();
        navigate('/', { replace: true });
      }
    };

    start();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return <h2>Logging in with Google...</h2>;
};

export default Call;
