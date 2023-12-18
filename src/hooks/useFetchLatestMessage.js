/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from '../utils/services';

export const useFetchLatestMessage = (chat) => {
    const {
        newMessage,
        notifications,
    } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

                console.log("API Response:", response); // Add this line

                if (response.error) {
                    console.error("Error getting messages:", response.error);
                    return;
                }

                const lastMessage = response[response?.length - 1];

                setLatestMessage(lastMessage);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        getMessages();
    }, [chat, newMessage, notifications]);

    return { latestMessage }; // Return latestMessage as an object property
};
