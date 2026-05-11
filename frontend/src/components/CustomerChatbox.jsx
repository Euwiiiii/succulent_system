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

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={styles.container}>
            {isOpen ? (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <h4 style={{ margin: 0, fontWeight: 'bold' }}>Chat with us</h4>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>&times;</button>
                    </div>
                    
                    <div style={styles.messageList}>
                        {messages.length === 0 ? (
                            <p style={styles.emptyText}>No messages yet. Start a conversation!</p>
                        ) : (
                            messages.map((msg, idx) => {
                                const isCustomer = msg.senderId === user._id;
                                return (
                                    <div key={idx} style={{
                                        ...styles.messageWrapper,
                                        alignItems: isCustomer ? 'flex-end' : 'flex-start'
                                    }}>
                                        <div style={{
                                            ...styles.messageBubble,
                                            backgroundColor: isCustomer ? '#105666' : '#839958',
                                            color: isCustomer ? 'white' : '#0A3323',
                                            borderBottomRightRadius: isCustomer ? '4px' : '15px',
                                            borderBottomLeftRadius: isCustomer ? '15px' : '4px'
                                        }}>
                                            <div style={{ 
                                                fontSize: '11px', 
                                                fontWeight: 'bold', 
                                                marginBottom: '4px', 
                                                opacity: 0.8,
                                                textAlign: isCustomer ? 'right' : 'left'
                                            }}>
                                                {msg.senderName} {!isCustomer && (msg.senderRole === 'Admin' ? ' (Admin)' : '')}
                                            </div>
                                            <div style={{ lineHeight: '1.4' }}>{msg.content}</div>
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#888', marginTop: '4px', margin: isCustomer ? '4px 4px 0 0' : '4px 0 0 4px' }}>
                                            {formatTime(msg.timestamp || msg.createdAt)}
                                        </div>
                                    </div>
                                );
                            })
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
                        <button type="submit" style={styles.sendBtn} title="Send">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} style={styles.floatingBtn}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
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
        backgroundColor: '#0A3323',
        color: '#F7F4D5',
        border: 'none',
        borderRadius: '30px',
        padding: '14px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        position: 'relative',
        transition: 'transform 0.2s'
    },
    badge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        backgroundColor: '#D3968C',
        color: 'white',
        borderRadius: '50%',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    },
    chatWindow: {
        width: '350px',
        height: '450px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    header: {
        backgroundColor: '#0A3323',
        color: '#F7F4D5',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#F7F4D5',
        fontSize: '24px',
        cursor: 'pointer',
        lineHeight: '1'
    },
    messageList: {
        flex: 1,
        padding: '20px 15px',
        overflowY: 'auto',
        backgroundColor: '#F7F4D5',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: '20px',
        fontSize: '14px'
    },
    messageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    messageBubble: {
        padding: '12px 16px',
        borderRadius: '15px',
        maxWidth: '80%',
        wordWrap: 'break-word',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        fontSize: '14px'
    },
    inputArea: {
        display: 'flex',
        padding: '15px',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white',
        alignItems: 'center',
        gap: '10px'
    },
    input: {
        flex: 1,
        padding: '12px 15px',
        border: '1px solid #ccc',
        borderRadius: '24px',
        outline: 'none',
        fontSize: '14px',
        backgroundColor: '#fafafa'
    },
    sendBtn: {
        backgroundColor: 'transparent',
        color: '#0A3323',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        transition: 'background-color 0.2s'
    }
};

export default CustomerChatbox;
