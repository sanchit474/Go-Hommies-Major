# Quick API Reference Card

## BASE URL: `http://localhost:8080/traveller`

| # | Method | Endpoint | Purpose | Auth |
|---|--------|----------|---------|------|
| **PROFILE** | | | | |
| 1 | GET | `/profile` | Get my profile | ✓ |
| 2 | PUT | `/profile` | Update profile | ✓ |
| 3 | POST | `/profile/image` | Upload profile picture | ✓ |
| **TRIPS** | | | | |
| 4 | POST | `/trips` | Create trip | ✓ |
| 5 | GET | `/trips` | Get my trips | ✓ |
| 6 | GET | `/trips/{tripId}` | Get trip details | ✓ |
| 7 | GET | `/trips/public` | Get all public trips | ✗ |
| 8 | PUT | `/trips/{tripId}` | Update trip | ✓ |
| 9 | DELETE | `/trips/{tripId}` | Delete trip | ✓ |
| **JOIN REQUESTS** | | | | |
| 10 | POST | `/trips/{tripId}/request-join` | Request to join trip | ✓ |
| 11 | GET | `/trips/{tripId}/join-requests/pending` | Get pending requests | ✓ |
| 12 | GET | `/trips/{tripId}/join-requests` | Get all requests | ✓ |
| 13 | PUT | `/trips/{tripId}/join-requests/{requestId}/approve` | Approve join request | ✓ |
| 14 | PUT | `/trips/{tripId}/join-requests/{requestId}/reject` | Reject join request | ✓ |
| 15 | GET | `/trips/{tripId}/members` | Get trip members | ✓ |
| 16 | GET | `/trips/joined/my-trips` | Get trips I joined | ✓ |
| 17 | DELETE | `/trips/{tripId}/leave` | Leave trip | ✓ |
| **DISCOVERY** | | | | |
| 18 | GET | `/discover/travellers?location=&interest=&travelStyle=` | Search travellers | ✓ |
| 19 | GET | `/discover/travellers/location/{location}` | Search by location | ✓ |
| 20 | GET | `/discover/travellers/interest/{interest}` | Search by interest | ✓ |
| 21 | GET | `/discover/travellers/style/{travelStyle}` | Search by style | ✓ |
| 22 | GET | `/discover/trips?destination=&minBudget=&maxBudget=&startDateFrom=&endDateTo=&travelStyle=` | Discover trips | ✓ |
| 23 | GET | `/discover/trips/destination/{destination}` | Discover by destination | ✓ |
| 24 | GET | `/discover/trips/budget?min=&max=` | Discover by budget | ✓ |
| 25 | GET | `/discover/trips/dates?from=&to=` | Discover by dates | ✓ |
| 26 | GET | `/discover/trips/style/{travelStyle}` | Discover by style | ✓ |
| **NOTIFICATIONS** | | | | |
| 27 | GET | `/notifications` | Get all notifications | ✓ |
| 28 | GET | `/notifications/unread` | Get unread notifications | ✓ |
| 29 | GET | `/notifications/unread/count` | Get unread count | ✓ |
| 30 | PUT | `/notifications/{notificationId}/read` | Mark as read | ✓ |
| 31 | PUT | `/notifications/read-all` | Mark all as read | ✓ |
| 32 | DELETE | `/notifications/{notificationId}` | Delete notification | ✓ |
| 33 | DELETE | `/notifications` | Delete all notifications | ✓ |
| **CHAT** | | | | |
| 34 | POST | `/chat/direct/{otherTravellerId}` | Create/get direct chat | ✓ |
| 35 | POST | `/chat/trip/{tripId}` | Create/get trip group chat | ✓ |
| 36 | GET | `/chat/rooms` | Get all my chat rooms | ✓ |
| 37 | GET | `/chat/rooms/{roomId}` | Get chat room details | ✓ |
| 38 | POST | `/chat/rooms/{roomId}/messages` | Send message | ✓ |
| 39 | GET | `/chat/rooms/{roomId}/messages?page=0&size=50` | Get message history | ✓ |
| 40 | GET | `/chat/rooms/{roomId}/unread-count` | Get unread count | ✓ |
| 41 | PUT | `/chat/rooms/{roomId}/mark-read` | Mark all as read | ✓ |
| 42 | PUT | `/chat/messages/{messageId}/read` | Mark message as read | ✓ |

