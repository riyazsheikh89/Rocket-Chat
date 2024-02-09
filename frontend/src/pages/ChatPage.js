import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import { useState } from "react";


const ChatPage = () => {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: "100%"}}>
    {user && <SideDrawer/>}

    <Box display="flex" justifyContent="space-between" w="100%" h="87.45vh" p="10px" >
      {user && <MyChats fetchAgain={fetchAgain}/>}
      {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
    </Box>
      
    </div>
  );
};

export default ChatPage;
