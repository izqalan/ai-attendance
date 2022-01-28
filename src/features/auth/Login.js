import { Container } from '@chakra-ui/layout';
import { Box, Heading, Text, Center, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

const Login = () => (
  <Flex
    minH="100vh"
    align="center"
    justify="center"
    bg={useColorModeValue('gray.50', 'gray.800')}
  >
  <Container>
    <Box maxW="md" mx="auto">
      <Heading textAlign="center" size="xl" fontWeight="extrabold">
        Sign in to your account
      </Heading>
      <Center>
        <Text as="u" mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
          <Link to={{ pathname: '/register' }}>Don&apos;t have an account?</Link>
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
        <LoginForm />
      </Box>
    </Box>
  </Container>
  </Flex>
);

export default Login;
