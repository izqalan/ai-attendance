import React, { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Button,
  Center,
  Text,
  Table,
  Thead,
  Tbody,
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
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectSingleEvent, fetchEventById, captureFace } from '../eventSlice';

const EventAttendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const eventId = new URLSearchParams(search).get('event_id');
  const event = useSelector(selectSingleEvent);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = React.useRef(null);

  const videoConstraints = {
    // width: 1280,
    // height: 720,
    facingMode: 'user'
  };
  useEffect(() => {
    dispatch(fetchEventById({ eventId }));
  }, []);

  const capture = React.useCallback(() => {
    const img = webcamRef.current.getScreenshot();
    setImageSrc(img);
    dispatch(captureFace({ eventId, imageSrc: img }));
  }, [webcamRef, setImageSrc]);

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
              <Text fontWeight={100} fontSize="3xl" fontStyle="">{event.title}</Text>
              <Text noOfLines={2}>{event.description}</Text>
            </Box>
            <Flex align="start">
              <Box w="3/4">
                <Webcam
                  audio={false}
                  // width={1280}
                  // height={720}
                  videoConstraints={videoConstraints}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                />
                <Button onClick={() => { capture(); }} variant='outline' colorScheme="teal" mt={4}>
                  Take Attendance
                </Button>
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
