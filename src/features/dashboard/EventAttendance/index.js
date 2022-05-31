import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid, GridItem,
  Stack,
  useToast,
  Text,
  useDisclosure,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { isEmpty, slice } from 'lodash';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import AWS from 'aws-sdk';
import moment from 'moment';
import { supabase } from '../../../supabase';
import { clearState, selectCurrentAttendee, selectSingleEvent, selectAttendees, appendAttendees, fetchEventById, captureFace, fetchAttendees, confirmAttendance } from '../eventSlice';
import { draw } from '../../../util/helper';
import config from '../../../util/aws-config';
import BasicModal from '../components/Modal';

const EventAttendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { search } = useLocation();
  const eventId = new URLSearchParams(search).get('event_id');
  const event = useSelector(selectSingleEvent);
  const attendees = useSelector(selectAttendees);
  const currentAttendee = useSelector(selectCurrentAttendee);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isCurrentlyTakingAttendance, setIsCurrentlyTakingAttendance] = useState(false);

  AWS.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
  });

  const lambda = new AWS.Lambda();

  // get media stream settings
  const constraints = {
    audio: false,
    video: {
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    },
    facingMode: 'user'
  };

  const runFacedetection = async () => {
    const model = await blazeface.load();
    setIsModelReady(true);
    setInterval(() => {
      detect(model);
    }, 5000);
  };

  const returnTensors = true;

  const detect = async (model) => {
    if (
      typeof webcamRef.current !== 'undefined'
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      // Get video properties
      const { video } = webcamRef.current;
      const { videoWidth } = webcamRef.current.video;
      const { videoHeight } = webcamRef.current.video;

      // Set video height and width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections

      const prediction = await model.estimateFaces(video, returnTensors);

      const ctx = canvasRef.current.getContext('2d');
      draw(prediction, ctx);

      if (prediction.length > 0 && !isCurrentlyTakingAttendance) {
        capture();
      }
    }
  };

  const mySubscription = async () => {
    supabase
      .from('UsersEvents')
      .on('INSERT', async (data) => {
        const response = await supabase
          .from('UsersEvents')
          .select(`
          *,
          user:userId(*)
        `).eq('id', data.new.id);
        dispatch(appendAttendees(response.data[0]));
        if (response.data[0].user.deviceToken !== null) {
          const message = {
            to: response.data[0].user.deviceToken,
            sound: 'default',
            title: 'Attendance taken!',
            body: `You recently attended ${event.title} at ${moment(event.createdAt).format('Do MMMM YYYY, h:mm:ss a')}`,
          };
          sendPushNotification(message);
        }
      })
      .subscribe();
  };

  const sendPushNotification = async (message) => {
    lambda.invoke({
      FunctionName: 'sendNotification',
      Payload: JSON.stringify(message),
    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    runFacedetection();
    dispatch(clearState());
    dispatch(fetchEventById({ eventId }));
    dispatch(fetchAttendees({ eventId }));
    mySubscription();
  }, []);

  const capture = React.useCallback(() => {
    const img = webcamRef.current.getScreenshot();
    setIsCurrentlyTakingAttendance(true);
    // pause camera
    // webcamRef.current.video.pause();
    // webcamRef.current.video.srcObject.getVideoTracks().forEach(track => track.stop());

    setImageSrc(img);
    dispatch(captureFace({ eventId, imageSrc: img })).then(() => {
      onOpen();
    });
  }, [webcamRef, setImageSrc]);

  const confirmAttendance = async () => {
    const userId = currentAttendee.id;
    supabase
      .from('UsersEvents')
      .insert([{ eventId, userId, isAttended: true }]).then(() => {
        toast({
          title: 'Success',
          description: 'Picture taken',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
        setIsCurrentlyTakingAttendance(false);
        // webcamRef.current.video.play();
      });
  };

  return (
    <Grid
      h='200px'
      templateRows='repeat(2, 1fr)'
      templateColumns='repeat(3, 1fr)'
      gap={2}
      pt={8}
      px={8}
    >
      <BasicModal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        {currentAttendee?.error && currentAttendee?.error.type === 'NOFACE'
          && (
            <>
              <ModalHeader>Error</ModalHeader>
              <ModalBody>
                <Text>The system doesn&#39;t appear to recognize your face.</Text>
                <Text>Please upload you face using the app and try again.</Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant='ghost'
                  mr={3}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        {currentAttendee && !currentAttendee.error && (
          <div>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalBody>

              {currentAttendee?.firstname && (
                <>
                  <Text>Are you {currentAttendee?.firstname} {currentAttendee?.lastname} ?</Text>
                  <Text>{currentAttendee?.id}</Text>
                </>
              )}

              {!currentAttendee?.firstname && currentAttendee.id && (
                <Text>Attendence taken for {currentAttendee?.id}</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant='ghost'
                mr={3}
                onClick={() => {
                  onClose();
                }}
              >
                No, this is not me
              </Button>
              <Button
                colorScheme='green'
                onClick={() => {
                  confirmAttendance();
                }}
              >Yes, that is me!
              </Button>
            </ModalFooter>
          </div>
        )}

      </BasicModal>
      <GridItem rowSpan={1} colSpan={3}>
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
      </GridItem>
      <GridItem rowSpan={1} colSpan={2} bg='gray.900'>
        <Box w="full" py={4} color='white' px={4}>
          <Text fontWeight={100} fontSize="3xl" fontStyle="">{event.title}</Text>
          <Text noOfLines={2}>{event.description}</Text>
        </Box>
        {isModelReady && (
          <Box w="full" px={4}>
            <Webcam
              videoConstraints={constraints}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{
                position: 'absolute',
                display: 'block',
                margin: [0, 'auto'],
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
              }}
            />
          </Box>
        )}

      </GridItem>
      <GridItem rowSpan={1} colSpan={1}>
        <Text mx={2} fontWeight={100} fontSize="3xl" fontStyle="">Attendees</Text>
        <Box
          w="100%"
          mx={2}
          minHeight="90vh"
          maxHeight="90vh"
          overflowY={['auto', 'auto', 'auto']}
        >
          {!isEmpty(attendees) && attendees.map((attendee) => (
            <Stack
              flex={1}
              w=""
              flexDirection="row"
              p={1}
              px={2}
              bg='blue.700'
              my={2}
              textColor="white"
              key={attendee.id}
            >
              <Box alignItems=''>
                <Text fontSize="xs" fontWeight="bold">{moment(attendee.createdAt).format('Do MMMM YYYY, h:mm:ss a')}</Text>
                <Text fontWeight="semibold" isTruncated>
                  {attendee.user.firstname} {attendee.user.lastname}
                </Text>
                <Text isTruncated>
                  {slice(attendee.userId, 0, 8)}
                </Text>
                <Text isTruncated>
                  {attendee.user.email}
                </Text>
              </Box>
            </Stack>
          ))}
        </Box>
      </GridItem>
    </Grid>
  );
};

export default EventAttendance;
