# Chat & Messaging System - API Reference

## Overview
The chat system enables real-time messaging between travellers:
- **Direct chats** (1-to-1 messages between two users)
- **Trip group chats** (Group messaging with all trip members)

## WebSocket Connection

**Endpoint:** `ws://localhost:8080/ws/chat`
**Protocol:** STOMP over WebSocket (with SockJS fallback)

### Connection Example
```javascript
const socket = new SockJS('/ws/chat');
const stompClient = Stomp.over(socket);
stompClient.connect({}, onConnect);
```

---

## REST Endpoints

### 1. Create/Get Direct Chat Room
**POST** `/traveller/chat/direct/{otherTravellerId}`

Creates a direct chat room with another traveller (or returns existing room).

**Parameters:**
- `otherTravellerId` (path): ID of the other traveller

**Response:** (201 Created)
```json
{
    "id": 1,
    "roomId": "direct_550e8400-e29b-41d4-a716-446655440000",
    "chatType": "DIRECT",
    "roomName": "John Doe",
    "otherUserName": "John Doe",
    "otherUserProfileUrl": "https://res.cloudinary.com/...",
    "tripId": null,
    "tripDestination": null,
    "lastMessage": {
        "id": 5,
        "chatRoomId": 1,
        "senderName": "Jane Smith",
        "senderEmail": "jane@example.com",
        "senderProfileUrl": "https://res.cloudinary.com/...",
        "content": "How are you?",
        "isRead": false,
        "sentAt": "2024-04-29T15:30:00"
    },
    "unreadCount": 1,
    "lastMessageTime": "2024-04-29T15:30:00",
    "createdAt": "2024-04-28T10:00:00"
}
```

---

### 2. Create/Get Trip Group Chat Room
**POST** `/traveller/chat/trip/{tripId}`

Creates a group chat for a trip (or returns existing room). User must be trip owner or approved member.

**Parameters:**
- `tripId` (path): ID of the trip

**Response:** (201 Created)
```json
{
    "id": 2,
    "roomId": "trip_42_a1b2c3d4-e5f6-41d4-a716-446655440001",
    "chatType": "TRIP_GROUP",
    "roomName": "Paris, France - Group Chat",
    "otherUserName": null,
    "otherUserProfileUrl": null,
    "tripId": 42,
    "tripDestination": "Paris, France",
    "lastMessage": null,
    "unreadCount": 0,
    "lastMessageTime": null,
    "createdAt": "2024-04-29T12:00:00"
}
```

---

### 3. Get All Chat Rooms
**GET** `/traveller/chat/rooms`

Retrieves all chat rooms for the authenticated user, ordered by most recent message.

**Response:** (200 OK)
```json
[
    {
        "id": 1,
        "roomId": "direct_550e8400-e29b-41d4-a716-446655440000",
        "chatType": "DIRECT",
        "roomName": "John Doe",
        "otherUserName": "John Doe",
        "otherUserProfileUrl": "https://res.cloudinary.com/...",
        "unreadCount": 2,
        "lastMessageTime": "2024-04-29T15:30:00",
        "createdAt": "2024-04-28T10:00:00"
    },
    {
        "id": 2,
        "roomId": "trip_42_a1b2c3d4-e5f6-41d4-a716-446655440001",
        "chatType": "TRIP_GROUP",
        "roomName": "Paris, France - Group Chat",
        "tripId": 42,
        "tripDestination": "Paris, France",
        "unreadCount": 0,
        "lastMessageTime": "2024-04-29T14:45:00",
        "createdAt": "2024-04-29T12:00:00"
    }
]
```

---

### 4. Get Specific Chat Room
**GET** `/traveller/chat/rooms/{roomId}`

Retrieves details of a specific chat room (must have access).

**Parameters:**
- `roomId` (path): ID of the chat room

