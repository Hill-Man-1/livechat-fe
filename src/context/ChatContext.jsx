/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";
import debounce from 'lodash/debounce';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState([]);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    console.log('notifications: ', notifications);

    useEffect(() => {
        const newSocket = io(baseUrl);
        setSocket(newSocket);
    
        newSocket.on('getOnlineUsers', (users) => {
            setOnlineUsers(users.map(user => user.userId));
        });

        newSocket.on('getMessage', (newMessage) => {
            if (currentChat && newMessage.chatId === currentChat._id) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
        });

        newSocket.on('userDisconnected', (userId) => {
            setOnlineUsers(prevOnlineUsers => 
                prevOnlineUsers.filter(user => user.userId !== userId)
            );
        });

        // Listen for notifications
        newSocket.on('getNotification', (notification) => {
            console.log('Received notification:', notification);
            setNotifications(prevNotifications => [notification, ...prevNotifications]);
        });

        return () => {
            newSocket.off('getOnlineUsers');
            newSocket.off('userDisconnected');
            newSocket.off('getMessage');
            newSocket.off('getNotification');
            newSocket.disconnect();
        };
    }, [currentChat]);

    useEffect(() => {
        if (!socket) return;

        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("addNewUser");
            socket.off("getOnlineUsers");
        };
    }, [socket, user?._id]);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsUserChatsLoading(true);
            try {
                const data = await getRequest(`${baseUrl}/users/all`);
                if (data.error) {
                    setUserChatsError(data.error);
                    return;
                }
    
                const filteredChats = data.users.filter(u => u._id !== user?._id && !userChats.some(chat => chat.members.includes(u._id)));
                setPotentialChats(filteredChats);
                setAllUsers(data.users); // Use `data.users` here
            } catch (error) {
                console.error("Error in fetchUsers:", error);
                setUserChatsError(error);
            } finally {
                setIsUserChatsLoading(false);
            }
        };
    
        if (user?._id) {
            fetchUsers();
        }
    }, [userChats, user?._id]);

    useEffect(() => {
        const getMessages = async () => {
            if (currentChat?._id) {
                setIsMessagesLoading(true);
                try {
                    const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
                    if (response.error) {
                        setMessagesError(response.error);
                    } else {
                        setMessages(response);
                    }
                } catch (error) {
                    setMessagesError(error);
                } finally {
                    setIsMessagesLoading(false);
                }
            }
        };

        getMessages();
    }, [currentChat?._id]);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const sendTextMessage = useCallback(async (textMessage, currentChatId) => {
        if (!user || !textMessage || !currentChatId) {
            console.error('No user, message, or chatId provided');
            return;
        }

        const messageData = {
            chatId: currentChatId,
            senderId: user._id,
            text: textMessage,
        };

        try {
            const response = await postRequest(`${baseUrl}/messages`, messageData);
            if (!response.error) {
                // Check if the message is not already in the state
                if (!messages.some(msg => msg._id === response._id)) {
                    setMessages(prevMessages => [...prevMessages, response]);
                }
            }
        } catch (error) {
            console.error('Failed to send the message:', error);
        }
    }, [user, messages, currentChat]);

    const createChat = useCallback(async (firstId, secondId) => {
        try {
            const response = await postRequest(`${baseUrl}/chats`, { firstId, secondId });
            if (response.error) {
                console.error("Error Creating Chat", response);
            } else {
                setUserChats(prev => [...prev, response]);
            }
        } catch (error) {
            console.error("Error Creating Chat", error);
        }
    }, []);

    useEffect(() => {
        const fetchUserChats = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true);
                try {
                    const response = await getRequest(`${baseUrl}/chats/${user._id}`);
                    if (response.error) {
                        setUserChatsError(response.error);
                    } else {
                        setUserChats(response);
                    }
                } catch (error) {
                    setUserChatsError(error);
                } finally {
                    setIsUserChatsLoading(false);
                }
            }
        };

        fetchUserChats();
    }, [user?._id]);

    const markAllNotificationsAsRead = useCallback((notifications)=>{
        const mNotifications = notifications.map((n)=> {
            return {...n, isRead: true}
        });
        
        setNotifications(mNotifications);
    },[])

    const markNotificationsAsRead = useCallback((n, userChats, user, notifications)=>{
        // find chat to open

        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId]
            const isDesireChat = chat?.members.every((member) => {
                return chatMembers.includes(member)
            })

            return isDesireChat
        })
        // mark notifications as read
        const mNotifications = notifications.map(el =>{
            if(n.senderId === el.senderId){
                return {...n, isRead: true}
            } else {
                return el
            }
        })

        updateCurrentChat(desiredChat);
        setNotifications(mNotifications);
    },[])

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
        // mark notification as read
        
        const mNotifications = notifications.map(el =>{
            let notification;
            
            thisUserNotifications.forEach(n => {
                if(n.senderId === el.senderId){
                    notification = {...n, isRead: true}
                } else {
                    notification = el
                }
            })
            return notification
        })
        setNotifications(mNotifications)
    },[])

    return (
        <ChatContext.Provider value={{
            userChats,
            setUserChats,
            isUserChatsLoading,
            setIsUserChatsLoading,
            userChatsError,
            setUserChatsError,
            potentialChats,
            setPotentialChats,
            currentChat,
            setCurrentChat,
            messages,
            setMessages,
            isMessagesLoading,
            setIsMessagesLoading,
            messagesError,
            setMessagesError,
            sendTextMessageError,
            setSendTextMessageError,
            sendTextMessage,
            onlineUsers,
            setOnlineUsers,
            updateCurrentChat,
            createChat,
            notifications,
            allUsers,
            markAllNotificationsAsRead,
            markNotificationsAsRead,
            markThisUserNotificationsAsRead,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
