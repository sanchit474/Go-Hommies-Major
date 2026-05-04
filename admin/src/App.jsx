import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './Store/AuthSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate auth state from localStorage on page reload
    const token = localStorage.getItem('adminAuthToken');
    const role = localStorage.getItem('adminUserRole');
    if (token && role) {
      dispatch(
        loginSuccess({
          token,
          role,
          email: localStorage.getItem('adminUserEmail') || '',
          name: localStorage.getItem('adminUserName') || '',
        })
      );
    }
  }, [dispatch]);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
