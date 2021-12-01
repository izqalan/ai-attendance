import React from 'react';
import {
  Flex,
  Box,
  Heading,
  Button,
  Center,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  VStack,
  Container
} from '@chakra-ui/react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router';
import { ArrowBackIcon } from '@chakra-ui/icons';

const EventAttendance = (state) => {
  const navigate = useNavigate();
  const videoConstraints = {
    // width: 1280,
    // height: 720,
    facingMode: 'user'
  };

  return (
    <Container maxWidth="container.xl" h="100vh">
      <Button
        colorScheme="white"
        size="md"
        variant="solid"
        textColor="black"
        leftIcon={<ArrowBackIcon />}
        onClick={() => {
          navigate('/dashboard');
        }}
      >
        Go Home
      </Button>
      <Container minWidth="100vh">
        <Center h="90vh">
          <VStack alignContent="start">
            <Box w="full" py={4}>
              <Text fontWeight={100} fontSize="3xl">Event title</Text>
              <Text noOfLines={2}>Description</Text>
            </Box>
            <Flex align="start">
              <Box w="3/4">
                <Webcam
                  audio={false}
                  // width={1280}
                  // height={720}
                  videoConstraints={videoConstraints}
                />
              </Box>
              <Box
                w="1/4"
                border
                borderWidth="2px"
                borderRadius="lg"
                mx={2}
              >
                <Table
                  variant='simple'
                  size="sm"
                >
                  <TableCaption>Attendance</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>ID</Th>
                      <Th>Email</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Epic</Td>
                      <Td>4574456341563</Td>
                      <Td>test@mail.com</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          </VStack>
        </Center>
      </Container>
    </Container>
  );
};

export default EventAttendance;
