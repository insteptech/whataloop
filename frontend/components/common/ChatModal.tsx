"use client";
import React, { useState, useEffect, useRef } from "react";
import { Offcanvas, Button, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getChat, postMessage } from "@/modules/leads/redux/action/leadAction";

interface ChatMessage {
  lead_id: string;
  sender: string;
  receiver: string;
  content: string;
  type: "incoming" | "outgoing";
  timestamp: string;
  status: string;
  isSentByUser: boolean;
}

interface ChatModalProps {
  show: boolean;
  onClose: () => void;
  leadId?: string;
  leadPhone?: string;
  leadName?: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  show,
  onClose,
  leadId,
  leadPhone,
  leadName,
}) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { data: user } = useSelector(
    (state: {
      profileReducer: { data: any; loading: boolean; error: string };
    }) => state.profileReducer
  );

  // Fetch chat when modal opens
  useEffect(() => {
    if (show && leadId) {
      const fetchChat = async () => {
        setLoading(true);
        try {
          const resultAction = await dispatch(getChat(leadId) as any);
          if (getChat.fulfilled.match(resultAction)) {
            const chatData = resultAction.payload;
            setMessages(
              Array.isArray(chatData.data?.messages)
                ? chatData.data.messages
                : []
            );
            setError(null);
          } else {
            setError("Failed to load chat thread.");
            setMessages([]);
          }
        } catch (err: any) {
          setError(err.message || "Something went wrong.");
          setMessages([]);
        } finally {
          setLoading(false);
        }
      };
      fetchChat();
    }
  }, [show, leadId, dispatch]);

  // Auto‐scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send new message
  const handleSend = async () => {
    if (!newMessage.trim() || !leadId || !user) return;

    const payload = {
      lead_id: leadId,
      sender_phone_number: user.phone,
      receiver_phone_number: leadPhone,
      message_content: newMessage,
      message_type: "outgoing" as const,
      status: "sent",
    };

    const temp: ChatMessage = {
      lead_id: leadId,
      sender: payload.sender_phone_number,
      receiver: payload.receiver_phone_number!,
      content: payload.message_content,
      type: "outgoing",
      timestamp: new Date().toISOString(),
      status: "sent",
      isSentByUser: true,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      await dispatch(postMessage(payload) as any);
    } catch (err) {
      console.error("Message sending failed:", err);
    }
  };

  return (
    <Offcanvas
      show={show}
      onHide={onClose}
      placement="end"
      style={{ zIndex: 9999999 }}
      backdrop="static"
    >
      <Offcanvas.Header closeButton className="chat-box-header">
        <Offcanvas.Title>Live Chat With – {leadName}</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body
        className="d-flex flex-column p-0"
        style={{ height: "calc(100vh - 56px)" }}
      >
        {/* Messages */}
        <div className="flex-grow-1 overflow-auto p-3 bg-light">
          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : error ? (
            <div className="text-danger p-2">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-muted">No messages found.</div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${
                  msg.type === "outgoing"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded-pill ${
                    msg.type === "outgoing"
                      ? "bg-primary text-white"
                      : "bg-white border"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input bar sticks to bottom */}
        <div className="mt-auto d-flex border-top p-2 bg-white">
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
