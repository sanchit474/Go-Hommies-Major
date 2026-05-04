# Go Hommies API Reference - Complete Testing Guide

## BASE URL
```
http://localhost:8080/traveller
```

---

## 1. PROFILE ENDPOINTS

### Get My Profile
```
GET /profile
Authorization: Bearer {token}

Response: 200 OK
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, New York",
  "gender": "Male",
  "birthday": "1990-01-15",
  "imageUrl": "https://res.cloudinary.com/...",
  "bio": "Love traveling and meeting new people",
  "location": "New York",
  "age": 34,
  "travelStyle": "Budget Traveler",
  "interests": ["hiking", "photography", "food"],
  "languages": ["English", "Spanish"],
  "isProfileComplete": true
}
```

### Update My Profile
```
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "456 Oak Ave, NYC",
  "gender": "Male",
  "birthday": "1990-01-15",
  "bio": "Adventurer and photographer",
  "location": "New York, USA",
  "travelStyle": "Budget Traveler",
  "interests": ["hiking", "photography", "food", "culture"],
  "languages": ["English", "Spanish", "French"]
}

Response: 200 OK
(Same as Get Profile)
```

### Upload Profile Picture
```
POST /profile/image
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
- file: (image file)

Response: 200 OK
{
  "imageUrl": "https://res.cloudinary.com/qcare/image/upload/.../profile.jpg"
}
```

---

## 2. TRIP ENDPOINTS

### Create Trip
```
POST /trips
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "destination": "Paris, France",
  "startDate": "2026-06-01",
  "endDate": "2026-06-15",
  "budget": 5000,
  "description": "Summer vacation to Paris",
  "isPublic": true
}

Response: 201 Created
{
  "id": 1,
  "destination": "Paris, France",
  "startDate": "2026-06-01",
  "endDate": "2026-06-15",
  "budget": 5000,
  "description": "Summer vacation to Paris",
  "isPublic": true,
  "createdBy": "John Doe",
  "createdAt": "2026-04-29T10:00:00",
  "updatedAt": "2026-04-29T10:00:00"
}
```

### Get My Trips
```
GET /trips
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "destination": "Paris, France",
    "startDate": "2026-06-01",
    "endDate": "2026-06-15",
    "budget": 5000,
    "description": "Summer vacation to Paris",
    "isPublic": true,
    "createdBy": "John Doe",
    "createdAt": "2026-04-29T10:00:00",
    "updatedAt": "2026-04-29T10:00:00"
  }
]
```

### Get Trip by ID
```
GET /trips/{tripId}
Authorization: Bearer {token}

Response: 200 OK
(Same as Get My Trips item)
```

### Get Public Trips
```
GET /trips/public

Response: 200 OK
[
  (list of public trips from all users)
]
```

### Update Trip
```
PUT /trips/{tripId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "destination": "Paris & Amsterdam",
  "startDate": "2026-06-01",
  "endDate": "2026-06-20",
  "budget": 6000,
  "description": "Updated: Extended trip",
  "isPublic": true
}

Response: 200 OK
(Updated trip details)
```

### Delete Trip
```
DELETE /trips/{tripId}
Authorization: Bearer {token}

Response: 204 No Content
```

---

## 3. TRIP JOIN REQUEST ENDPOINTS

### Request to Join Trip
```
POST /trips/{tripId}/request-join
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "message": "Hi! I'd love to join your Paris trip. I'm experienced traveler with budget-friendly mindset."
}

Response: 201 Created
{
  "id": 5,
  "tripId": 1,
  "requesterName": "Jane Smith",
  "requesterEmail": "jane@example.com",
  "requesterProfileUrl": "https://res.cloudinary.com/...",
  "message": "Hi! I'd love to join...",
  "status": "PENDING",
  "createdAt": "2026-04-29T11:00:00",
  "approvedAt": null,
  "rejectedAt": null
}
```

