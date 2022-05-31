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
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  selectUserProfile,
  fetchUserProfile,
  updateUserName,
  selectUserData,
  selectUserSuccess,
  selectUserIsLoading
} from './userSlice';

const ChangeName = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const success = useSelector(selectUserSuccess);
  const isLoading = useSelector(selectUserIsLoading);
  const user = useSelector(selectUserData);
  const profile = useSelector(selectUserProfile);

  useEffect(() => {
    if (isEmpty(profile)) {
      dispatch(fetchUserProfile(user.id));
    }
  }, []);

  if (success && !isLoading) {
    toast({
      title: 'Success',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }

  const handleChangeName = (e) => {
    e.preventDefault();
    const firstname = e.target.firstname.value;
    const lastname = e.target.lastname.value;

    dispatch(updateUserName({ userId: user.id, payload: { firstname, lastname } }));
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

      <Center h="90vh">
        <Container>
          <Text fontSize="4xl" py={4}>Full name</Text>
          <chakra.form
            onSubmit={(e) => {
              handleChangeName(e);
            }}
          >
            <FormLabel>Firstname</FormLabel>
            <Input name="firstname" placeholder={profile?.firstname} required />
            <FormLabel>Lastname</FormLabel>
            <Input name="lastname" placeholder={profile?.lastname} required />

            <Button type="submit" colorScheme="blue" size="md" fontSize="md" my={4}>
              Save
            </Button>
          </chakra.form>
        </Container>
      </Center>
    </Container>
  );
};

export default ChangeName;
