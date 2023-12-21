/* eslint-disable react/prop-types */
import { Stack } from 'react-bootstrap';
import profilePic from '../../assets/profilePic.svg'
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import moment from 'moment';
import { useFetchRecipientPatient } from './../../hooks/useFetchRecipientPatient';

const UserChatPatient = ({ chat, data }) => {
    const { recipientPatient } = useFetchRecipientPatient(chat, data);
    const { onlineUsers, notifications } = useContext(ChatContext);
    const { latestMessage } = useFetchLatestMessage(chat);
    
    const unreadNotifications = unreadNotificationsFunc(notifications)
    const thisUserNotifications = unreadNotifications?.filter
    recipientPatient?.data?.username

    if (!recipientPatient) {
        return null; 
    }

    if (!recipientPatient?.data) {
        return null;
    }

    const isOnline = onlineUsers?.some((data) => data?.userId === recipientPatient?.data?._id)
    

    const truncateText = (text) => {
        let shortText = text.substring(0, 20)

        if(text.length > 20){
            shortText = shortText + '...'
        }
        return shortText
    }
    
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
            style={{ width: "350px" }}
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={profilePic} height="35px"/>
                </div>
                <div className="text-content">
                <div className="name">{recipientPatient?.data?.username}</div>
                    <div className="text">{
                    latestMessage?.text && (
                        <span>{truncateText(latestMessage?.text)}</span>
                    )}</div>
                </div>
                <div className="d-flex flex-column align-items-end"  style={{width: "130px"}}>
                <div className="date">
                    {latestMessage ? (moment(latestMessage.createdAt).calendar()) : ("No messages")}
                </div>
                    <div className={thisUserNotifications?.length > 0 ? "" : "this-user-notifications" }>
                        {thisUserNotifications?.length > 0 ?  '' : "this-user-notifications"}
                    </div>
                    <span className={isOnline ? "user-online" : "user-offline"}></span>
                </div>
            </div>
        </Stack>
    );
}

export default UserChatPatient;