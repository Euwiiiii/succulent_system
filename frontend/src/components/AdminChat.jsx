import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import messageService from '../services/messageService';

const AdminChat = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    if (!user || user.role !== 'Admin') return null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const data = await messageService.getConversations(user);
            setConversations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedConv) return;
        try {
            const msgs = await messageService.getMessages(user, selectedConv._id);
            setMessages(Array.isArray(msgs) ? msgs : []);

            if (selectedConv.unreadByAdmin > 0) {
                await messageService.markAsRead(user, selectedConv._id);
                fetchConversations(); // Update badge
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedConv]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        try {
            await messageService.sendMessage(user, {
                senderId: user._id,
                senderRole: user.role,
                senderName: user.username,
                content: newMessage,
                customerId: selectedConv.customerId,
                customerName: selectedConv.customerName
            });

            setNewMessage('');
            fetchMessages();
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message.');
        }
    };

    const handleStatusChange = async (status) => {
        if (!selectedConv) return;
        try {
            await messageService.updateStatus(user, selectedConv._id, status, user._id);
            fetchConversations();
            setSelectedConv(prev => ({ ...prev, status, assignedAdminId: { _id: user._id, username: user.username } }));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar: Conversations */}
            <div style={styles.sidebar}>
                <h3 style={styles.sidebarHeader}>Inbox</h3>
                <div style={styles.convList}>
                    {conversations.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888' }}>No conversations.</p>
                    ) : (
                        conversations.map(conv => (
                            <div 
                                key={conv._id} 
                                style={{
                                    ...styles.convItem,
                                    backgroundColor: selectedConv?._id === conv._id ? '#e9ecef' : 'white'
                                }}
                                onClick={() => setSelectedConv(conv)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ fontSize: '16px' }}>{conv.customerName}</strong>
                                    {conv.unreadByAdmin > 0 && (
                                        <span style={styles.badge}>{conv.unreadByAdmin}</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '13px', color: '#666', margin: '5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {conv.lastMessage || 'No messages yet'}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ 
                                        color: conv.status === 'Resolved' ? 'var(--moss-green)' : (conv.status === 'Ongoing' ? '#e67e22' : '#888'),
                                        fontWeight: 'bold'
                                    }}>
                                        {conv.status}
                                    </span>
                                    {conv.assignedAdminId && (
                                        <span style={{ color: '#888' }}>claimed by {conv.assignedAdminId.username}</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div style={styles.chatArea}>
                {selectedConv ? (
                    <>
                        <div style={styles.chatHeader}>
                            <h3>Chat with {selectedConv.customerName}</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select 
                                    value={selectedConv.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    style={styles.statusSelect}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.messageList}>
                            {messages.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#888' }}>No messages yet.</p>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isSelf = msg.senderId === user._id;
                                    const prevMsg = idx > 0 ? messages[idx - 1] : null;
                                    const showTime = !prevMsg || (new Date(msg.createdAt || Date.now()) - new Date(prevMsg.createdAt || Date.now())) > 5 * 60 * 1000;
                                    const isContinuation = !showTime && prevMsg?.senderId === msg.senderId;

                                    return (
                                        <React.Fragment key={idx}>
                                            {showTime && (
                                                <div style={{ textAlign: 'center', fontSize: '11px', color: '#888', margin: '15px 0 5px' }}>
                                                    -- {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()} --
                                                </div>
                                            )}
                                            <div style={{
                                                ...styles.messageWrapper,
                                                justifyContent: isSelf ? 'flex-end' : 'flex-start',
                                                marginTop: isContinuation ? '2px' : '10px'
                                            }}>
                                                <div style={{
                                                    ...styles.messageBubble,
                                                    backgroundColor: isSelf ? 'var(--moss-green)' : '#f1f1f1',
                                                    color: isSelf ? 'white' : 'black',
                                                    textAlign: 'left',
                                                    borderRadius: isSelf 
                                                        ? (isContinuation ? '15px 4px 4px 15px' : '15px 15px 4px 15px')
                                                        : (isContinuation ? '4px 15px 15px 4px' : '15px 15px 15px 4px')
                                                }}>
                                                    {(!isContinuation || showTime) && (
                                                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px', opacity: 0.8 }}>
                                                            {isSelf ? 'You' : msg.senderName}
                                                        </div>
                                                    )}
                                                    <div style={{ fontSize: '14px', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
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
                            <button type="submit" style={styles.sendBtn}>Send</button>
                        </form>
                    </>
                ) : (
                    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
                        Select a conversation to start chatting.
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '600px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    sidebar: {
        width: '300px',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
    },
    sidebarHeader: {
        padding: '15px',
        margin: 0,
        backgroundColor: 'var(--dark-green)',
        color: 'white',
        borderBottom: '1px solid #ddd'
    },
    convList: {
        flex: 1,
        overflowY: 'auto',
    },
    convItem: {
        padding: '15px',
        borderBottom: '1px solid #ddd',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    badge: {
        backgroundColor: 'var(--rosy-brown)',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    chatArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    chatHeader: {
        padding: '15px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    statusSelect: {
        padding: '5px 10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        outline: 'none'
    },
    messageList: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    messageWrapper: {
        display: 'flex',
        width: '100%'
    },
    messageBubble: {
        padding: '10px 15px',
        borderRadius: '15px',
        maxWidth: '70%',
        wordWrap: 'break-word',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    inputArea: {
        display: 'flex',
        padding: '15px',
        borderTop: '1px solid #ddd',
        backgroundColor: 'white'
    },
    input: {
        flex: 1,
        padding: '10px 15px',
        border: '1px solid #ddd',
        borderRadius: '20px',
        marginRight: '10px',
        outline: 'none',
        fontSize: '16px'
    },
    sendBtn: {
        backgroundColor: 'var(--midnight-green)',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '0 25px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    }
};

export default AdminChat;
