package com.GoHommies.example;

/**
 * CHAT SYSTEM - CLIENT IMPLEMENTATION GUIDE
 * ==========================================
 * 
 * This document shows how to implement the WebSocket chat on the frontend.
 * 
 * 1. SETUP: Include SockJS and Stomp.js libraries in your frontend
 * 
 *    <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
 *    <script src="https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js"></script>
 * 
 * 
 * 2. CONNECT TO WEBSOCKET ENDPOINT
 * 
 *    const socket = new SockJS('/ws/chat');
 *    const stompClient = Stomp.over(socket);
 *    
 *    stompClient.connect({}, (frame) => {
 *        console.log('Connected: ' + frame.command);
 *        
 *        // Join a specific chat room
 *        stompClient.subscribe('/topic/chat/room/1', (message) => {
 *            handleIncomingMessage(JSON.parse(message.body));
 *        });
 *    });
 * 
 * 
 * 3. SEND A MESSAGE VIA WEBSOCKET (Real-time)
 * 
 *    function sendMessage(roomId, content) {
 *        stompClient.send('/app/chat/send/' + roomId, {}, JSON.stringify({
 *            content: content,
 *            senderName: 'John Doe',
 *            senderProfileUrl: 'https://...'
 *        }));
 *    }
 * 
 * 
 * 4. ALSO SAVE MESSAGE VIA REST API (for persistence)
 * 
 *    function saveMessage(roomId, content) {
 *        fetch('/traveller/chat/rooms/' + roomId + '/messages', {
 *            method: 'POST',
 *            headers: { 'Content-Type': 'application/json' },
 *            body: JSON.stringify({ content: content })
 *        })
 *        .then(res => res.json())
 *        .then(data => console.log('Message saved:', data));
 *    }
 * 
 * 
 * 5. JOIN A CHAT ROOM
 * 
 *    function joinChatRoom(roomId) {
 *        stompClient.send('/app/chat/join/' + roomId, {});
 *    }
 * 
 * 
 * 6. LEAVE A CHAT ROOM
 * 
 *    function leaveChatRoom(roomId) {
 *        stompClient.send('/app/chat/leave/' + roomId, {});
 *    }
 * 
 * 
 * 7. FETCH CHAT HISTORY VIA REST API
 * 
 *    fetch('/traveller/chat/rooms/1/messages?page=0&size=50')
 *        .then(res => res.json())
 *        .then(messages => console.log('Chat history:', messages));
 * 
 * 
 * 8. FULL EXAMPLE - CHAT INTERFACE
 * 
 *    class ChatManager {
 *        constructor() {
 *            this.socket = new SockJS('/ws/chat');
 *            this.stompClient = Stomp.over(this.socket);
 *            this.currentRoomId = null;
 *            this.messages = [];
 *        }
 *    
 *        connect(onSuccess) {
 *            this.stompClient.connect({}, () => {
 *                console.log('Connected to chat server');
 *                onSuccess();
 *            });
 *        }
 *    
 *        selectRoom(roomId) {
 *            // Load chat history
 *            fetch(`/traveller/chat/rooms/${roomId}/messages?page=0&size=50`)
 *                .then(res => res.json())
 *                .then(messages => {
 *                    this.messages = messages;
 *                    this.renderMessages();
 *                });
 *    
 *            // Subscribe to real-time updates
 *            this.stompClient.subscribe(`/topic/chat/room/${roomId}`, (msg) => {
 *                const message = JSON.parse(msg.body);
 *                this.messages.push(message);
 *                this.renderMessages();
 *            });
 *    
 *            this.currentRoomId = roomId;
 *            this.joinRoom(roomId);
 *        }
 *    
 *        sendMessage(content) {
 *            // Send via WebSocket for real-time delivery
 *            this.stompClient.send(`/app/chat/send/${this.currentRoomId}`, {}, 
 *                JSON.stringify({
 *                    content: content,
 *                    senderName: 'Current User',
 *                    senderProfileUrl: 'https://...'
 *                })
 *            );
 *    
 *            // Also persist via REST API
 *            fetch(`/traveller/chat/rooms/${this.currentRoomId}/messages`, {
 *                method: 'POST',
 *                headers: { 'Content-Type': 'application/json' },
 *                body: JSON.stringify({ content: content })
 *            });
 *        }
 *    
 *        joinRoom(roomId) {
 *            this.stompClient.send(`/app/chat/join/${roomId}`, {});
 *        }
 *    
 *        leaveRoom(roomId) {
 *            this.stompClient.send(`/app/chat/leave/${roomId}`, {});
 *        }
 *    
 *        renderMessages() {
 *            const chatDiv = document.getElementById('messages');
 *            chatDiv.innerHTML = this.messages.map(msg => `
 *                <div class="message">
 *                    <img src="${msg.senderProfileUrl}" class="profile-pic">
 *                    <div>
 *                        <strong>${msg.senderName}</strong>
 *                        <p>${msg.content}</p>
 *                        <small>${new Date(msg.sentAt).toLocaleString()}</small>
 *                    </div>
 *                </div>
 *            `).join('');
 *        }
 *    }
 *    
 *    // Usage
 *    const chat = new ChatManager();
 *    chat.connect(() => {
 *        chat.selectRoom(1); // Select room ID 1
 *        document.getElementById('send-btn').onclick = () => {
 *            const content = document.getElementById('message-input').value;
 *            chat.sendMessage(content);
 *            document.getElementById('message-input').value = '';
 *        };
 *    });
 */
public class ChatClientImplementationExample {
}
