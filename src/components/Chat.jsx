import React, { useState, useEffect, useRef } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { toast } from "react-toastify";

const Chat = ({ room }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageRef = collection(db, "messages");
  const messageListRef = useRef(null); // Ref for scrolling to the bottom

  useEffect(() => {
    const queryMessage = query(
      messageRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessage, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);

      // Scroll to the latest message when new messages arrive
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }

      // Display toast for new messages
      if (newMessages.length > 0) {
        toast.info("You have a new message!", {
          position: "top-right",
          autoClose: 10000, // Close the toast after 10 seconds
        });
      }
    });

    return () => unsubscribe();
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(messageRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      avatar: auth.currentUser.photoURL,
      room,
    });
    setNewMessage("");
  };

  const chatBG = {
    backgroundImage: 'url("https://i.pinimg.com/736x/be/a2/79/bea2799c7e12842f10246ef7581ec36a.jpg")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  };

  return (
    <div className="lg:w-1/3 md:w-1/3 w-2/3 bg-neutral-400 p-4 justify-center rounded-lg">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Welcome to {room.toUpperCase()}</h1>
      </div>
      <div className="max-w-5xl mx-auto p-4 rounded shadow-lg" style={chatBG}>
        <div
          className="mb-4 space-y-4"
          style={{
            maxHeight: "300px", // Adjust the maximum height as needed
            overflowY: "auto", // Enable vertical scrolling
          }}
          ref={messageListRef}
        >
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-2 text-white">
              <img
                src={message.avatar || "URL_TO_DEFAULT_AVATAR"}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="font-semibold text-white">{message.user}:</div>
              <div>{message.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex md:flex-row flex-col gap-2">
            <input
              className="flex-grow border rounded py-2 px-3 focus:outline-none bg-neutral-300 hover:bg-white"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your message"
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            />
            <button
              type="submit"
              className="w-auto md:w-1/3 bg-blue-500 hover:bg-blue-600 text-white  py-2 px-4 rounded-lg"
              // style={{
              //   borderTopLeftRadius: 0,
              //   borderTopRightRadius: 0,
              //   borderBottomRightRadius: 0,
              // }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
