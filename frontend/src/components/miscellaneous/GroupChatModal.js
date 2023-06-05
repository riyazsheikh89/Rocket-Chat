import {
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Spinner, 
  Box
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import UserBadgeItem from "../User/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  // Search for the users to whom U want to add into the group
  const handleSearch = async(query)=> {
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
  }

  // Handles the list of selected users
  const handleGroup = (userToAdd) => {
    // if the user already selected
    if (selectedUsers.includes(userToAdd)){
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  // Delete the selected user
  const handleDelete = (userToDel)=> {
    setSelectedUsers(
      selectedUsers.filter((usr) => usr._id !== userToDel._id)
    );
  }

  // Creates a new Group Chat
  const handleSubmit = async()=> {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the details",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    try {
      const config = {
        headers: {Authorization: `Bearer ${user.token}`}
      }
      const { data } = await axios.post("/api/chat/group", {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u)=> u._id))
      }, config);
      // put 'data' first inside setChats, its puts the new chat at top
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Created new group chat",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
    } catch (error) {
      toast({
        title: "Failed to create the group chat",
        description: error.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom"
      });
    }
  }



  return (
    <>
      <span onClick={onOpen}> {children} </span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Group Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search users to add"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
              <Box w="100%" display="flex" flexWrap="wrap" >
              {
                selectedUsers.map((u) => (
                  <UserBadgeItem 
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                   />
                ))
              }
              </Box>

              {loading ? (<Spinner color='red.500'/>) 
              : (
                searchResult?.slice(0,4).map((user) => (
                  <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
              )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="whatsapp"
              color="black"
              fontFamily="work sans"
              borderRadius="20px"
              onClick={handleSubmit}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
