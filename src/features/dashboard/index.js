import React from 'react';
import { Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuthData } from '../auth/authSlice';

const Dashboard = () => {
  const authData = useSelector(selectAuthData);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
      {authData && <pre>{JSON.stringify(authData, null, 2)}</pre>}
      <Button 
        colorScheme="blue"
        size="lg" 
        fontSize="md"
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
