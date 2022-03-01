/* eslint-disable import/named */
/* eslint-disable react/react-in-jsx-scope */
import { Button, chakra, FormControl, FormLabel, Input, Stack, useToast, Icon, Tooltip } from '@chakra-ui/react';
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
    // const response = await supabase.auth.signIn({
    //   provider,
    // });
    dispatch(loginUserUsingProvider({ provider }));
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
        <Tooltip label="If application crash refresh page">
          <Button type="button" leftIcon={<GoogleIcon />} onClick={() => providerSignIn('google')} colorScheme="black" variant="outline" size="lg" fontSize="md">
            Sign in with Google
          </Button>
        </Tooltip>
        <Button type="button" leftIcon={<MicrosoftIcon />} onClick={() => providerSignIn('azure')} colorScheme="black" variant="outline" size="lg" fontSize="md">
          Sign in with Microsoft
        </Button>
      </Stack>
    </chakra.form>
  );
};

const GoogleIcon = (props) => (
  <Icon viewBox='0 0 48 48' {...props}>
    <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </Icon>
);

const MicrosoftIcon = (props) => (
  <Icon viewBox='0 0 48 48' {...props}>
    <path fill="#ff5722" d="M6 6H22V22H6z" transform="rotate(-180 14 14)" /><path fill="#4caf50" d="M26 6H42V22H26z" transform="rotate(-180 34 14)" /><path fill="#ffc107" d="M26 26H42V42H26z" transform="rotate(-180 34 34)" /><path fill="#03a9f4" d="M6 26H22V42H6z" transform="rotate(-180 14 34)" />
  </Icon>
);

export default LoginForm;
