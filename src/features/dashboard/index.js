import React from 'react';
import { Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { logout } from '../auth/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div>
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
