import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import messageService from '../services/messageService';

const AdminChat = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('Pending'); // Pending, Ongoing, Resolved
    const [searchQuery, setSearchQuery] = useState('');
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

    const filteredConversations = conversations.filter(conv => {
        const matchesStatus = conv.status === statusFilter;
        const matchesSearch = conv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div style={styles.container}>
            {/* Sidebar: Conversations */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#F7F4D5' }}>Inquiries</h3>
                    <input 
                        type="text" 
                        placeholder="Search customers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.searchBar}
                    />
                    <div style={styles.filterTabs}>
                        {['Pending', 'Ongoing', 'Resolved'].map(status => (
                            <button 
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                style={{
                                    ...styles.filterBtn,
                                    borderBottom: statusFilter === status ? '3px solid #839958' : 'none',
                                    color: statusFilter === status ? '#F7F4D5' : 'rgba(247, 244, 213, 0.6)'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={styles.convList}>
                    {filteredConversations.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'rgba(247, 244, 213, 0.4)', marginTop: '20px' }}>No {statusFilter.toLowerCase()} inquiries.</p>
                    ) : (
                        filteredConversations.map(conv => (
                            <div 
                                key={conv._id} 
                                style={{
                                    ...styles.convItem,
                                    backgroundColor: selectedConv?._id === conv._id ? '#839958' : 'transparent'
                                }}
                                onClick={() => setSelectedConv(conv)}
                                onMouseEnter={(e) => {
                                    if (selectedConv?._id !== conv._id) e.currentTarget.style.backgroundColor = 'rgba(131, 153, 88, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedConv?._id !== conv._id) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ fontSize: '15px' }}>{conv.customerName}</strong>
                                    {conv.unreadByAdmin > 0 && (
                                        <span style={styles.badge}>{conv.unreadByAdmin}</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '12px', opacity: 0.8, margin: '5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                                    {conv.lastMessage || 'No messages yet'}
                                </div>
                                {conv.assignedAdminId && (
                                    <div style={{ fontSize: '11px', fontStyle: 'italic', opacity: 0.6, textAlign: 'right' }}>
                                        Claimed by {conv.assignedAdminId.username}
                                    </div>
                                )}
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
                            <div>
                                <h3 style={{ margin: 0, color: '#0A3323' }}>{selectedConv.customerName}</h3>
                                <span style={{ fontSize: '12px', color: '#666' }}>Status: {selectedConv.status}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {selectedConv.status !== 'Resolved' && (
                                    <button 
                                        onClick={() => handleStatusChange('Resolved')}
                                        style={styles.resolveBtn}
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
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
                                    const isFromAdmin = msg.senderRole === 'Admin';
                                    return (
                                        <div key={idx} style={{
                                            ...styles.messageWrapper,
                                            justifyContent: isFromAdmin ? 'flex-end' : 'flex-start'
                                        }}>
                                            <div style={{
                                                ...styles.messageBubble,
                                                backgroundColor: isFromAdmin ? '#839958' : '#105666',
                                                color: '#F7F4D5',
                                                borderRadius: isFromAdmin ? '15px 15px 2px 15px' : '15px 15px 15px 2px'
                                            }}>
                                                <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.9, textAlign: isFromAdmin ? 'right' : 'left' }}>
                                                    {msg.senderName} {isFromAdmin ? '(Admin)' : ''}
                                                </div>
                                                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                                    {msg.content}
                                                </div>
                                                <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.7, textAlign: 'right' }}>
                                                    {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
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
                                placeholder="Type your response..."
                                style={styles.input}
                            />
                            <button type="submit" style={styles.sendBtn}>Send</button>
                        </form>
                    </>
                ) : (
                    <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#666', flexDirection: 'column', gap: '15px' }}>
                        <img src="/svg/succulent.svg" alt="Select" style={{ width: '60px', opacity: 0.2 }} />
                        <span>Select a conversation to view inquiry details.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '700px',
        border: '1px solid #105666',
        borderRadius: '15px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 8px 30px rgba(16, 86, 102, 0.1)'
    },
    sidebar: {
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0A3323',
        color: '#F7F4D5'
    },
    sidebarHeader: {
        padding: '20px',
        borderBottom: '1px solid rgba(247, 244, 213, 0.1)'
    },
    searchBar: {
        width: '100%',
        padding: '10px 15px',
        borderRadius: '25px',
        border: 'none',
        backgroundColor: 'rgba(247, 244, 213, 0.1)',
        color: '#F7F4D5',
        fontSize: '14px',
        outline: 'none',
        marginBottom: '15px',
        boxSizing: 'border-box'
    },
    filterTabs: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '5px'
    },
    filterBtn: {
        background: 'none',
        border: 'none',
        color: '#F7F4D5',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        padding: '8px 0',
        transition: '0.3s',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    convList: {
        flex: 1,
        overflowY: 'auto',
    },
    convItem: {
        padding: '15px 20px',
        borderBottom: '1px solid rgba(247, 244, 213, 0.05)',
        cursor: 'pointer',
        transition: '0.2s'
    },
    badge: {
        backgroundColor: '#D3968C',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '10px',
        fontWeight: 'bold'
    },
    chatArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F7F4D5'
    },
    chatHeader: {
        padding: '20px',
        borderBottom: '1px solid rgba(16, 86, 102, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    resolveBtn: {
        backgroundColor: '#D3968C',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 15px',
        fontSize: '13px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.3s'
    },
    statusSelect: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #105666',
        backgroundColor: '#F7F4D5',
        color: '#105666',
        fontSize: '13px',
        fontWeight: 'bold',
        outline: 'none',
        cursor: 'pointer'
    },
    messageList: {
        flex: 1,
        padding: '25px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    messageWrapper: {
        display: 'flex',
        width: '100%'
    },
    messageBubble: {
        padding: '12px 18px',
        maxWidth: '75%',
        wordWrap: 'break-word',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    inputArea: {
        display: 'flex',
        padding: '20px',
        borderTop: '1px solid rgba(16, 86, 102, 0.1)',
        backgroundColor: 'white'
    },
    input: {
        flex: 1,
        padding: '12px 20px',
        border: '1px solid #eee',
        borderRadius: '30px',
        marginRight: '15px',
        outline: 'none',
        fontSize: '15px',
        backgroundColor: '#fafafa'
    },
    sendBtn: {
        backgroundColor: '#105666',
        color: '#F7F4D5',
        border: 'none',
        borderRadius: '30px',
        padding: '0 30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '15px',
        transition: '0.3s'
    }
};

export default AdminChat;
