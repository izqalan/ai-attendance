import { Container } from '@chakra-ui/layout';
import { Box, Heading, Text, Flex, Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';

const SignUp = () => (
  <Flex
    minH="100vh"
    align="center"
    justify="center"
    bg={useColorModeValue('gray.50', 'gray.800')}
  >
    <Container>
      <Box maxW="md" mx="auto">
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          Register
        </Heading>
        <Center>
          <Text as="u" mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
            <Link to={{ pathname: '/login' }}>Already have an account? Sign in.</Link>
          </Text>
        </Center>

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
  </Flex>
);

export default SignUp;
