import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AIChat() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI financial assistant. How can I help you manage your budget today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            // Add a user message to indicate action
            setMessages(prev => [...prev, { role: 'user', content: 'Analyze my spending habits.' }]);

            const response = await api.get('/ai/insights');
            const insight = response.data.insight;

            setMessages(prev => [...prev, { role: 'assistant', content: insight }]);
        } catch (error) {
            toast.error('Failed to generate insights');
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encounted an error while analyzing your data.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.post('/ai/chat', { message: userMessage.content });
            const botMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            toast.error('Failed to get response');
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the server.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Financial Advisor</h1>
                <Button onClick={handleAnalyze} disabled={loading} className="hidden sm:flex" variant="secondary">
                    <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                    Analyze Spending
                </Button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, index) => (
                        <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-start max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${m.role === 'user' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'}`}>
                                    {m.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${m.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-none'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your budget, savings, or expenses..."
                            className="flex-1"
                            disabled={loading}
                        />
                        <Button type="submit" disabled={loading || !input.trim()}>
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