---

## WEBSOCKET ENDPOINTS

| Endpoint | Direction | Purpose |
|----------|-----------|---------|
| `/ws/chat` | CONNECT | Connect to WebSocket |
| `/topic/chat/room/{roomId}` | SUBSCRIBE | Receive messages |
| `/app/chat/send/{roomId}` | SEND | Broadcast message |
| `/app/chat/join/{roomId}` | SEND | User joined notification |
| `/app/chat/leave/{roomId}` | SEND | User left notification |

---

## TEST FLOW MAP

```
┌─────────────────────────────────────────────────────────┐
│                 USER COMPLETE JOURNEY                    │
└─────────────────────────────────────────────────────────┘

Step 1: PROFILE SETUP
├─ #3 POST /profile/image              (Upload avatar)
├─ #2 PUT /profile                     (Complete profile)
└─ #1 GET /profile                     (Verify)

Step 2: CREATE TRIP
├─ #4 POST /trips                      (Create trip)
├─ #6 GET /trips/{tripId}              (View)
└─ #5 GET /trips                       (List my trips)

Step 3: DISCOVER & SEARCH
├─ #18 GET /discover/travellers        (Find members)
├─ #22 GET /discover/trips             (Find other trips)
└─ #7 GET /trips/public                (Browse public trips)

Step 4: JOIN REQUEST & MEMBERSHIP
├─ #10 POST /trips/{tripId}/request-join (Request to join)
├─ #29 GET /notifications              (Trip owner checks)
├─ #13 PUT /trips/{tripId}/join-requests/{id}/approve (Approve)
├─ #28 GET /notifications              (Member gets notified)
├─ #15 GET /trips/{tripId}/members     (See members)
└─ #16 GET /trips/joined/my-trips      (See joined trips)

Step 5: CHAT & COMMUNICATION ⭐ NEW
├─ GROUP CHAT:
│  ├─ #35 POST /chat/trip/{tripId}     (Create group chat)
│  ├─ #37 GET /chat/rooms/{roomId}     (Open room)
│  ├─ #39 GET /chat/rooms/{roomId}/messages (Load history)
│  ├─ WS CONNECT /ws/chat              (Connect WebSocket)
│  ├─ WS SUBSCRIBE /topic/chat/room/{roomId}
│  ├─ WS SEND /app/chat/send/{roomId}  (Real-time message)
│  └─ #40 GET /chat/rooms/{roomId}/unread-count
│
└─ DIRECT CHAT:
   ├─ #34 POST /chat/direct/{travellerId} (Create DM)
   ├─ #38 POST /chat/rooms/{roomId}/messages (Send message)
   ├─ #36 GET /chat/rooms              (List all chats)
   └─ #39 GET /chat/rooms/{roomId}/messages (Read history)

Step 6: NOTIFICATIONS
├─ #27 GET /notifications              (Get all)
├─ #28 GET /notifications/unread       (Get unread)
├─ #29 GET /notifications/unread/count (Count)
└─ #30 PUT /notifications/{id}/read    (Mark read)
```

---

## COMMON TEST SEQUENCES

### Sequence 1: Two Users Joining Same Trip
```
User A (John):
1. #4 POST /trips                    → Create Paris trip (ID: 1)
2. #1 GET /profile                   → Get profile

User B (Jane):  
1. #22 GET /discover/trips?destination=Paris → Find trips
2. #6 GET /trips/1                   → View trip details
3. #10 POST /trips/1/request-join    → Request to join
4. #29 GET /notifications            → User A checks requests
5. #13 PUT /trips/1/join-requests/1/approve → User A approves

User A & B:
6. #15 GET /trips/1/members          → See each other
7. #35 POST /chat/trip/1             → Create group chat
8. #38 POST /chat/rooms/2/messages   → Exchange messages
```

### Sequence 2: Direct Messaging After Discovery
```
User A:
1. #18 GET /discover/travellers?interest=hiking → Find hikers
2. #34 POST /chat/direct/2           → Open DM with hiker
3. #39 GET /chat/rooms/1/messages    → Load history
4. #38 POST /chat/rooms/1/messages   → Send message

User B:
1. #36 GET /chat/rooms               → See DM notification
2. #37 GET /chat/rooms/1             → Open chat
3. #39 GET /chat/rooms/1/messages    → See message
4. #38 POST /chat/rooms/1/messages   → Reply
```

