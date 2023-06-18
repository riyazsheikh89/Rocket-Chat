// only sends the name of the sender
export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}


// get full details of the sender
export const getSenderDetails = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}