import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderDetails } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
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
                        {/* {<UpdateGroupChatModal
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain}
                        />} */}
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
                {/* {Message here...} */}
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
