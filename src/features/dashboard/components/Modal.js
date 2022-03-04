/* eslint-disable no-console */
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';

const BasicModal = (props) => {
  const { isOpen, onClose, children, closeOnOverlayClick } = props;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
      <ModalOverlay />
      <ModalContent>
        {children}
      </ModalContent>
    </Modal>
  );
};

export default BasicModal;
