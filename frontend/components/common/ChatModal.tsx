"use client";

import React, { useState, useEffect, useRef } from "react";
import { Offcanvas, Button, Form } from "react-bootstrap";

interface ChatModalProps {
  show: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ show, onClose }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "Bot", text: "Hello! How can I assist you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: "You", text: newMessage }]);
    setNewMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement="end"
      className="side-chat-offcanvas"
      backdrop="static"
    >
      <Offcanvas.Header closeButton className="bg-primary text-white">
        <Offcanvas.Title>Live Chat</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body
        className="d-flex flex-column p-0"
        style={{ justifyContent: "end", borderRadius: "20px" }}
      >
        <div
          className="flex-grow-1 overflow-auto p-3 bg-light"
          style={{ maxHeight: "100vh" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`d-flex mb-2 ${
                msg.sender === "You"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded-pill ${
                  msg.sender === "You"
                    ? "bg-primary text-white"
                    : "bg-white border"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <div className="d-flex border-top p-2">
          <Form.Control
            type="text"
            placeholder="Type a message..."
            className="me-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button variant="primary" onClick={handleSend}>
            Send
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ChatModal;