### Get Pending Join Requests (Trip Owner)
```
GET /trips/{tripId}/join-requests/pending
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 5,
    "tripId": 1,
    "requesterName": "Jane Smith",
    "requesterEmail": "jane@example.com",
    "requesterProfileUrl": "https://res.cloudinary.com/...",
    "message": "Hi! I'd love to join...",
    "status": "PENDING",
    "createdAt": "2026-04-29T11:00:00",
    "approvedAt": null,
    "rejectedAt": null
  }
]
```

### Get All Join Requests (Trip Owner)
```
GET /trips/{tripId}/join-requests
Authorization: Bearer {token}

Response: 200 OK
(All requests - PENDING, APPROVED, REJECTED)
```

### Approve Join Request
```
PUT /trips/{tripId}/join-requests/{requestId}/approve
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 5,
  "tripId": 1,
  "requesterName": "Jane Smith",
  "requesterEmail": "jane@example.com",
  "requesterProfileUrl": "https://res.cloudinary.com/...",
  "message": "Hi! I'd love to join...",
  "status": "APPROVED",
  "createdAt": "2026-04-29T11:00:00",
  "approvedAt": "2026-04-29T12:00:00",
  "rejectedAt": null
}
```

### Reject Join Request
```
PUT /trips/{tripId}/join-requests/{requestId}/reject
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 5,
  "tripId": 1,
  "requesterName": "Jane Smith",
  "requesterEmail": "jane@example.com",
  "requesterProfileUrl": "https://res.cloudinary.com/...",
  "message": "Hi! I'd love to join...",
  "status": "REJECTED",
  "createdAt": "2026-04-29T11:00:00",
  "approvedAt": null,
  "rejectedAt": "2026-04-29T12:30:00"
}
```

### Get Trip Members
```
GET /trips/{tripId}/members
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "travellerId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profileUrl": "https://res.cloudinary.com/...",
    "bio": "Travel enthusiast",
    "rating": 4.8,
    "tripsCount": 5
  },
  {
    "travellerId": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "profileUrl": "https://res.cloudinary.com/...",
    "bio": "Budget traveler",
    "rating": 4.6,
    "tripsCount": 3
  }
]
```

### Get My Joined Trips
```
GET /trips/joined/my-trips
Authorization: Bearer {token}

Response: 200 OK
[
  (list of trips you joined - not created)
]
```

### Leave Trip
```
DELETE /trips/{tripId}/leave
Authorization: Bearer {token}

Response: 204 No Content
```

---

## 4. DISCOVERY & SEARCH ENDPOINTS

### Search Travellers (Combined)
```
GET /discover/travellers?location=New York&interest=hiking&travelStyle=Budget
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "travellerId": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "location": "New York",
    "travelStyle": "Budget Traveler",
    "bio": "Love hiking and photography",
    "profileUrl": "https://res.cloudinary.com/...",
    "interests": ["hiking", "photography", "food"],
    "languages": ["English", "Spanish"],
    "rating": 4.6,
    "tripsCount": 3
  }
]
```

### Search by Location
```
GET /discover/travellers/location/Paris
Authorization: Bearer {token}

Response: 200 OK
[
  (travellers in Paris)
]
```

### Search by Interest
```
GET /discover/travellers/interest/hiking
Authorization: Bearer {token}

Response: 200 OK
[
  (travellers interested in hiking)
]
```

### Search by Travel Style
```
GET /discover/travellers/style/Budget%20Traveler
Authorization: Bearer {token}

Response: 200 OK
[
  (budget travellers)
]
```

### Discover Trips (Combined)
```
GET /discover/trips?destination=Paris&minBudget=3000&maxBudget=8000&startDateFrom=2026-06-01&endDateTo=2026-08-31&travelStyle=Budget
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "destination": "Paris, France",
    "startDate": "2026-06-01",
    "endDate": "2026-06-15",
    "budget": 5000,
    "description": "Summer vacation to Paris",
    "createdBy": "John Doe",
    "creatorProfileUrl": "https://res.cloudinary.com/...",
    "creatorRating": 4.8,
    "memberCount": 2,
    "createdAt": "2026-04-29T10:00:00"
  }
]
```

