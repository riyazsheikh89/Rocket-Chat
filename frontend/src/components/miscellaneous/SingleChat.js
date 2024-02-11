import React, { useEffect, useState } from 'react'
import { Box, IconButton, Spinner, Text, FormControl, Input, useToast, Button, Avatar, } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';
import io from "socket.io-client";
import Lottie from "react-lottie";

import { ChatState } from '../../context/ChatProvider'
import { getSender, getSenderDetails } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import './Style.css';
import typing_animation from "../../Animations/typing_indicator_animation2.json";
import { config } from "../../config/config.js"

// const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;


const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // default object for react-lottie animation of typing indicator
    const defaultOptions = {
        loop: true,
        autoPlay: true,
        animationData: typing_animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const toast = useToast();
    const {
      user,
      selectedChat,
      setSelectedChat,
      notification,
      setNotification,
    } = ChatState();


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
        socket = io(config.ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop_typing", () => setIsTyping(false));
    }, [user]);

    useEffect(() => {
        socket.on("message_received", (newMsgRcvd) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMsgRcvd.chat._id) {
                if (!notification.includes(newMsgRcvd)) {
                    setNotification([newMsgRcvd,  ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMsgRcvd]);
            }
        });
    });

    // function to send message
    const sendMessage = async (event) => {
        if (newMessage) {
            socket.emit("stop_typing", selectedChat._id);
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

    // Typing indicator logic
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        
        if (!socketConnected)
            return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTyping = new Date().getTime();
        var timerLength = 3000; // 3000ms -> 3sec
        setTimeout(() => {
            var currentTime = new Date().getTime();
            var timeDiff = currentTime - lastTyping;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop_typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
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
                            <Box>
                                <Avatar 
                                    mt={2} 
                                    mr={3} 
                                    size="sm"
                                    src={getSenderDetails(user, selectedChat.users).image}
                                />
                                {/* User or Group Name */}
                                {getSender(user, selectedChat.users)}
                            </Box>
                            <ProfileModal user={getSenderDetails(user, selectedChat.users)}/>
                        </>
                    ) : (
                        <>
                            <Box>
                                <Avatar 
                                    mr={3} 
                                    mt={2} 
                                    size="sm" 
                                    src="https://shorturl.at/cDFTY"
                                />
                                {selectedChat.chatName}
                            </Box>
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

                <FormControl onKeyDown={(e) => e.key === 'Enter' && sendMessage()} isRequired mt={3}>
                    {isTyping ? (
                        <div>
                            <Lottie
                                options={defaultOptions}
                                width={70}
                                style={{ marginBottom: 15, marginLeft: 0 }}
                            />
                        </div>) : (<></>)
                    }
                    <div style={{display: "flex"}}>
                        <Input
                            variant="filled"
                            bg='#c4c4c0'
                            placeholder='Type message here...'
                            onChange={typingHandler}
                            value={newMessage}
                            borderRadius="30px"
                            mr="1"
                        />
                        <Button colorScheme='messenger' onClick={sendMessage}>
                            <i class="fa-solid fa-arrow-right "></i>
                        </Button>
                    </div>
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
