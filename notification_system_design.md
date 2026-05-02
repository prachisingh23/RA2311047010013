# Notification System Design

---

## Stage 1: API Design

### Core Actions
- Fetch notifications
- Mark notification as read
- Send notification
- Get unread notifications

### APIs

#### 1. Get Notifications
GET /notifications

Response:
{
  "notifications": [
    {
      "id": "1",
      "type": "Placement",
      "message": "Company hiring",
      "timestamp": "2026-04-22"
    }
  ]
}

---

#### 2. Mark as Read
POST /notifications/read

Request:
{
  "id": "1"
}

Response:
{
  "status": "success"
}

---

#### 3. Send Notification
POST /notifications/send

Request:
{
  "type": "Event",
  "message": "Tech Fest"
}

---

### Real-Time Mechanism
- Use WebSockets for live updates
- Alternative: Firebase / Push Notifications

---

## Stage 2: Database Design

### Suggested DB: PostgreSQL

### Table: notifications
- id (PK)
- studentID
- type
- message
- isRead
- createdAt

### Problem at scale:
- slow queries
- large data

### Solution:
- indexing (studentID, isRead)
- partitioning
- caching

---

## Stage 3: Query Optimization

### Given Query:
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

### Issues:
- no index → slow
- scanning full table

### Fix:
- add index on (studentID, isRead, createdAt)

### Why not index everything?
- slows down insert
- wastes memory

### New Query:
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

---

### Placement Query:
SELECT * FROM notifications
WHERE notification_type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';

---

## Stage 4: Performance Improvement

### Problem:
- DB overloaded

### Solutions:
1. Caching (Redis)
2. Pagination
3. Lazy loading
4. Background jobs

### Tradeoffs:
- Cache → faster but stale data
- Pagination → limited data per request

---

## Stage 5: System Design Improvement

### Issues in given code:
- sequential processing → slow
- failure handling missing

### Improved Approach:
- use queue (Kafka/RabbitMQ)
- retry mechanism

### Updated Pseudocode:

function notify_all(student_ids, message):
  push_to_queue(student_ids, message)

worker:
  for each job:
    try:
      send_email()
      save_to_db()
      push_notification()
    catch:
      retry()

---

## Stage 6: Priority Inbox

### Logic:
Priority = weight + recency

Weights:
- Placement = 3
- Result = 2
- Event = 1

### Code (JS):

function getPriority(type):
  if(type === "Placement") return 3;
  if(type === "Result") return 2;
  return 1;

function getTopNotifications(notifications):
  return notifications
    .map(n => ({
      ...n,
      score: getPriority(n.Type)
    }))
    .sort((a,b) => b.score - a.score || new Date(b.Timestamp) - new Date(a.Timestamp))
    .slice(0,10);

---

### Efficient Approach:
- Use Min Heap
- Maintain top 10 dynamically