### Discover by Destination
```
GET /discover/trips/destination/Paris
Authorization: Bearer {token}

Response: 200 OK
[
  (trips to Paris)
]
```

### Discover by Budget Range
```
GET /discover/trips/budget?min=3000&max=8000
Authorization: Bearer {token}

Response: 200 OK
[
  (trips in budget range)
]
```

### Discover by Date Range
```
GET /discover/trips/dates?from=2026-06-01&to=2026-08-31
Authorization: Bearer {token}

Response: 200 OK
[
  (trips in date range)
]
```

### Discover by Travel Style
```
GET /discover/trips/style/Budget%20Traveler
Authorization: Bearer {token}

Response: 200 OK
[
  (trips with Budget travel style creator)
]
```

---

## 5. NOTIFICATION ENDPOINTS

### Get My Notifications
```
GET /notifications
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "tripId": 1,
    "senderName": "Jane Smith",
    "senderProfileUrl": "https://res.cloudinary.com/...",
    "type": "JOIN_REQUEST_SENT",
    "message": "Jane Smith wants to join your trip!",
    "isRead": false,
    "createdAt": "2026-04-29T11:00:00"
  }
]
```

### Get Unread Notifications
```
GET /notifications/unread
Authorization: Bearer {token}

Response: 200 OK
[
  (only unread notifications)
]
```

### Get Unread Count
```
GET /notifications/unread/count
Authorization: Bearer {token}

Response: 200 OK
{
  "unreadCount": 3
}
```

### Mark Notification as Read
```
PUT /notifications/{notificationId}/read
Authorization: Bearer {token}

Response: 204 No Content
```

### Mark All Notifications as Read
```
PUT /notifications/read-all
Authorization: Bearer {token}

Response: 204 No Content
```

### Delete Notification
```
DELETE /notifications/{notificationId}
Authorization: Bearer {token}

Response: 204 No Content
```

### Delete All Notifications
```
DELETE /notifications
Authorization: Bearer {token}

Response: 204 No Content
```

---

## 6. CHAT & MESSAGING ENDPOINTS

### Create/Get Direct Chat
```
POST /chat/direct/{otherTravellerId}
Authorization: Bearer {token}

Response: 201 Created
{
  "id": 1,
  "roomId": "direct_550e8400-e29b-41d4-a716-446655440000",
  "chatType": "DIRECT",
  "roomName": "Jane Smith",
  "otherUserName": "Jane Smith",
  "otherUserProfileUrl": "https://res.cloudinary.com/...",
  "tripId": null,
  "tripDestination": null,
  "lastMessage": null,
  "unreadCount": 0,
  "lastMessageTime": null,
  "createdAt": "2026-04-29T12:00:00"
}
```

### Create/Get Trip Group Chat
```
POST /chat/trip/{tripId}
Authorization: Bearer {token}

Response: 201 Created
{
  "id": 2,
  "roomId": "trip_1_a1b2c3d4-e5f6-41d4-a716-446655440001",
  "chatType": "TRIP_GROUP",
  "roomName": "Paris, France - Group Chat",
  "otherUserName": null,
  "otherUserProfileUrl": null,
  "tripId": 1,
  "tripDestination": "Paris, France",
  "lastMessage": null,
  "unreadCount": 0,
  "lastMessageTime": null,
  "createdAt": "2026-04-29T12:00:00"
}
```

### Get All Chat Rooms
```
GET /chat/rooms
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "roomId": "direct_550e8400...",
    "chatType": "DIRECT",
    "roomName": "Jane Smith",
    "otherUserName": "Jane Smith",
    "unreadCount": 2,
    "lastMessageTime": "2026-04-29T15:30:00",
    "createdAt": "2026-04-29T12:00:00"
  }
]
```

### Get Specific Chat Room
```
GET /chat/rooms/{roomId}
Authorization: Bearer {token}

Response: 200 OK
(ChatRoomDto - same as above)
```

