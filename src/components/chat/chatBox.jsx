import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from './../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';
import moment from 'moment';
import InputEmoji from 'react-input-emoji'

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, clearCurrentChat, messages, isMessagesLoading } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const {textMessage, setTextMessage} = useState("")

    console.log(textMessage)

    if (!recipientUser)
        return (
            <p className="text-light" style={{textAlign: "center", width: "100%", cursor:"pointer"}}
                onClick={clearCurrentChat}>
                No Conversation Selected Yet ....
            </p>
        );

    if (isMessagesLoading)
        return (
            <h1 className="text-danger" style={{ textAlign: "center", width:"100%"}}>Loading Chat ....</h1>
        )
    return (
    <Stack gap={4} className="chat-box text-light">
        <div className="chat-header">
            <strong>{recipientUser?.user?.email}</strong>
        </div>
        <Stack gap={3} className="messages">
            {messages && 
                messages.map((message,index)=> (
                    <Stack key={index} className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                        <span>{message.text}</span>
                        <span className="message-footer">
                            {moment(message.cratedAt).calendar()}
                        </span>
                    </Stack>)
                )}
        </Stack>
        <Stack direction="horizontal" gap={3} className="chat-input-emoji flex-grow-0">
                    <InputEmoji value={textMessage} onChange={setTextMessage} fontFamily="Playfair+Display" borderColor="rgba(72,112,225,0.2)"/>
        </Stack>
    </Stack>
    );
}

export default ChatBox;