**Response:** (200 OK)
```json
{
    "id": 1,
    "roomId": "direct_550e8400-e29b-41d4-a716-446655440000",
    "chatType": "DIRECT",
    "roomName": "John Doe",
    "otherUserName": "John Doe",
    "otherUserProfileUrl": "https://res.cloudinary.com/...",
    "unreadCount": 2,
    "lastMessage": {
        "id": 10,
        "chatRoomId": 1,
        "senderName": "John Doe",
        "senderEmail": "john@example.com",
        "senderProfileUrl": "https://res.cloudinary.com/...",
        "content": "See you soon!",
        "isRead": false,
        "sentAt": "2024-04-29T15:30:00"
    },
    "lastMessageTime": "2024-04-29T15:30:00",
    "createdAt": "2024-04-28T10:00:00"
}
```

---

### 5. Send a Message
**POST** `/traveller/chat/rooms/{roomId}/messages`

Sends a message to a chat room. Message is persisted immediately and broadcast via WebSocket.

**Parameters:**
- `roomId` (path): ID of the chat room

**Request Body:**
```json
{
    "content": "Let's meet at the Eiffel Tower!"
}
```

**Response:** (201 Created)
```json
{
    "id": 11,
    "chatRoomId": 1,
    "senderName": "Jane Smith",
    "senderEmail": "jane@example.com",
    "senderProfileUrl": "https://res.cloudinary.com/...",
    "content": "Let's meet at the Eiffel Tower!",
    "isRead": false,
    "sentAt": "2024-04-29T15:35:22"
}
```

---

### 6. Get Chat History (Paginated)
**GET** `/traveller/chat/rooms/{roomId}/messages?page=0&size=50`

Retrieves message history for a chat room with pagination (newest first).

**Parameters:**
- `roomId` (path): ID of the chat room
- `page` (query, default=0): Page number (0-indexed)
- `size` (query, default=50): Messages per page (max 100 recommended)

**Response:** (200 OK)
```json
[
    {
        "id": 11,
        "chatRoomId": 1,
        "senderName": "Jane Smith",
        "senderEmail": "jane@example.com",
        "senderProfileUrl": "https://res.cloudinary.com/...",
        "content": "Let's meet at the Eiffel Tower!",
        "isRead": false,
        "sentAt": "2024-04-29T15:35:22"
    },
    {
        "id": 10,
        "chatRoomId": 1,
        "senderName": "John Doe",
        "senderEmail": "john@example.com",
        "senderProfileUrl": "https://res.cloudinary.com/...",
        "content": "See you soon!",
        "isRead": true,
        "sentAt": "2024-04-29T15:30:00"
    }
]
```

---

### 7. Get Unread Message Count
**GET** `/traveller/chat/rooms/{roomId}/unread-count`

Gets the number of unread messages in a chat room.

**Parameters:**
- `roomId` (path): ID of the chat room

**Response:** (200 OK)
```json
{
    "unreadCount": 3
}
```

---

### 8. Mark All Messages as Read
**PUT** `/traveller/chat/rooms/{roomId}/mark-read`

Marks all messages in a chat room as read for the authenticated user.

**Parameters:**
- `roomId` (path): ID of the chat room

**Response:** (204 No Content)

---

### 9. Mark Specific Message as Read
**PUT** `/traveller/chat/messages/{messageId}/read`

Marks a specific message as read.

**Parameters:**
- `messageId` (path): ID of the message

**Response:** (204 No Content)

---

## WebSocket STOMP Messages

### Subscribe to Real-Time Messages
Subscribe to receive messages from a specific chat room in real-time.

**Subscription destination:**
```
/topic/chat/room/{roomId}
```

**Incoming message format:**
```json
{
    "roomId": 1,
    "content": "Hello everyone!",
    "senderName": "Jane Smith",
    "senderProfileUrl": "https://res.cloudinary.com/...",
    "sentTimestamp": 1714423522000
}
```

---

### Send Message via WebSocket
Send a message in real-time to be broadcast to all subscribers.

**Send destination:**
```
/app/chat/send/{roomId}
```

**Message format:**
```json
{
    "content": "Hello everyone!",
    "senderName": "Jane Smith",
    "senderProfileUrl": "https://res.cloudinary.com/..."
}
```

