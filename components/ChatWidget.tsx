
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
            }
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getMockResponse = (text: string): string => {
        const lower = text.toLowerCase();
        if (lower.includes('loan')) return "I can help you with loan management. You can create new loans in the Client Details view or track repayment schedules.";
        if (lower.includes('risk')) return "Risk scoring is automatic based on client data (income, occupation, household size). High risk clients are flagged.";
        if (lower.includes('default') || lower.includes('late')) return "The system uses AI to predict default probability based on payment history. You can view this in the Loan details.";
        if (lower.includes('hello') || lower.includes('hi')) return "Hello! How can I assist you with the Microfinance system today?";
        if (lower.includes('export')) return "You can export the portfolio report from the Dashboard using the 'Export Report' button.";
        if (lower.includes('client')) return "You can add new clients using the '+ New' button in the client list.";
        
        return "I can assist you with client onboarding, loan tracking, and risk analysis. Even without a live connection, I can guide you through the system's features. How can I help?";
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Try to initialize if not already done (lazy init)
            if (!chatSessionRef.current) {
                 chatSessionRef.current = createChatSession();
            }

            let responseText = '';

            if (chatSessionRef.current) {
                 try {
                    const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
                    responseText = result.text;
                 } catch (apiError) {
                     console.warn("API call failed, falling back to simulated mode", apiError);
                     responseText = getMockResponse(userMsg.text);
                 }
            } else {
                // Fallback if session creation failed (e.g. no API key)
                await new Promise(resolve => setTimeout(resolve, 600));
                responseText = getMockResponse(userMsg.text);
            }

             setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: responseText }]);

        } catch (error) {
            console.error("Chat error", error);
             setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'I apologize, but I encountered an unexpected error. Please try again.' }]);
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
