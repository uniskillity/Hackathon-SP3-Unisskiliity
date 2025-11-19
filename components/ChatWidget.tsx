
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from "@google/genai";
import { createChatSession } from '../services/geminiService';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', role: 'model', text: 'Hello! I am your AI assistant. How can I help you with loan management today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chatSessionRef.current) {
            const session = createChatSession();
            if (session) {
                chatSessionRef.current = session;
            } else {
                 // Do not clutter chat with error immediately, just log it.
                 // The error message will be shown if the user tries to send a message.
                 console.warn("Gemini Chat Session could not be initialized. Check API Key.");
            }
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Try to initialize if not already done
            if (!chatSessionRef.current) {
                 chatSessionRef.current = createChatSession();
            }

            if (!chatSessionRef.current) {
                // Explicit error if initialization failed
                 setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'AI service is currently unavailable. Please check your system configuration or internet connection.' }]);
                 setIsLoading(false);
                 return;
            }

            const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
            const text = result.text;
             setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: text }]);

        } catch (error) {
            console.error("Chat error", error);
             setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Sorry, I encountered an error connecting to the AI service. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-widget">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                             <div style={{backgroundColor:'rgba(255,255,255,0.2)', padding:'0.4rem', borderRadius:'50%'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width:'1.2rem', height:'1.2rem'}}>
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                             </div>
                            <span style={{fontWeight: 600}}>AI Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{background:'none', border:'none', color:'white', cursor:'pointer', opacity:0.8}}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width:'1.5rem', height:'1.5rem'}}>
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}>
                                <div className="chat-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="chat-message chat-message-ai">
                                <div className="chat-bubble" style={{display: 'flex', gap: '4px', alignItems: 'center', height: '24px'}}>
                                    <span style={{width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s'}}></span>
                                    <span style={{width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s'}}></span>
                                    <span style={{width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both'}}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="chat-input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask about loans..."
                            className="chat-input"
                            style={{flexGrow: 1}}
                        />
                        <button type="submit" className="btn btn-primary" style={{borderRadius:'50%', width:'2.5rem', height:'2.5rem', padding:0, flexShrink: 0}} disabled={isLoading || !input.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width:'1.25rem', height:'1.25rem'}}>
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chat-button"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: '1.5rem', height: '1.5rem'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
