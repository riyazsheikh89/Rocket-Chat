import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import app_logo from "../../src/app_logo_rectangle.png"
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) { // if there is no userInfo variable inside local storage
          history.push("/chats");
        }
    }, [history]);


  return (
    <Container maxW="550px" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        textAlign="center"
        p={3}
        bg="white"
        w="100%"
        m="30px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text 
          fontSize="4xl" 
          fontFamily="Work Sans" 
          justifyContent="center"
          color="#F5455C"
          fontWeight="bold"
        >
          <Avatar src={app_logo} mr="2" mt="3" size="sm"/>
          Rocket-Chat
        </Text>
      </Box>

      <Box
        d="flex"
        justifyContent="center"
        textAlign="center"
        p={3}
        bg="white"
        w="100%"
        m="0 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
