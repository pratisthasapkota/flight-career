import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Call: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
  const from = sessionStorage.getItem('redirectFrom') || '/';
  sessionStorage.removeItem('redirectFrom');
      navigate(from, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  return <h2>Logging in with Google...</h2>;
};

export default Call;
