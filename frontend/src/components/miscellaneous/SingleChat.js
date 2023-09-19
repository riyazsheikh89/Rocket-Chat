import React, { useEffect, useState } from 'react'
import { Box, IconButton, Spinner, Text, FormControl, Input, useToast, } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';
import io from "socket.io-client";

import { ChatState } from '../../context/ChatProvider'
import { getSender, getSenderDetails } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import './Style.css';
import ScrollableChat from './ScrollableChat';

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;


const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [socketConnected,setSocketConnected] = useState(false);

    const toast = useToast();
    const { user, selectedChat, setSelectedChat } = ChatState();


    // fetch all the messages for the selected chat
    const fetchMessages = async () => {
        if (!selectedChat)  // if no cahat is selected, no need to fetch messages
            return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            setLoading(true);
            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
            console.log(messages);
            setMessages(data);
            setLoading(false);

            // create a room using the chatID
            socket.emit("join_chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error occured",
                description: "Failed fetch the messages",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // socket.io setup from frontend
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => setSocketConnected(true));
    }, []);

    useEffect(() => {
        socket.on("message_received", (newMsgRcvd) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMsgRcvd.chat._id) {
                // give notification
            } else {
                setMessages([...messages, newMsgRcvd]);
            }
        });
    });

    // function to send message
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.post("/api/message", {
                    chatId: selectedChat._id,
                    content: newMessage
                }, config);

                socket.emit("new_message", data);
                setNewMessage("");
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error occured",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom'
                });
            }
        }
    } 

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // Future work: typing indicator
    }

  return (
    <>
        {selectedChat ? (
            <>
                <Text
                    fontFamily="work sans"
                    fontSize={{base: "28px", md: "30px"}}
                    pb={3}
                    px={2}
                    w="100%"
                    display="flex"
                    justifyContent={{base: "space-between"}}
                    alignItems="center"
                >
                    <IconButton
                        display={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon/>}
                        onClick={() => setSelectedChat("")}
                    />

                    { !selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderDetails(user, selectedChat.users)}/>
                        </>
                    ) : (
                        <>
                        {selectedChat.chatName}
                        {<UpdateGroupChatModal
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain}
                            fetchMessages={fetchMessages}
                        />}
                        </>
                    )}
                </Text>
                <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
                >

                {/* if the messages are loading then show a spinner otherwise show the messages */}
                {loading ? 
                (<Spinner
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                />
                ) : (
                    <div className='messages'>
                        <ScrollableChat messages={messages} />
                    </div> 
                )}

                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    <Input
                        variant="filled"
                        bg='#c4c4c0'
                        placeholder='Type message here...'
                        onChange={typingHandler}
                        value={newMessage}
                        borderRadius="30px"  
                    />
                </FormControl>

                </Box>
            </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3} fontFamily="work sans" >
                    Click on a user to start a conversation
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat
