import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, updateCurrentChat, setUserChats, onlineUsers } = useContext(ChatContext);

    const handleUserClick = async (otherUserId) => {
        try {
            const newChat = await createChat(user._id, otherUserId);
            console.log("New Chat:", newChat);
            if (newChat) {
                updateCurrentChat(newChat);
                setUserChats(prevChats => [...prevChats, newChat]);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    // Filtering to show only online doctors
    const onlineDoctors = potentialChats.filter(doctor =>
        onlineUsers.some(onlineUser => onlineUser.userId === doctor._id)
    );

    return (
        <div className="all-users">
            {onlineDoctors.map(doctor => (
                <div
                    className="single-user"
                    key={doctor._id}
                    onClick={() => handleUserClick(doctor._id)}
                >
                    {doctor.username}
                    <span className="user-online"></span>
                </div>
            ))}
        </div>
    );
};

export default PotentialChats;


