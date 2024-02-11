import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import NotificationBadge, { Effect } from 'react-notification-badge';

import ChatLoading from "./ChatLoading";
import UserListItem from "../User/UserListItem";
import { getSender } from "../../config/ChatLogics";
import app_logo from "../../../src/app_logo_rectangle.png"

const SideDrawer = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [lodingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //Logout the user
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  //Search users from DB
  const handleSearch = async() => {
    if (!search) {
      /* toast({
        title: "Please fill the input!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left"
      }); */
      return;
    }

    try {
      setLoading(true);
      const config = {
        "Content-type": "application/json",
        headers: {Authorization: `Bearer ${user.token}`}
      };
      const { data } = await axios.get(`/api/user/find?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left"
      });
    }
  };


  //Access a particular chat
  const accessChat = async(userId) => {
    try {
      setLoadingChat(true);
      const config = {
        "Content-type": "application/json",
        headers: {Authorization: `Bearer ${user.token}`}
      };
      const { data } = await axios.post("/api/chat", {userId}, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setSearch(null);
      setSearchResult(null);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left"
      });
    }
  };

  // Close the SideDrawer
  const closeDrawer = () => {
    setSearchResult(null);
    setSearch(null);
    onClose();
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip hasArrow>
          <Button
            variant="ghost"
            onClick={onOpen}
            boxShadow="outline"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} p="4" color="gray.600">
              Search or start a new chat
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="3xl" fontFamily="work sans" color="#F5455C" fontWeight="bold">
          <Avatar src={app_logo} mr="2" mt="2" size="sm"/>
          Rocket Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p="15px">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages!"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New messages from: ${notif.chat.chatName}`
                    : `New messages from: ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.image}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={closeDrawer} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"> Search Users </DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Enter name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button colorScheme="facebook" onClick={handleSearch}>
                Search
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {/* after clicking on a particular chat */}
            {lodingChat && (
              <Spinner
                ml="24"
                mt="24"
                thickness="3px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
