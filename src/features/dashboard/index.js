/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
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
  Text,
  Wrap,
  Spacer 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, AddIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, filter } from 'lodash';
import { logout, selectAuthData } from '../auth/authSlice';
import { fetchUser, selectUserData } from './userSlice';
import { fetchEvents, selectEvents, clearState } from './eventSlice';
import CreateModal from './components/CreateModal';

const Dashboard = () => {
  const authData = useSelector(selectAuthData);
  const user = useSelector(selectUserData);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const events = useSelector(selectEvents);
  const userCreatedEvents = filter(useSelector(selectEvents), event => event.user.email === user.email);
  const gotoChangePassword = () => {
    navigate('/change-password');
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const gotoAttendanceScreen = (eventId) => {
    navigate({
      pathname: '/dashboard/attendance',
      search: `?event_id=${eventId}`,
    });
  };

  useEffect(() => {
    dispatch(clearState());
    dispatch(fetchUser());
    dispatch(fetchEvents());
  }, [authData]);

  return (
    <>
      <Box bg={useColorModeValue('gray.50', 'gray.900')} shadow="md" px={4}>
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
                About
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
                <MenuItem onClick={() => gotoChangePassword()}>Change Password</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
      <Container maxW='container.xl' mt={12}>
        <Box>
          <Heading my={8}>Your events</Heading>
          <Flex pb={4} overflowX="auto">
            <Box
              border="2px"
              borderRadius="md"
              borderColor="gray.400"
              borderStyle="dashed"
              minW="sm"
              cursor="pointer"
              py={12}
              mx={1}
              onClick={onOpen}
            >
              <Center>
                <VStack>
                  <AddIcon color="gray.400" />
                  <Text color="gray.400">Create Event</Text>
                </VStack>
              </Center>
            </Box>
            <CreateModal
              isOpen={isOpen}
              onClose={onClose}
            />
            {!isEmpty(events) && userCreatedEvents.map((event) => (
              <Box
                key={event.id}
                border="2px"
                borderRadius="md"
                borderColor="gray.200"
                borderStyle="solid"
                shadow="md"
                minW="sm"
                cursor="pointer"
                py={12}
                mx={1}
                onClick={() => gotoAttendanceScreen(event.id)}
              >
                <Box mx={4}>
                  <Text fontSize="2xl">{event.title}</Text>
                  <Text color="gray.400">By {event.user.email}</Text>
                </Box>
              </Box>
            ))}

          </Flex>
        </Box>

        <Box>
          <Heading my={4}>Other events</Heading>
          <Wrap>
            {!isEmpty(events) && events.map((event) => (
              <Box
                key={event.id}
                border="2px"
                borderRadius="md"
                borderColor="gray.200"
                borderStyle="solid"
                shadow="md"
                minW="sm"
                cursor="pointer"
                py={12}
                mx={8}
                onClick={() => gotoAttendanceScreen(event.id)}
              >
                <Box mx={4}>
                  <Text fontSize="2xl">{event.title}</Text>
                  <Text color="gray.400">By {event.user.email}</Text>
                </Box>
              </Box>
            ))}
          </Wrap>
        </Box>
        <Flex p={8}>
          <Spacer />
          <Box>
            <IconButton
              icon={<ArrowUpIcon />}
              color="black"
              bgColor="transparent"
              type="button"
              border
              borderWidth="2px"
              borderColor="black"
              borderRadius={100}
              onClick={() => window.scrollTo(0, 0)}
            />
          </Box>
        </Flex>
      </Container>

    </>
  );
};

export default Dashboard;
