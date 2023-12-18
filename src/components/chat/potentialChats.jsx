import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, updateCurrentChat, onlineUsers } = useContext(ChatContext);

    const handleUserClick = async (userId) => {
        const chat = await createChat(user._id, userId);
        updateCurrentChat(chat);
    };

    return (
        <>
            <div className="all-users">
                {potentialChats && onlineUsers &&
                    potentialChats.filter(u => onlineUsers.some(onlineUser => onlineUser.userId === u._id))
                    .map((u, index) => (
                        <div
                            className="single-user"
                            key={index}
                            onClick={() => handleUserClick(u._id)}
                        >
                            {u.email}
                            {/* You can optionally show an indicator that the user is online */}
                            <span className="user-online"></span>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default PotentialChats;