### Send Message
```
POST /chat/rooms/{roomId}/messages
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "content": "Let's meet at the Eiffel Tower!"
}

Response: 201 Created
{
  "id": 11,
  "chatRoomId": 1,
  "senderName": "John Doe",
  "senderEmail": "john@example.com",
  "senderProfileUrl": "https://res.cloudinary.com/...",
  "content": "Let's meet at the Eiffel Tower!",
  "isRead": false,
  "sentAt": "2026-04-29T15:35:22"
}
```

### Get Chat History (Paginated)
```
GET /chat/rooms/{roomId}/messages?page=0&size=50
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 11,
    "chatRoomId": 1,
    "senderName": "John Doe",
    "senderEmail": "john@example.com",
    "senderProfileUrl": "https://res.cloudinary.com/...",
    "content": "Let's meet at the Eiffel Tower!",
    "isRead": false,
    "sentAt": "2026-04-29T15:35:22"
  }
]
```

### Get Unread Count
```
GET /chat/rooms/{roomId}/unread-count
Authorization: Bearer {token}

Response: 200 OK
{
  "unreadCount": 3
}
```

### Mark Room as Read
```
PUT /chat/rooms/{roomId}/mark-read
Authorization: Bearer {token}

Response: 204 No Content
```

### Mark Message as Read
```
PUT /chat/messages/{messageId}/read
Authorization: Bearer {token}

Response: 204 No Content
```

---

## WEBSOCKET ENDPOINTS (Real-Time Chat)

### Connect to WebSocket
```
WebSocket URL: ws://localhost:8080/ws/chat

JavaScript:
const socket = new SockJS('/ws/chat');
const stompClient = Stomp.over(socket);
stompClient.connect({}, onConnect);
```

### Subscribe to Chat Messages
```
Destination: /topic/chat/room/{roomId}

Message received:
{
  "roomId": 1,
  "content": "Hello everyone!",
  "senderName": "Jane Smith",
  "senderProfileUrl": "https://res.cloudinary.com/...",
  "sentTimestamp": 1714423522000
}
```

### Send Message via WebSocket
```
Send to: /app/chat/send/{roomId}

Message:
{
  "content": "Hello!",
  "senderName": "John Doe",
  "senderProfileUrl": "https://res.cloudinary.com/..."
}
```

### Join Chat Room
```
Send to: /app/chat/join/{roomId}

Notification received:
{
  "roomId": 1,
  "senderName": "System",
  "content": "John Doe joined the chat",
  "sentTimestamp": 1714423500000
}
```

### Leave Chat Room
```
Send to: /app/chat/leave/{roomId}

Notification received:
{
  "roomId": 1,
  "senderName": "System",
  "content": "John Doe left the chat",
  "sentTimestamp": 1714423600000
}
```

---

## TESTING FLOW - Complete User Journey

### Flow 1: User Registration & Profile Setup
```
1. Register (via Auth system)
2. POST /profile/image              (Upload profile pic)
3. PUT /profile                     (Complete profile)
4. GET /profile                     (Verify profile)
```

### Flow 2: Create Trip & Find Members
```
1. POST /trips                      (Create trip)
2. GET /discover/travellers?...     (Search for members)
3. GET /discover/trips?...          (Discover other trips)
4. GET /trips/{tripId}              (View created trip)
```

### Flow 3: Send Join Request & Join Trip
```
1. POST /trips/{tripId}/request-join (Request to join)
2. GET /notifications/unread        (Trip owner checks requests - SENDER gets notified)
3. PUT /trips/{tripId}/join-requests/{id}/approve (Owner approves)
4. GET /notifications               (Requester gets APPROVED notification)
5. GET /trips/joined/my-trips       (Verify joined trip)
6. GET /trips/{tripId}/members      (See trip members)
```

