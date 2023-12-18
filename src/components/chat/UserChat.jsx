/* eslint-disable react/prop-types */
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"
import { Stack } from 'react-bootstrap';
import profilePic from '../../assets/profilePic.svg'
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import moment from 'moment';

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { onlineUsers, notifications, markThisNotificationsAsRead } = useContext(ChatContext)
    const { latestMessage } = useFetchLatestMessage(chat)
    
    const unreadNotifications = unreadNotificationsFunc(notifications)
    const thisUserNotifications = unreadNotifications?.filter
    recipientUser?.user?.email

    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?.user?._id)
    
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
            style={{width: "350px"}}
            onClick={() => {
                if(thisUserNotifications.length !== 0){
                    markThisNotificationsAsRead(thisUserNotifications, notifications)
                }
            }
            }
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={profilePic} height="35px"/>
                </div>
                <div className="text-content">
                <div className="name">{recipientUser?.user?.email}</div>
                    <div className="text">Text Message</div>
                </div>
                <div className="d-flex flex-column align-items-end"  style={{width: "130px"}}>
                <div className="date">
                    {latestMessage ? (moment(latestMessage.createdAt).calendar()) : ("No messages")}
                </div>
                    <div className={thisUserNotifications?.length > 0 ? "" : "this-user-notifications" }>
                        {thisUserNotifications?.length > 0 ?  '' : "this-user-notifications"}
                    </div>
                    <span className={isOnline? "user-online": ""}></span>
                </div>
            </div>
        </Stack>
    );
}

export default UserChat;
