/* eslint-disable import/no-absolute-path */
import {
  Center,
  chakra,
  Container,
  Text,
  Button,
  useToast,
  FormLabel,
  Input
} from '@chakra-ui/react';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { PasswordField } from '../auth/PasswordField';
import { updateUserAuth, sendResetPasswordEmail, selectUserSuccess, selectUserIsLoading } from './userSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { search } = useLocation();
  const isRecovery = new URLSearchParams(search).get('type');
  const accessToken = new URLSearchParams(search).get('access_token');
  const success = useSelector(selectUserSuccess);
  const isLoading = useSelector(selectUserIsLoading);

  const handleChangePassword = (e) => {
    e.preventDefault();
    dispatch(updateUserAuth({ accessToken, payload: { password: e.target.password.value } }));
  };
  if (success && !isLoading) {
    toast({
      title: 'Success',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }

  // send reset email
  const handleResetPassword = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    dispatch(sendResetPasswordEmail(email));
  };

  const gotoDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxW='container.lg'>
      <Button
        type="button"
        mt={12}
        leftIcon={<ArrowBackIcon />}
        colorScheme='white'
        textColor='black'
        onClick={() => {
          gotoDashboard();
        }}
      >
        Go Home
      </Button>
      {isRecovery === 'recovery' && (
        <Center h="90vh">
          <Container>
            <Text fontSize="4xl" py={4}>Enter New Password</Text>
            <chakra.form
              onSubmit={(e) => {
                handleChangePassword(e);
              }}
            >
              <PasswordField label={false} />
              <Button type="submit" colorScheme="blue" size="md" fontSize="md" my={4}>
                Save
              </Button>
            </chakra.form>
          </Container>
        </Center>
      )}
      {isEmpty(isRecovery) && (
        <Center h="90vh">
          <Container>
            <Text fontSize="4xl" py={4}>Reset Password</Text>
            <chakra.form
              onSubmit={(e) => {
                handleResetPassword(e);
              }}
            >
              <FormLabel>Email address</FormLabel>
              <Input name="email" type="email" autoComplete="email" required />
              <Button type="submit" colorScheme="blue" size="md" fontSize="md" my={4}>
                Save
              </Button>
            </chakra.form>
          </Container>
        </Center>
      )}
    </Container>
  );
};

export default ResetPassword;
