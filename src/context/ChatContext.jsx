/* eslint-disable no-undef */
    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable no-unused-vars */
    /* eslint-disable react/prop-types */
    import { createContext, useState, useEffect, useCallback } from "react";
    import { baseUrl, getRequest, postRequest } from "../utils/services";
    import { io } from "socket.io-client";

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
            if (user) {
                const newSocket = io(baseUrl, { transports: ['websocket'] });
                setSocket(newSocket);
    
                newSocket.on('getOnlineUsers', (users) => {
                    setOnlineUsers(users);
                });
    
                newSocket.on('getMessage', (newMessage) => {
                    if (currentChat && newMessage.chatId === currentChat._id) {
                        setMessages(prevMessages => [...prevMessages, newMessage]);
                    }
                });
    
                newSocket.on('userDisconnected', (userId) => {
                    setOnlineUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
                });
    
                newSocket.on('getNotification', (notification) => {
                    setNotifications(prevNotifications => [notification, ...prevNotifications]);
                });
    
                return () => {
                    newSocket.off('getOnlineUsers');
                    newSocket.off('userDisconnected');
                    newSocket.off('getMessage');
                    newSocket.off('getNotification');
                    newSocket.disconnect();
                };
            } else {
                setSocket(null);
            }
        }, [user]);

        useEffect(() => {
            if (!socket || !user?._id) return;
    
            socket.emit("addNewUser", user._id);
            socket.on("getOnlineUsers", (res) => {
                setOnlineUsers(res);
            });
    
            return () => {
                socket.off("addNewUser");
                socket.off("getOnlineUsers");
            };
        }, [socket, user?._id]);

        useEffect(() => {
            const fetchDoctors = async () => {
                // Fetch doctors only if the user is a patient
                if (user?.role === 'patient') {
                    setIsUserChatsLoading(true);
                    try {
                        const response = await getRequest(`${baseUrl}/api/v1/medic/doctor/list`);
                        if (response.error) {
                            setUserChatsError(response.error);
                        } else {
                            setPotentialChats(response.doctors);
                        }
                    } catch (error) {
                        console.error("Error in fetchDoctors:", error);
                        setUserChatsError(error);
                    } finally {
                        setIsUserChatsLoading(false);
                    }
                }
            };
            
            fetchDoctors();
        }, [user?.role]);
        

        const emitLogout = useCallback((userId) => {
            if (socket) {
                socket.emit("userLogout", userId);
                setSocket(null); // Set socket to null to ensure it disconnects
            }
        }, [socket]);

        useEffect(() => {
            const getMessages = async () => {
                if (currentChat?._id) {
                    setIsMessagesLoading(true);
                    try {
                        const response = await getRequest(`${baseUrl}/api/v1/messages/${currentChat._id}`);
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
                const response = await postRequest(`${baseUrl}/api/v1/messages`, messageData);
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
                const response = await postRequest(`${baseUrl}/api/v1/chats`, { firstId, secondId });
                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData && responseData.data) {
                        setUserChats(prev => [...prev, responseData.data]);
                        updateCurrentChat(responseData.data);
                        return responseData.data; // Return the new chat data
                    } else {
                        console.error("Response data is not in the expected format", responseData);
                    }
                } else {
                    console.error("Error Creating Chat: ", response.statusText);
                }
            } catch (error) {
                console.error("Error Creating Chat", error);
            }
        }, [baseUrl, setUserChats, updateCurrentChat]);
        
        useEffect(() => {
            const fetchPotentialChats = async () => {
                if (user?.role === 'patient') {
                    setIsUserChatsLoading(true);
                    try {
                        const response = await getRequest(`${baseUrl}/api/v1/medic/doctor/list`);
                        if (response.error) {
                            setUserChatsError(response.error);
                            return;
                        }
                        setPotentialChats(response.doctors);
                    } catch (error) {
                        setUserChatsError(error);
                    } finally {
                        setIsUserChatsLoading(false);
                    }
                }
            };
    
            if (user?._id) {
                fetchPotentialChats();
            }
        }, [user?._id, user?.role, setIsUserChatsLoading, setUserChatsError]);

        useEffect(() => {
            const fetchUsers = async () => {
                setIsUserChatsLoading(true);
                try {
                    const response = await getRequest(`${baseUrl}/api/v1/user/list`);
                    if (response.error) {
                        setUserChatsError(response.error);
                        return;
                    }
                    setAllUsers(response.data);
                } catch (error) {
                    setUserChatsError(error);
                } finally {
                    setIsUserChatsLoading(false);
                }
            };
    
            if (user?._id) {
                fetchUsers();
            }
        }, [user?._id]);

        useEffect(() => {
            const fetchPatients = async () => {
                // Only fetch patients if the user is a doctor
                if (user?.role === 'doctor') {
                    setIsUserChatsLoading(true);
                    try {
                        const response = await getRequest(`${baseUrl}/api/v1/user/list`);
                        if (response.error) {
                            setUserChatsError(response.error);
                        } else {
                            setPotentialChats(response.data); // assuming 'data' is an array of patient profiles
                        }
                    } catch (error) {
                        console.error("Error in fetchPatients:", error);
                        setUserChatsError(error);
                    } finally {
                        setIsUserChatsLoading(false);
                    }
                }
            };
        
            fetchPatients();
        }, [user?.role]);

        useEffect(() => {
            const fetchUserChats = async () => {
                if (user?._id) {
                    setIsUserChatsLoading(true);
                    try {
                        const response = await getRequest(`${baseUrl}/api/v1/chats/${user._id}`);
                        if (response.error) {
                            setUserChatsError(response.error);
                            return;
                        }
                        // Adjust the state based on the response structure
                        setUserChats(response.data.data);
                    } catch (error) {
                        setUserChatsError(error);
                    } finally {
                        setIsUserChatsLoading(false);
                    }
                }
            };
        
            // Call fetchUserChats for both patients and doctors
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
                emitLogout,
            }}>
                {children}
            </ChatContext.Provider>
        );
    };