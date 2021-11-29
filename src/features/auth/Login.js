import { Container } from '@chakra-ui/layout';
import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import LoginForm from './LoginForm';

const Login = () => (
  <Container>
    <Box maxW="md" mx="auto">
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Sign in to your account
      </Heading>
      <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
        <Text as="span">Don&apos;t have an account?</Text>
      </Text>
      <Box
        py="8"
        px={{
          base: '4',
          md: '10',
        }}
        shadow="base"
        rounded={{
          sm: 'lg',
        }}
      >
        <LoginForm />
      </Box>
    </Box>

  </Container>
);

export default Login;