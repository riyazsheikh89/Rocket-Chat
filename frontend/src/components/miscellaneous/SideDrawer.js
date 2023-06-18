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
import ChatLoading from "./ChatLoading";
import UserListItem from "../User/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [lodingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats } = ChatState();
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
      toast({
        title: "Please enter something",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left"
      });
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
        <Tooltip label="Search contacts" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} p="4">
              Search or start a new chat
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="work sans">
          Rocket-Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p="15px">
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
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

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"> Search User </DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} > Go </Button>
            </Box>
            {loading ? (<ChatLoading/>) 
            : (
              searchResult?.map((user) => (
                <UserListItem 
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
              ))
            )}
            {lodingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
