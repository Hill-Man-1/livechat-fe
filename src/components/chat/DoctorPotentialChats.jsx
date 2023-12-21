import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const DoctorPotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, updateCurrentChat, setUserChats, onlineUsers } = useContext(ChatContext);

    const handleUserClick = async (patientId) => {
        try {
            const newChat = await createChat(patientId,user._id);
            if (newChat) {
                updateCurrentChat(newChat);
                setUserChats(prevChats => [...prevChats, newChat]);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    // Filtering to show only online patients
    const onlinePatients = potentialChats.filter(patient =>
        onlineUsers.some(onlineUser => onlineUser.userId === patient._id)
    );

    return (
        <div className="all-users">
            {onlinePatients.map(patient => (
                <div
                    className="single-user"
                    key={patient._id}
                    onClick={() => handleUserClick(patient._id)}
                >
                    {patient.username}
                    <span className="user-online"></span>
                </div>
            ))}
        </div>
    );
};

export default DoctorPotentialChats;
