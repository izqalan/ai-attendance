/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, Suspense } from 'react';
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
  Wrap
} from '@chakra-ui/react';
import { useNavigate, Routes as Switch, Route, Navigate, useLocation } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, filter } from 'lodash';
import { logout, selectAuthData } from '../auth/authSlice';
import { fetchUser, selectUserData } from './userSlice';
import { fetchEvents, selectEvents } from './eventSlice';
import CreateModal from './components/CreateModal';
import { Routes } from '../../routes/index';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const authData = useSelector(selectAuthData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const gotoChangePassword = () => {
    navigate('/change-password');
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  
  const renderRoutes = [
    <Suspense fallback={<div>Loading component...</div>}>
      <Switch key={`switch-${Routes[0].name}`}>
        {Routes.map((item) => (
          <Route
            key={`route-${item.name}`}
            path={`/dashboard${item.url}`}
            component={item.component}
            exact
          />
        ))}
        {/* <Route path="/" element={<Navigate replace to="/dashboard/main" />} /> */}

      </Switch>
    </Suspense>,
  ];
  const RoutesIndex = Routes.findIndex(
    (x) => `/dashboard${x.url}` === location.pathname,
  );
  const pageName = RoutesIndex < 0 ? '' : Routes[RoutesIndex].name;

  useEffect(() => {
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
      <div>
        bruh
        <Text>{pageName}</Text>
        {renderRoutes}
      </div>
    </>
  );
};

export default Dashboard;
