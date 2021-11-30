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
  chakra
} from '@chakra-ui/react';

const CreateModal = (props) => {
  const { isOpen, onClose } = props;
  return (
    <chakra.form>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Event Name</FormLabel>
              <Input placeholder='Eg: PostgreSQL 14 Workshop' />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme='blue'>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </chakra.form>
  );
};

export default CreateModal;
