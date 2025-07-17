# Simple SMS System Design

## 🎯 **Philosophy: Keep It Simple**

### Core Principle
- **One table, three endpoints, zero complexity**
- **Leverage existing data (courses, leads) instead of duplicating**
- **Use AWS SNS built-in delivery tracking**

---

## 📊 **Single Table Design**

### Table: `sms_messages`
```sql
{
  "id": "msg_123",                    // Primary key
  "provider_id": "provider_456",      // Multi-tenant isolation
  "message": "Welcome to React course!",
  "recipient_type": "course",         // 'individual', 'course', 'lead_group'
  "recipient_ids": ["course_123"],    // Array of IDs to resolve
  "total_count": 45,                  // Total SMS sent
  "delivered_count": 43,              // Updated via SNS webhook
  "failed_count": 2,                  // Updated via SNS webhook
  "status": "sent",                   // 'sending', 'sent', 'failed'
  "cost": 2.70,                       // Total cost
  "sent_at": "2025-07-14T10:00:00Z",
  "updated_at": "2025-07-14T10:05:00Z"
}
```

**Why this works:**
- **No recipient storage** - Use existing participants/leads tables
- **Minimal fields** - Only what's actually needed for history
- **AWS SNS integration** - Delivery status comes from SNS webhooks

---

## 🔌 **Three Simple Endpoints**

### 1. `POST /api/sms/send`
```json
{
  "message": "Welcome to React course!",
  "recipients": [
    {"type": "course", "id": "course_123"},
    {"type": "lead_group", "status": "new"}
  ]
}
```

**Logic:**
1. Resolve recipients from existing tables
2. Send via AWS SNS (batch or individual)
3. Store message record with initial status
4. Return success/failure

### 2. `GET /api/sms/history`
```json
{
  "messages": [
    {
      "id": "msg_123",
      "message": "Welcome to React course!",
      "total_count": 45,
      "delivered_count": 43,
      "failed_count": 2,
      "status": "sent",
      "cost": 2.70,
      "sent_at": "2025-07-14T10:00:00Z"
    }
  ]
}
```

**Logic:**
- Simple query by provider_id
- Order by sent_at DESC
- Basic pagination (offset/limit)

### 3. `POST /api/sms/delivery-webhook` (Internal)
```json
{
  "message_id": "msg_123",
  "phone": "+1-555-0123",
  "status": "delivered",
  "timestamp": "2025-07-14T10:05:00Z"
}
```

**Logic:**
- Receive SNS delivery notifications
- Update delivered_count/failed_count
- Mark overall status as 'sent' when done

---

## 🔄 **Data Flow**

### Send SMS:
1. **Frontend** → `POST /api/sms/send`
2. **Backend** → Resolve recipients from existing tables
3. **Backend** → Send via AWS SNS
4. **Backend** → Store message record
5. **AWS SNS** → Deliver SMS
6. **AWS SNS** → Send delivery status to webhook
7. **Backend** → Update delivery counts

### View History:
1. **Frontend** → `GET /api/sms/history`
2. **Backend** → Query sms_messages table
3. **Backend** → Return formatted history

---

## 🏗️ **Implementation Details**

### Recipient Resolution
```python
def resolve_recipients(recipients, provider_id):
    phone_numbers = []
    
    for recipient in recipients:
        if recipient['type'] == 'course':
            # Get enrolled participants
            course_id = recipient['id']
            participants = get_course_participants(course_id, provider_id)
            phone_numbers.extend([p.phone for p in participants])
            
        elif recipient['type'] == 'lead_group':
            # Get leads by status
            status = recipient.get('status', 'new')
            leads = get_leads_by_status(status, provider_id)
            phone_numbers.extend([l.phone for l in leads])
            
        elif recipient['type'] == 'individual':
            # Direct phone number
            phone_numbers.append(recipient['phone'])
    
    return list(set(phone_numbers))  # Remove duplicates
```

### AWS SNS Integration
```python
def send_sms_bulk(phone_numbers, message):
    message_id = str(uuid.uuid4())
    
    # Store initial record
    store_sms_message({
        'id': message_id,
        'message': message,
        'total_count': len(phone_numbers),
        'status': 'sending',
        'sent_at': datetime.utcnow()
    })
    
    # Send via SNS
    for phone in phone_numbers:
        sns.publish(
            PhoneNumber=phone,
            Message=message,
            MessageAttributes={
                'message_id': {'DataType': 'String', 'StringValue': message_id}
            }
        )
    
    return message_id
```

### Delivery Webhook
```python
@app.route('/api/sms/delivery-webhook', methods=['POST'])
def handle_delivery_status():
    data = request.json
    message_id = data['message_id']
    status = data['status']
    
    if status == 'delivered':
        increment_delivered_count(message_id)
    else:
        increment_failed_count(message_id)
    
    return {'status': 'ok'}
```

---

## ✅ **AWS SNS Delivery Status**

### What You Get For Free:
- **Individual message tracking** per phone number
- **Delivery confirmations** via CloudWatch Logs
- **Failure reasons** (invalid number, carrier blocked, etc.)
- **Cost tracking** per message
- **Automatic retries** for temporary failures

### What You Need to Build:
- **Webhook endpoint** to receive delivery notifications
- **CloudWatch Logs → Lambda → Your webhook** pipeline
- **Aggregate counting** in your database

### Setup:
1. Enable SNS delivery status logging
2. Create Lambda function to process CloudWatch Logs
3. Lambda calls your webhook with delivery status
4. Your webhook updates message counts

---

## 🎯 **Why This Works**

### Simplicity Benefits:
- **One table** = Easy to understand and maintain
- **Three endpoints** = Minimal API surface
- **Existing data** = No duplicate recipient storage
- **AWS handles complexity** = Delivery tracking built-in

### Bulk Messaging Support:
- **Course participants** = Automatic bulk to all enrolled students
- **Lead groups** = Bulk to leads by status (new, qualified, etc.)
- **Custom lists** = Can easily add more recipient types

### Scalability:
- **SNS handles scale** = Can send thousands of SMS
- **Simple queries** = Fast database operations
- **Minimal storage** = Only essential history data

---

## 🚀 **Migration Path**

### From Current Complex System:
1. **Keep existing UI** (if users like it)
2. **Replace backend** with these 3 endpoints
3. **Remove unnecessary tables** and complexity
4. **Add SNS delivery webhook** for real status

### Result:
- **90% less code** to maintain
- **100% same functionality** for users
- **Better delivery tracking** via AWS SNS
- **Simpler debugging** and monitoring

---

## 💡 **Bottom Line**

**Current system**: 15 tables, 20 endpoints, complex recipient management
**This system**: 1 table, 3 endpoints, leverages existing data

**Same user experience, 90% less complexity.**