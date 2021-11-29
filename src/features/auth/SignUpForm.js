/* eslint-disable import/named */
/* eslint-disable react/react-in-jsx-scope */
import { Button, chakra, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PasswordField } from './PasswordField';
import { signUp, selectAuthSuccess } from './authSlice';

const SignUp = (props) => {
  // const emailRef = useRef();
  // const passwordRef = useRef();
  const dispatch = useDispatch();
  const success = useSelector(selectAuthSuccess);
  const toast = useToast();

  if (success === true) {
    toast({
      title: 'Success',
      description: 'Account created',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    return <Navigate to={{ pathname: '/login' }} />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    dispatch(signUp({ email, password }));
  };
  
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
      <PasswordField />
      <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
        Register
      </Button>
    </Stack>
    </chakra.form>
  );
};

export default SignUp;
