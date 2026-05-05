import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import messageService from '../services/messageService';

const CustomerChatbox = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [productContext, setProductContext] = useState(null);
    const [conversation, setConversation] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        if (!isOpen) return;
        try {
            // First get the conversation
            const conv = await messageService.getCustomerConversation(user, user._id);
            setConversation(conv);
            if (conv && conv._id) {
                const msgs = await messageService.getMessages(user, conv._id);
                setMessages(Array.isArray(msgs) ? msgs : []);
                
                // Mark as read if there are unread messages
                if (conv.unreadByCustomer > 0) {
                    await messageService.markAsRead(user, conv._id);
                }
            }
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.error("Error fetching messages", error);
            }
        }
    };

    useEffect(() => {
        // Listen for "Inquire" button clicks from product cards
        const handleOpenChat = (e) => {
            setIsOpen(true);
            if (e.detail) {
                setProductContext(e.detail);
                setNewMessage(`Hi, I'm inquiring about ${e.detail.productName}. `);
            }
        };

        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    useEffect(() => {
        let interval;
        if (isOpen) {
            fetchMessages();
            interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await messageService.sendMessage(user, {
                senderId: user._id,
                senderRole: user.role,
                senderName: user.username,
                content: newMessage,
                customerId: user._id,
                customerName: user.username,
                productContext: productContext
            });

            setNewMessage('');
            setProductContext(null); // Clear context after sending
            fetchMessages(); // Fetch immediately
        } catch (error) {
            console.error('Error sending message:', error);
            const msg = error.response?.data?.message || error.message || 'Failed to send message.';
            alert(`Failed to send message: ${msg}`);
        }
    };

    return (
        <div style={styles.container}>
            {isOpen ? (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <h4 style={{ margin: 0 }}>Chat with us</h4>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>&times;</button>
                    </div>
                    
                    <div style={styles.messageList}>
                        {messages.length === 0 ? (
                            <p style={styles.emptyText}>No messages yet. Start a conversation!</p>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    ...styles.messageWrapper,
                                    justifyContent: msg.senderId === user._id ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{
                                        ...styles.messageBubble,
                                        backgroundColor: msg.senderId === user._id ? '#2d6a4f' : '#f1f1f1',
                                        color: msg.senderId === user._id ? 'white' : 'black'
                                    }}>
                                        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>
                                            {msg.senderName} {msg.senderId !== user._id && (msg.senderRole === 'Admin' ? ' (Admin)' : '')}
                                        </div>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} style={styles.inputArea}>
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={styles.input}
                        />
                        <button type="submit" style={styles.sendBtn}>Send</button>
                    </form>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} style={styles.floatingBtn}>
                    <img src="/svg/succulent.svg" alt="Chat" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                    <span style={{ marginLeft: '8px' }}>Chat</span>
                    {conversation && conversation.unreadByCustomer > 0 && (
                        <span style={styles.badge}>{conversation.unreadByCustomer}</span>
                    )}
                </button>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
    },
    floatingBtn: {
        backgroundColor: '#2d6a4f',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    chatWindow: {
        width: '350px',
        height: '450px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: '#2d6a4f',
        color: 'white',
        padding: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer'
    },
    messageList: {
        flex: 1,
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: '20px'
    },
    messageWrapper: {
        display: 'flex',
        width: '100%'
    },
    messageBubble: {
        padding: '10px 15px',
        borderRadius: '15px',
        maxWidth: '75%',
        wordWrap: 'break-word'
    },
    inputArea: {
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white'
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '20px',
        marginRight: '10px',
        outline: 'none'
    },
    sendBtn: {
        backgroundColor: '#2d6a4f',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '0 20px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default CustomerChatbox;
