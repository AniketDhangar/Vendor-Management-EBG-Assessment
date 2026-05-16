import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../redux/slices/authSlice';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, roles }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, accessToken, initialized, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (accessToken && !initialized) {
      dispatch(fetchMe());
    }
  }, [accessToken, initialized, dispatch]);

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!initialized || loading) {
    return <LoadingSpinner label="Checking session..." />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
