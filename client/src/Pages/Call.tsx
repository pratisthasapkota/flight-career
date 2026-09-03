import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../auth';

const Call: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const from = localStorage.getItem('redirectFrom') || '/';
      localStorage.removeItem('redirectFrom');
      navigate(from, { replace: true });
    };

    const start = async () => {
      const user = await fetchCurrentUser();
      if (cancelled) return;
      if (user) {
        finish();
      } else {
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