**Note:** Messages sent via WebSocket are also automatically persisted to the database.

---

### Join a Chat Room
Notify the server that you're joining a chat room (optional, for presence tracking).

**Send destination:**
```
/app/chat/join/{roomId}
```

**System message received:**
```json
{
    "roomId": 1,
    "senderName": "System",
    "content": "Jane Smith joined the chat",
    "sentTimestamp": 1714423500000
}
```

---

### Leave a Chat Room
Notify the server that you're leaving a chat room.

**Send destination:**
```
/app/chat/leave/{roomId}
```

**System message received:**
```json
{
    "roomId": 1,
    "senderName": "System",
    "content": "Jane Smith left the chat",
    "sentTimestamp": 1714423600000
}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "status": 400,
    "message": "Cannot chat with yourself"
}
```

### 401 Unauthorized
```json
{
    "status": 401,
    "message": "User not authenticated"
}
```

### 403 Forbidden
```json
{
    "status": 403,
    "message": "You don't have access to this chat room"
}
```

### 404 Not Found
```json
{
    "status": 404,
    "message": "Chat room not found"
}
```

---

## Usage Flow

### Step 1: Create/Get Chat Room
```
POST /traveller/chat/direct/5
→ Returns ChatRoomDto with roomId = "direct_..."
```

### Step 2: Connect to WebSocket
```javascript
const socket = new SockJS('/ws/chat');
const stompClient = Stomp.over(socket);
stompClient.connect({}, () => {
    // Subscribe to room messages
    stompClient.subscribe('/topic/chat/room/1', onMessageReceived);
});
```

### Step 3: Send Message
**Option A: WebSocket (Real-time)**
```javascript
stompClient.send('/app/chat/send/1', {}, JSON.stringify({
    content: 'Hello!',
    senderName: 'Jane Smith',
    senderProfileUrl: 'https://...'
}));
```

**Option B: REST API (Fallback)**
```
POST /traveller/chat/rooms/1/messages
{
    "content": "Hello!"
}
```

### Step 4: Mark as Read
```
PUT /traveller/chat/rooms/1/mark-read
```

---

## Best Practices

1. **Load History on Room Open**: Always fetch message history via REST API when opening a chat
2. **Real-time Updates**: Use WebSocket STOMP subscription for incoming messages
3. **Persistence**: Always send messages via REST API (they're automatically broadcast via WebSocket too)
4. **Pagination**: Use page/size parameters when fetching older messages
5. **Unread Count**: Show badge with unread count from `/unread-count` endpoint
6. **Error Handling**: Handle WebSocket disconnections and implement retry logic

---

## Example: Complete Chat Implementation

```javascript
class ChatManager {
    constructor() {
        this.stompClient = null;
        this.currentRoomId = null;
        this.messages = [];
    }

    async init() {
        const socket = new SockJS('/ws/chat');
        this.stompClient = Stomp.over(socket);
        
        return new Promise((resolve) => {
            this.stompClient.connect({}, () => {
                console.log('Connected to chat');
                resolve();
            });
        });
    }

    async openRoom(roomId) {
        // Load history
        const response = await fetch(`/traveller/chat/rooms/${roomId}/messages?page=0&size=50`);
        this.messages = await response.json();
        this.currentRoomId = roomId;

        // Subscribe to real-time
        this.stompClient.subscribe(`/topic/chat/room/${roomId}`, (msg) => {
            this.messages.push(JSON.parse(msg.body));
            this.render();
        });

        this.render();
    }

    async sendMessage(content) {
        // Persist via REST API
        const response = await fetch(`/traveller/chat/rooms/${this.currentRoomId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        // Also broadcast via WebSocket
        this.stompClient.send(`/app/chat/send/${this.currentRoomId}`, {}, JSON.stringify({
            content,
            senderName: 'Current User',
            senderProfileUrl: 'https://...'
        }));
    }

    render() {
        console.log('Rendering messages:', this.messages);
    }
}
```
