"use client";

import { useState } from "react";
import Header from "./Header";

interface Message {
  type: "question" | "answer";
  content: string;
  timestamp: Date;
}

export default function LegalChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion("");

    // Add user question to messages
    const userMessage: Message = {
      type: "question",
      content: userQuestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the API
      const conversationMessages = messages.map(msg => ({
        role: msg.type === "question" ? "user" : "assistant",
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: userQuestion,
          messages: conversationMessages
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add AI response to messages
      const aiMessage: Message = {
        type: "answer",
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        type: "answer",
        content:
          "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Initial Welcome Message */}
        {messages.length === 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👩‍💼</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed">
                    Välkommen! Jag är din juridiska AI-assistent med tillgång
                    till verifierade rättskällor och aktuell svensk
                    lagstiftning, inklusive förarbeten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "question" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "answer" && (
                <div className="flex items-start space-x-4 max-w-3xl">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👩‍💼</span>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4 flex-1">
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}

              {message.type === "question" && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-2xl">
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-4 max-w-3xl">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">👩‍💼</span>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-gray-500 text-sm">Tänker...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="sticky bottom-0 bg-gray-100 pb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-end p-4">
              <div className="flex-1 mr-4">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Skriv din fråga här..."
                  className="w-full resize-none border-0 focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-800"
                  rows={1}
                  style={{ minHeight: "24px", maxHeight: "120px" }}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </div>

          {messages.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={clearChat}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Rensa chatt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