### Sequence 3: WebSocket Real-Time Chat
```
Both Users:
1. WS CONNECT ws://localhost:8080/ws/chat
2. WS SUBSCRIBE /topic/chat/room/2
3. User A: WS SEND /app/chat/send/2 → "Hello!"
4. User B: Receives message instantly via WebSocket
5. User B: WS SEND /app/chat/send/2 → "Hi there!"
6. User A: Receives reply instantly
```

---

## cURL Testing Commands

### Create Trip
```bash
curl -X POST http://localhost:8080/traveller/trips \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"destination":"Paris","startDate":"2026-06-01","endDate":"2026-06-15","budget":5000,"description":"Summer trip","isPublic":true}'
```

### Search Travellers
```bash
curl "http://localhost:8080/traveller/discover/travellers?location=Paris&interest=hiking" \
  -H "Authorization: Bearer TOKEN"
```

### Request to Join
```bash
curl -X POST http://localhost:8080/traveller/trips/1/request-join \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Can I join?"}'
```

### Get Notifications
```bash
curl http://localhost:8080/traveller/notifications \
  -H "Authorization: Bearer TOKEN"
```

### Create Direct Chat
```bash
curl -X POST http://localhost:8080/traveller/chat/direct/2 \
  -H "Authorization: Bearer TOKEN"
```

### Send Chat Message
```bash
curl -X POST http://localhost:8080/traveller/chat/rooms/1/messages \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Let'\''s meet!"}'
```

### Get Chat History
```bash
curl "http://localhost:8080/traveller/chat/rooms/1/messages?page=0&size=50" \
  -H "Authorization: Bearer TOKEN"
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful GET/PUT |
| 201 | Created - Successful POST |
| 204 | No Content - Successful DELETE/PUT (no response body) |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Not allowed (e.g., not trip owner) |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## Example: Complete Journey in Postman/cURL

```bash
# Setup: Create two test users and tokens first

# USER A: John
TOKEN_A="token_for_john"

# USER B: Jane  
TOKEN_B="token_for_jane"

# Step 1: John creates a trip
TRIP=$(curl -s -X POST http://localhost:8080/traveller/trips \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"destination":"Paris","startDate":"2026-06-01","endDate":"2026-06-15","budget":5000,"isPublic":true}')

TRIP_ID=$(echo $TRIP | jq '.id')
echo "Trip created: $TRIP_ID"

# Step 2: Jane discovers the trip
curl -s http://localhost:8080/traveller/discover/trips/destination/Paris \
  -H "Authorization: Bearer $TOKEN_B" | jq

# Step 3: Jane requests to join
REQUESTS=$(curl -s -X POST http://localhost:8080/traveller/trips/$TRIP_ID/request-join \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi! Can I join?"}')

REQUEST_ID=$(echo $REQUESTS | jq '.id')
echo "Request created: $REQUEST_ID"

# Step 4: John approves Jane
curl -s -X PUT http://localhost:8080/traveller/trips/$TRIP_ID/join-requests/$REQUEST_ID/approve \
  -H "Authorization: Bearer $TOKEN_A"

# Step 5: They create a group chat
CHAT=$(curl -s -X POST http://localhost:8080/traveller/chat/trip/$TRIP_ID \
  -H "Authorization: Bearer $TOKEN_A")

ROOM_ID=$(echo $CHAT | jq '.id')
echo "Chat room created: $ROOM_ID"

# Step 6: Exchange messages
curl -s -X POST http://localhost:8080/traveller/chat/rooms/$ROOM_ID/messages \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"content":"Looking forward to Paris!"}' | jq

curl -s -X POST http://localhost:8080/traveller/chat/rooms/$ROOM_ID/messages \
  -H "Authorization: Bearer $TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"content":"Me too! When do we meet?"}'| jq

# Step 7: View chat history
curl -s "http://localhost:8080/traveller/chat/rooms/$ROOM_ID/messages?page=0&size=50" \
  -H "Authorization: Bearer $TOKEN_A" | jq
```
