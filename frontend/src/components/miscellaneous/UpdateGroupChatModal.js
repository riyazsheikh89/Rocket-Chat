import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../User/UserBadgeItem";
import axios from "axios";
import UserListItem from "../User/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  // add new user to the group
  const hadleAddUser = async (newUser) => {
    // if the newUser alredy exists in the group
    if (selectedChat.users.find((usr) => usr._id === newUser._id)) {
      toast({
        title: "User already in group",
        status: "warning",
        duration: "3000",
        isClosable: true,
        position: "top-left"
      });
      return;
    }

    // now check the current user is a Admin or not
    if (selectedChat.admin._id !== user._id) {
      toast({
        title: "Only admins can add new users!",
        status: "warning",
        duration: "3000",
        isClosable: true,
        position: "top"
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.patch("/api/chat/add-user", {
        chatId: selectedChat._id,
        userId: newUser._id
      }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: "3000",
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
    }
  };

  const handleRemove = async (userToBeRemoved) => {
    if (selectedChat.admin._id !== user._id && userToBeRemoved._id !== user._id) {
      toast({
        title: "Only admin can remove someone!",
        status: "warning",
        duration: "3000",
        isClosable: true,
        position: "top-left"
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.patch("/api/chat/remove-user", {
        chatId: selectedChat._id,
        userId: userToBeRemoved._id
      }, config );

      userToBeRemoved._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: "4000",
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
    }
  };

  // Handle the Rename functionality
  const handleRename = async () => {
    if(!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const {data} = await axios.patch("/api/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);

    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: "3000",
        isClosable: true,
        position: 'bottom'
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  // search user to add into the group
  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    setSearch(query);

    try {
      setLoading(true);
      const config = {
        headers: {Authorization: `Bearer ${user.token}`}
      }
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
        position: "bottom"
      });
      return;
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            {/* Update the Group Name */}
            <FormControl display="flex">
              <Input
                placeholder="Rename group"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="orange"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            {/* Add new users to the group */}
            <FormControl>
            <Input
                placeholder="Add new users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (<Spinner size="lg"/>) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => hadleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)} >
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
