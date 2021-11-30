/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  VStack,
  Container,
  Heading,
  Center,
  Text
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuthData } from '../auth/authSlice';

const Dashboard = () => {
  const authData = useSelector(selectAuthData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box>Logo</Box>
            <HStack
              as="nav"
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <Link
                px={2}
                py={1}
                rounded="md"
                _hover={{
                  textDecoration: 'none',
                  bg: useColorModeValue('gray.200', 'gray.700'),
                }}
                href="#"
              >
                Test
              </Link>
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  src="https://cdn-icons.flaticon.com/png/512/3177/premium/3177440.png?token=exp=1638251643~hmac=4048563506299193baa9c0cd4f22058b"
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      {/* <Box p={4}>Main Content Here</Box> */}
      <Container maxW='container.xl' mt={20}>
        <Box>
          <Heading my={8}>Your events</Heading>
          <Flex>
            <Box
              border="2px"
              borderRadius="md"
              borderColor="gray.400"
              borderStyle="dashed"
              minW="sm"
              cursor="pointer"
              py={12}
              mx={2}
            >
              <Center>
                <VStack>
                  <AddIcon color="gray.400" />
                  <Text color="gray.400">Create Event</Text>
                </VStack>
              </Center>
            </Box>

            <Box
              border="2px"
              borderRadius="md"
              borderColor="gray.200"
              borderStyle="solid"
              shadow="md"
              minW="sm"
              cursor="pointer"
              py={12}
              mx={2}
            >
              <Box mx={4} end>
                <Text fontSize="2xl">Les Misérables</Text>
                <Text color="gray.400">By user24601</Text>
              </Box>
            </Box>
          </Flex>
        </Box>

        <Box>
          <Heading my={8}>Other events</Heading>
          <Flex>
            <Box
              border="2px"
              borderRadius="md"
              borderColor="gray.200"
              borderStyle="solid"
              shadow="md"
              minW="sm"
              cursor="pointer"
              py={12}
              mx={2}
            >
              <Box mx={4} end>
                <Text fontSize="2xl">Les Misérables</Text>
                <Text color="gray.400">By user24601</Text>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
