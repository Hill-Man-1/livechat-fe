// Chat.js
import { useContext } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import UserChat from '../components/chat/UserChat';
import PotentialChats from '../components/chat/potentialChats';
import DoctorPotentialChats from '../components/chat/DoctorPotentialChats';
import ChatBox from '../components/chat/chatBox';
import UserChatPatient from '../components/chat/UserChatPatient';

const Chat = () => { 
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);
    
    return (
        <Container>
            {user?.role === 'patient' && <PotentialChats/>}
            {user?.role === 'doctor' && <DoctorPotentialChats/>}
            <Stack direction="horizontal" gap={4} className='align-items-start'>
                <Stack className='messages-box flex-grow-0 pe-3' gap={3}>
                    {isUserChatsLoading && <p>Loading Chats...</p>}
                    {user?.role === 'patient' && userChats?.map((chat, index) => (
                        <div key={index} onClick={() => updateCurrentChat(chat)}>
                            <UserChat chat={chat} user={user}/>
                        </div>
                    ))}
                    {user?.role === 'doctor' && userChats?.map((chat, index) => (
                        <div key={index} onClick={() => updateCurrentChat(chat)}>
                            <UserChatPatient chat={chat} user={user}/>
                        </div>
                    ))}
                </Stack>
                <ChatBox/>
            </Stack>
        </Container>
    );
}

export default Chat;

