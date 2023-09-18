// only sends the name of the sender
export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}


// get full details of the sender
export const getSenderDetails = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

// this func. checks wheather the multiple message is from the same sender or not,
// it will help us to provide the profile photo of the sender 
export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      ( messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined ) &&
        messages[i].sender._id !== userId
    );
}


// check the last message of the opposite sender
export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
}


// for own messages it would be on right side and for others it would be on left side
export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    ) 
      return 33;

    else if (
      (i < messages.length - 1 && 
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else 
        return "auto";
};


// same user messages margin
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i-1].sender._id === m.sender._id;
}
  