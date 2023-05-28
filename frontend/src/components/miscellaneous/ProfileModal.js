import { ViewIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { IconButton } from "@chakra-ui/button";

import React from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({user, children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}> {children} </span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        ></IconButton>
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            // fontFamily="work sans"
            // fontSize="25px"
            fontSize={{base: "28px", md: "30px"}}
            display="flex"
            justifyContent="center"
          > {user.name}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
                borderRadius="full"
                boxSize="150px"
                src={user.image}
                alt={user.name}
            />
            <Text
                // fontFamily="work sans"
                fontSize={{base: "28px", md: "30px"}}
            >
                Email:{user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}> Close </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
