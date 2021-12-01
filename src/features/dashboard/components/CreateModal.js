import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  chakra,
  Textarea
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/toast';
import { createEvent } from '../eventSlice';
import { selectUserData } from '../userSlice';

const CreateModal = (props) => {
  const { isOpen, onClose } = props;
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector(selectUserData);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Event</ModalHeader>
        <ModalCloseButton />
        <chakra.form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(createEvent({
              userId: user.id,
              title: e.target.eventName.value,
              description: e.target.description.value
            })).then(() => {
              onClose();
              toast({
                title: 'Success',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            })
              .catch((e) => console.error(e));
          }}
        >
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Event Name</FormLabel>
              <Input name="eventName" placeholder='Eg: PostgreSQL 14 Workshop' />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme='blue'>Create</Button>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
