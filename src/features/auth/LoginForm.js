/* eslint-disable import/named */
/* eslint-disable react/react-in-jsx-scope */
import { Button, chakra, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Navigate } from 'react-router-dom';
import { PasswordField } from './PasswordField';
import { loginUser, loginUserUsingProvider, selectAuthSuccess, selectAuthData } from './authSlice';
import { supabase } from '../../supabase';

const LoginForm = (props) => {
  // const emailRef = useRef();
  // const passwordRef = useRef();
  const dispatch = useDispatch();
  const success = useSelector(selectAuthSuccess);
  const authData = useSelector(selectAuthData);
  const toast = useToast();
  if (authData !== null) {
    return <Navigate to={{ pathname: '/dashboard' }} />;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    dispatch(loginUser({ email, password }));
  };

  const providerSignIn = async (provider) => {
    const response = await supabase.auth.signIn({
      provider,
    });
    dispatch(loginUserUsingProvider(response));
  };

  if (success && !isEmpty(authData)) {
    toast({
      title: 'Success',
      description: 'User Logged in.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }

  return (
    <chakra.form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      {...props}
    >
      <Stack spacing="6">
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input name="email" type="email" autoComplete="email" required />
        </FormControl>
        <PasswordField label />
        <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
          Sign in
        </Button>
        <Button type="button" onClick={() => providerSignIn('google')} colorScheme="blue" size="lg" fontSize="md">
          Sign in with google
        </Button>
      </Stack>
    </chakra.form>
  );
};

export default LoginForm;
