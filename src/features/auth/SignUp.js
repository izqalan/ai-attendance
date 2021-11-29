import { Container } from '@chakra-ui/layout';
import { Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import SignUpForm from './SignUpForm';

const SignUp = () => (
  <Container>
    <Box maxW="md" mx="auto">
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Register
      </Heading>
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
        <SignUpForm />
      </Box>
    </Box>

  </Container>
);

export default SignUp;