### Flow 4: Trip Collaboration - Chat & Messaging
```
1. POST /chat/trip/{tripId}         (Create group chat)
2. GET /chat/rooms                  (List all chat rooms)
3. GET /chat/rooms/{roomId}         (Open chat room)
4. GET /chat/rooms/{roomId}/messages?page=0&size=50 (Load history)
5. [WebSocket Connect]
   - SUBSCRIBE /topic/chat/room/{roomId}
   - SEND /app/chat/send/{roomId}   (Real-time message)
6. POST /chat/rooms/{roomId}/messages (REST fallback)
7. GET /chat/rooms/{roomId}/unread-count
8. PUT /chat/rooms/{roomId}/mark-read
```

### Flow 5: Direct Messaging Between Users
```
1. GET /discover/travellers?...     (Find a traveller)
2. POST /chat/direct/{travellerId}  (Create direct chat)
3. POST /chat/rooms/{roomId}/messages (Send message)
4. GET /chat/rooms/{roomId}/messages (Get history)
5. [WebSocket] Subscribe & send messages in real-time
```

### Complete Testing Sequence
```
Step 1: Profile Setup
├─ POST /profile/image
├─ PUT /profile
└─ GET /profile

Step 2: Create Trip
├─ POST /trips
├─ GET /trips
└─ GET /trips/{tripId}

Step 3: Search & Discover (using another user)
├─ GET /discover/travellers
├─ GET /discover/trips
└─ GET /trips/public

Step 4: Join Request Workflow
├─ POST /trips/{tripId}/request-join (as traveller)
├─ GET /notifications/unread (as trip owner)
├─ PUT /trips/{tripId}/join-requests/{id}/approve
└─ GET /notifications (as traveller)

Step 5: Trip Members
├─ GET /trips/{tripId}/members
└─ GET /trips/joined/my-trips

Step 6: Chat - Group Chat
├─ POST /chat/trip/{tripId}
├─ GET /chat/rooms
├─ GET /chat/rooms/{roomId}/messages
├─ POST /chat/rooms/{roomId}/messages
├─ WebSocket: Subscribe to /topic/chat/room/{roomId}
└─ WebSocket: Send to /app/chat/send/{roomId}

Step 7: Chat - Direct Message
├─ POST /chat/direct/{otherTravellerId}
└─ Repeat Step 6 with direct chat roomId

Step 8: Notifications
├─ GET /notifications
├─ GET /notifications/unread
├─ GET /notifications/unread/count
├─ PUT /notifications/{id}/read
└─ PUT /notifications/read-all
```

---

## Testing with cURL Examples

### 1. Create Trip
```bash
curl -X POST http://localhost:8080/traveller/trips \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Paris, France",
    "startDate": "2026-06-01",
    "endDate": "2026-06-15",
    "budget": 5000,
    "description": "Summer vacation",
    "isPublic": true
  }'
```

### 2. Create Direct Chat
```bash
curl -X POST http://localhost:8080/traveller/chat/direct/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Send Message
```bash
curl -X POST http://localhost:8080/traveller/chat/rooms/1/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello!"}'
```

### 4. Get Chat History
```bash
curl -X GET "http://localhost:8080/traveller/chat/rooms/1/messages?page=0&size=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Request to Join Trip
```bash
curl -X POST http://localhost:8080/traveller/trips/1/request-join \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi! Can I join?"}'
```

### 6. Approve Join Request
```bash
curl -X PUT http://localhost:8080/traveller/trips/1/join-requests/5/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. Get Notifications
```bash
curl -X GET http://localhost:8080/traveller/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Search Travellers
```bash
curl -X GET "http://localhost:8080/traveller/discover/travellers?location=Paris&interest=hiking&travelStyle=Budget" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Notes for Testing

1. **Authentication**: All endpoints require a bearer token in Authorization header (except public trip listing)
2. **Real-Time Chat**: WebSocket connection required for real-time messages; REST endpoint provides fallback
3. **Pagination**: Default page size is 50; adjust with `?page=X&size=Y`
4. **Timestamps**: Use ISO 8601 format: `2026-06-01T10:00:00`
5. **IDs**: Trip ID, Traveller ID, Room ID, Message ID are all Long integers
6. **Chat Room Access**: Ensure you have access before sending/reading messages
7. **Trip Ownership**: Only trip owner can approve/reject join requests and delete trip
