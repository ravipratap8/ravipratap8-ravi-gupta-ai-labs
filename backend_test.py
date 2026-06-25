#!/usr/bin/env python3
"""
Comprehensive backend API test for AI EventOps Assistant
Tests all endpoints under /api prefix with MongoDB persistence
"""

import requests
import json
import time

# Base URL from .env
BASE_URL = "https://ravi-ai-labs.preview.emergentagent.com/api"

def log_test(name, passed, details=""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    return passed

def check_no_mongo_id(data, path=""):
    """Recursively check that no _id field exists in response"""
    if isinstance(data, dict):
        if "_id" in data:
            return False, f"Found _id at {path}"
        for key, value in data.items():
            result, msg = check_no_mongo_id(value, f"{path}.{key}")
            if not result:
                return result, msg
    elif isinstance(data, list):
        for i, item in enumerate(data):
            result, msg = check_no_mongo_id(item, f"{path}[{i}]")
            if not result:
                return result, msg
    return True, ""

def test_health():
    """Test GET /api/ health check"""
    print("\n=== 1. HEALTH & SEED ===")
    try:
        resp = requests.get(f"{BASE_URL}/", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            "message" in data and
            "status" in data and
            data["status"] == "ok"
        )
        log_test("GET /api/ health check", passed, f"Status: {resp.status_code}, Data: {data}")
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in health response", no_id, msg if not no_id else "")
        
        return passed and no_id
    except Exception as e:
        log_test("GET /api/ health check", False, str(e))
        return False

def test_seed():
    """Test POST /api/seed"""
    try:
        resp = requests.post(f"{BASE_URL}/seed", timeout=15)
        data = resp.json()
        
        passed = resp.status_code == 200 and "message" in data
        log_test("POST /api/seed reseed", passed, f"Status: {resp.status_code}, Message: {data.get('message')}")
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in seed response", no_id, msg if not no_id else "")
        
        return passed and no_id
    except Exception as e:
        log_test("POST /api/seed reseed", False, str(e))
        return False

def test_dashboard_stats():
    """Test GET /api/dashboard/stats"""
    print("\n=== 2. DASHBOARD ===")
    try:
        resp = requests.get(f"{BASE_URL}/dashboard/stats", timeout=10)
        data = resp.json()
        
        required_fields = [
            "totalEvents", "pendingApprovals", "newEnquiries", 
            "hotLeads", "contentGenerated", "aiSafety", "recentActivity"
        ]
        
        passed = (
            resp.status_code == 200 and
            all(field in data for field in required_fields) and
            isinstance(data["aiSafety"], dict) and
            isinstance(data["recentActivity"], list)
        )
        
        log_test("GET /api/dashboard/stats", passed, 
                f"Status: {resp.status_code}, Events: {data.get('totalEvents')}, Pending: {data.get('pendingApprovals')}")
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in dashboard response", no_id, msg if not no_id else "")
        
        return passed and no_id
    except Exception as e:
        log_test("GET /api/dashboard/stats", False, str(e))
        return False

def test_events_crud():
    """Test Events CRUD operations"""
    print("\n=== 3. EVENTS CRUD ===")
    all_passed = True
    
    # GET all events
    try:
        resp = requests.get(f"{BASE_URL}/events", timeout=10)
        events = resp.json()
        
        passed = resp.status_code == 200 and isinstance(events, list) and len(events) >= 6
        log_test("GET /api/events (list all)", passed, f"Status: {resp.status_code}, Count: {len(events)}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(events)
        log_test("No _id in events list", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
        # Store first event ID for later tests
        first_event_id = events[0]["id"] if events else None
        
    except Exception as e:
        log_test("GET /api/events (list all)", False, str(e))
        all_passed = False
        first_event_id = None
    
    # GET with status filter
    try:
        resp = requests.get(f"{BASE_URL}/events?status=Published", timeout=10)
        published = resp.json()
        
        passed = (
            resp.status_code == 200 and 
            isinstance(published, list) and
            all(e.get("status") == "Published" for e in published)
        )
        log_test("GET /api/events?status=Published", passed, f"Count: {len(published)}")
        all_passed = all_passed and passed
        
    except Exception as e:
        log_test("GET /api/events?status=Published", False, str(e))
        all_passed = False
    
    # GET with search query
    try:
        resp = requests.get(f"{BASE_URL}/events?q=auckland", timeout=10)
        filtered = resp.json()
        
        passed = resp.status_code == 200 and isinstance(filtered, list)
        log_test("GET /api/events?q=auckland", passed, f"Count: {len(filtered)}")
        all_passed = all_passed and passed
        
    except Exception as e:
        log_test("GET /api/events?q=auckland", False, str(e))
        all_passed = False
    
    # POST create event
    created_event_id = None
    try:
        new_event = {
            "name": "Test Music Festival 2025",
            "city": "Auckland",
            "venue": "Vector Arena",
            "date": "2025-12-15",
            "status": "Draft"
        }
        resp = requests.post(f"{BASE_URL}/events", json=new_event, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            "id" in data and
            data.get("name") == new_event["name"] and
            data.get("city") == new_event["city"]
        )
        log_test("POST /api/events (create)", passed, f"Status: {resp.status_code}, ID: {data.get('id')}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in created event", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
        if passed:
            created_event_id = data["id"]
        
    except Exception as e:
        log_test("POST /api/events (create)", False, str(e))
        all_passed = False
    
    # POST without required field (should fail)
    try:
        resp = requests.post(f"{BASE_URL}/events", json={"city": "Auckland"}, timeout=10)
        data = resp.json()
        
        passed = resp.status_code == 400 and "error" in data
        log_test("POST /api/events (missing name -> 400)", passed, f"Status: {resp.status_code}")
        all_passed = all_passed and passed
        
    except Exception as e:
        log_test("POST /api/events (missing name -> 400)", False, str(e))
        all_passed = False
    
    # GET single event with messages
    if first_event_id:
        try:
            resp = requests.get(f"{BASE_URL}/events/{first_event_id}", timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                "id" in data and
                "messages" in data and
                isinstance(data["messages"], list)
            )
            log_test(f"GET /api/events/:id (with messages)", passed, 
                    f"Status: {resp.status_code}, Messages: {len(data.get('messages', []))}")
            all_passed = all_passed and passed
            
            # Check no _id
            no_id, msg = check_no_mongo_id(data)
            log_test("No _id in event detail", no_id, msg if not no_id else "")
            all_passed = all_passed and no_id
            
        except Exception as e:
            log_test(f"GET /api/events/:id", False, str(e))
            all_passed = False
    
    # GET invalid event ID
    try:
        resp = requests.get(f"{BASE_URL}/events/invalid-id-12345", timeout=10)
        passed = resp.status_code == 404
        log_test("GET /api/events/:id (invalid -> 404)", passed, f"Status: {resp.status_code}")
        all_passed = all_passed and passed
        
    except Exception as e:
        log_test("GET /api/events/:id (invalid -> 404)", False, str(e))
        all_passed = False
    
    # PUT update event
    if created_event_id:
        try:
            update = {"status": "Published", "venue": "Updated Venue"}
            resp = requests.put(f"{BASE_URL}/events/{created_event_id}", json=update, timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("status") == "Published" and
                data.get("venue") == "Updated Venue"
            )
            log_test("PUT /api/events/:id (update)", passed, f"Status: {resp.status_code}")
            all_passed = all_passed and passed
            
            # Check no _id
            no_id, msg = check_no_mongo_id(data)
            log_test("No _id in updated event", no_id, msg if not no_id else "")
            all_passed = all_passed and no_id
            
        except Exception as e:
            log_test("PUT /api/events/:id (update)", False, str(e))
            all_passed = False
    
    # DELETE event
    if created_event_id:
        try:
            resp = requests.delete(f"{BASE_URL}/events/{created_event_id}", timeout=10)
            passed = resp.status_code == 200
            log_test("DELETE /api/events/:id", passed, f"Status: {resp.status_code}")
            all_passed = all_passed and passed
            
        except Exception as e:
            log_test("DELETE /api/events/:id", False, str(e))
            all_passed = False
    
    return all_passed

def test_messages_ai_inbox():
    """Test Messages / AI Inbox"""
    print("\n=== 4. MESSAGES / AI INBOX ===")
    all_passed = True
    
    # GET all messages
    try:
        resp = requests.get(f"{BASE_URL}/messages", timeout=10)
        messages = resp.json()
        
        passed = resp.status_code == 200 and isinstance(messages, list)
        log_test("GET /api/messages (list all)", passed, f"Status: {resp.status_code}, Count: {len(messages)}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(messages)
        log_test("No _id in messages list", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("GET /api/messages (list all)", False, str(e))
        all_passed = False
    
    # GET with status filter
    try:
        resp = requests.get(f"{BASE_URL}/messages?status=Needs Review", timeout=10)
        filtered = resp.json()
        
        passed = (
            resp.status_code == 200 and 
            isinstance(filtered, list) and
            all(m.get("status") == "Needs Review" for m in filtered)
        )
        log_test("GET /api/messages?status=Needs Review", passed, f"Count: {len(filtered)}")
        all_passed = all_passed and passed
        
    except Exception as e:
        log_test("GET /api/messages?status=Needs Review", False, str(e))
        all_passed = False
    
    # Get an event ID for message creation
    event_id = None
    try:
        resp = requests.get(f"{BASE_URL}/events", timeout=10)
        events = resp.json()
        if events:
            event_id = events[0]["id"]
    except:
        pass
    
    # POST create message with AI classification
    created_message_id = None
    try:
        new_message = {
            "message": "Is parking available at the venue?",
            "customerName": "Sarah Johnson",
            "eventId": event_id
        }
        resp = requests.post(f"{BASE_URL}/messages", json=new_message, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            "id" in data and
            "aiSuggestedReply" in data and
            "confidence" in data and
            "category" in data and
            "riskLevel" in data and
            data.get("status") == "Needs Review"
        )
        log_test("POST /api/messages (with AI classification)", passed, 
                f"Status: {resp.status_code}, Category: {data.get('category')}, Risk: {data.get('riskLevel')}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in created message", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
        if passed:
            created_message_id = data["id"]
        
    except Exception as e:
        log_test("POST /api/messages (with AI classification)", False, str(e))
        all_passed = False
    
    # PUT update message status
    if created_message_id:
        try:
            update = {"status": "Sent"}
            resp = requests.put(f"{BASE_URL}/messages/{created_message_id}", json=update, timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and data.get("status") == "Sent"
            log_test("PUT /api/messages/:id (update status)", passed, f"Status: {resp.status_code}")
            all_passed = all_passed and passed
            
            # Check no _id
            no_id, msg = check_no_mongo_id(data)
            log_test("No _id in updated message", no_id, msg if not no_id else "")
            all_passed = all_passed and no_id
            
        except Exception as e:
            log_test("PUT /api/messages/:id (update status)", False, str(e))
            all_passed = False
    
    return all_passed

def test_approvals():
    """Test Approvals (human-in-the-loop)"""
    print("\n=== 5. APPROVALS ===")
    all_passed = True
    
    # GET approvals queue
    try:
        resp = requests.get(f"{BASE_URL}/approvals", timeout=10)
        approvals = resp.json()
        
        passed = (
            resp.status_code == 200 and 
            isinstance(approvals, list) and
            all(m.get("status") in ["Draft", "Needs Review"] for m in approvals)
        )
        log_test("GET /api/approvals (Draft + Needs Review)", passed, f"Count: {len(approvals)}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(approvals)
        log_test("No _id in approvals list", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
        # Store an approval ID for testing
        approval_id = approvals[0]["id"] if approvals else None
        
    except Exception as e:
        log_test("GET /api/approvals", False, str(e))
        all_passed = False
        approval_id = None
    
    # Create a message to approve
    try:
        new_message = {
            "message": "Can I get a refund for my ticket?",
            "customerName": "Test Customer"
        }
        resp = requests.post(f"{BASE_URL}/messages", json=new_message, timeout=10)
        data = resp.json()
        if resp.status_code == 201:
            approval_id = data["id"]
    except:
        pass
    
    # POST approve with edited reply
    if approval_id:
        try:
            approve_data = {"editedReply": "Thank you for your message. Our refund policy allows full refunds up to 7 days before the event."}
            resp = requests.post(f"{BASE_URL}/approvals/{approval_id}/approve", json=approve_data, timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("status") == "Approved" and
                data.get("aiSuggestedReply") == approve_data["editedReply"]
            )
            log_test("POST /api/approvals/:id/approve (with editedReply)", passed, f"Status: {resp.status_code}")
            all_passed = all_passed and passed
            
            # Check no _id
            no_id, msg = check_no_mongo_id(data)
            log_test("No _id in approved message", no_id, msg if not no_id else "")
            all_passed = all_passed and no_id
            
        except Exception as e:
            log_test("POST /api/approvals/:id/approve", False, str(e))
            all_passed = False
    
    # Create another message to reject
    reject_id = None
    try:
        new_message = {
            "message": "We want to sponsor your event",
            "customerName": "Brand Manager"
        }
        resp = requests.post(f"{BASE_URL}/messages", json=new_message, timeout=10)
        data = resp.json()
        if resp.status_code == 201:
            reject_id = data["id"]
    except:
        pass
    
    # POST reject
    if reject_id:
        try:
            resp = requests.post(f"{BASE_URL}/approvals/{reject_id}/reject", timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and data.get("status") == "Draft"
            log_test("POST /api/approvals/:id/reject", passed, f"Status: {resp.status_code}")
            all_passed = all_passed and passed
            
            # Check no _id
            no_id, msg = check_no_mongo_id(data)
            log_test("No _id in rejected message", no_id, msg if not no_id else "")
            all_passed = all_passed and no_id
            
        except Exception as e:
            log_test("POST /api/approvals/:id/reject", False, str(e))
            all_passed = False
    
    return all_passed

def test_ai_endpoints():
    """Test AI mock endpoints"""
    print("\n=== 6. AI MOCK ENDPOINTS ===")
    all_passed = True
    
    # POST classify-message (refund)
    try:
        payload = {"message": "Can I get a refund?"}
        resp = requests.post(f"{BASE_URL}/ai/classify-message", json=payload, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("category") == "Refund Request" and
            data.get("riskLevel") == "High"
        )
        log_test("POST /api/ai/classify-message (refund)", passed, 
                f"Category: {data.get('category')}, Risk: {data.get('riskLevel')}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in classify response", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("POST /api/ai/classify-message (refund)", False, str(e))
        all_passed = False
    
    # POST classify-message (sponsorship)
    try:
        payload = {"message": "We want to sponsor your event"}
        resp = requests.post(f"{BASE_URL}/ai/classify-message", json=payload, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("category") == "Sponsorship Enquiry"
        )
        log_test("POST /api/ai/classify-message (sponsorship)", passed, 
                f"Category: {data.get('category')}")
        all_passed = all_passed and passed
        
    except Exception as e:
        log_test("POST /api/ai/classify-message (sponsorship)", False, str(e))
        all_passed = False
    
    # Get an event ID for chat
    event_id = None
    try:
        resp = requests.get(f"{BASE_URL}/events", timeout=10)
        events = resp.json()
        if events:
            event_id = events[0]["id"]
    except:
        pass
    
    # POST ai/chat
    try:
        payload = {"message": "Is parking available?", "eventId": event_id}
        resp = requests.post(f"{BASE_URL}/ai/chat", json=payload, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            "reply" in data and
            "confidence" in data and
            "riskLevel" in data and
            len(data.get("reply", "")) > 0
        )
        log_test("POST /api/ai/chat", passed, 
                f"Reply length: {len(data.get('reply', ''))}, Confidence: {data.get('confidence')}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in chat response", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("POST /api/ai/chat", False, str(e))
        all_passed = False
    
    # POST ai/generate-content
    try:
        payload = {"type": "Instagram caption", "eventId": event_id}
        resp = requests.post(f"{BASE_URL}/ai/generate-content", json=payload, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            "content" in data and
            len(data.get("content", "")) > 0
        )
        log_test("POST /api/ai/generate-content", passed, 
                f"Content length: {len(data.get('content', ''))}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in generate-content response", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("POST /api/ai/generate-content", False, str(e))
        all_passed = False
    
    return all_passed

def test_content():
    """Test Content library"""
    print("\n=== 7. CONTENT ===")
    all_passed = True
    
    # GET all content
    try:
        resp = requests.get(f"{BASE_URL}/content", timeout=10)
        content = resp.json()
        
        passed = resp.status_code == 200 and isinstance(content, list)
        log_test("GET /api/content (list all)", passed, f"Status: {resp.status_code}, Count: {len(content)}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(content)
        log_test("No _id in content list", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("GET /api/content (list all)", False, str(e))
        all_passed = False
    
    # POST create content
    created_content_id = None
    try:
        new_content = {
            "type": "Facebook post",
            "content": "Join us for an amazing event! 🎉",
            "eventName": "Test Event"
        }
        resp = requests.post(f"{BASE_URL}/content", json=new_content, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            "id" in data and
            data.get("type") == new_content["type"]
        )
        log_test("POST /api/content (create)", passed, f"Status: {resp.status_code}, ID: {data.get('id')}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in created content", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
        if passed:
            created_content_id = data["id"]
        
    except Exception as e:
        log_test("POST /api/content (create)", False, str(e))
        all_passed = False
    
    # DELETE content
    if created_content_id:
        try:
            resp = requests.delete(f"{BASE_URL}/content/{created_content_id}", timeout=10)
            passed = resp.status_code == 200
            log_test("DELETE /api/content/:id", passed, f"Status: {resp.status_code}")
            all_passed = all_passed and passed
            
        except Exception as e:
            log_test("DELETE /api/content/:id", False, str(e))
            all_passed = False
    
    return all_passed

def test_leads_crm():
    """Test Leads CRM"""
    print("\n=== 8. LEADS CRM ===")
    all_passed = True
    
    # GET all leads
    try:
        resp = requests.get(f"{BASE_URL}/leads", timeout=10)
        leads = resp.json()
        
        passed = resp.status_code == 200 and isinstance(leads, list) and len(leads) >= 9
        log_test("GET /api/leads (list all)", passed, f"Status: {resp.status_code}, Count: {len(leads)}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(leads)
        log_test("No _id in leads list", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("GET /api/leads (list all)", False, str(e))
        all_passed = False
    
    # POST create lead
    created_lead_id = None
    try:
        new_lead = {
            "name": "Alex Thompson",
            "email": "alex@example.com",
            "category": "Hot Lead",
            "value": 500,
            "note": "Interested in VIP tickets"
        }
        resp = requests.post(f"{BASE_URL}/leads", json=new_lead, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 201 and
            "id" in data and
            data.get("name") == new_lead["name"] and
            data.get("category") == new_lead["category"]
        )
        log_test("POST /api/leads (create)", passed, f"Status: {resp.status_code}, ID: {data.get('id')}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in created lead", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
        if passed:
            created_lead_id = data["id"]
        
    except Exception as e:
        log_test("POST /api/leads (create)", False, str(e))
        all_passed = False
    
    # PUT update lead stage
    if created_lead_id:
        try:
            update = {"stage": "Converted"}
            resp = requests.put(f"{BASE_URL}/leads/{created_lead_id}", json=update, timeout=10)
            data = resp.json()
            
            passed = resp.status_code == 200 and data.get("stage") == "Converted"
            log_test("PUT /api/leads/:id (update stage)", passed, f"Status: {resp.status_code}")
            all_passed = all_passed and passed
            
            # Check no _id
            no_id, msg = check_no_mongo_id(data)
            log_test("No _id in updated lead", no_id, msg if not no_id else "")
            all_passed = all_passed and no_id
            
        except Exception as e:
            log_test("PUT /api/leads/:id (update stage)", False, str(e))
            all_passed = False
    
    return all_passed

def test_misc_endpoints():
    """Test audit logs, WhatsApp, MCP"""
    print("\n=== 9. MISC ENDPOINTS ===")
    all_passed = True
    
    # GET audit logs
    try:
        resp = requests.get(f"{BASE_URL}/audit-logs", timeout=10)
        logs = resp.json()
        
        passed = resp.status_code == 200 and isinstance(logs, list)
        log_test("GET /api/audit-logs", passed, f"Status: {resp.status_code}, Count: {len(logs)}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(logs)
        log_test("No _id in audit logs", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("GET /api/audit-logs", False, str(e))
        all_passed = False
    
    # GET WhatsApp webhook verification
    try:
        params = {
            "hub.verify_token": "demo-verify-token",
            "hub.challenge": "test-challenge-123"
        }
        resp = requests.get(f"{BASE_URL}/whatsapp/webhook", params=params, timeout=10)
        
        passed = resp.status_code == 200 and resp.text == "test-challenge-123"
        log_test("GET /api/whatsapp/webhook (verify)", passed, f"Status: {resp.status_code}, Response: {resp.text}")
        all_passed = all_passed and passed
        
    except Exception as e:
        log_test("GET /api/whatsapp/webhook (verify)", False, str(e))
        all_passed = False
    
    # POST WhatsApp webhook (incoming message)
    try:
        payload = {
            "text": "Where is my ticket?",
            "from": "Test User"
        }
        resp = requests.post(f"{BASE_URL}/whatsapp/webhook", json=payload, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("received") == True and
            "draftCreated" in data
        )
        log_test("POST /api/whatsapp/webhook (incoming)", passed, f"Status: {resp.status_code}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in webhook response", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("POST /api/whatsapp/webhook (incoming)", False, str(e))
        all_passed = False
    
    # POST WhatsApp send
    try:
        payload = {
            "to": "1234567890",
            "message": "Thank you for your enquiry!"
        }
        resp = requests.post(f"{BASE_URL}/whatsapp/send", json=payload, timeout=10)
        data = resp.json()
        
        passed = resp.status_code == 200 and data.get("success") == True
        log_test("POST /api/whatsapp/send", passed, f"Status: {resp.status_code}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in send response", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("POST /api/whatsapp/send", False, str(e))
        all_passed = False
    
    # GET MCP manifest
    try:
        resp = requests.get(f"{BASE_URL}/mcp", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("ready") == True and
            "tools" in data and
            len(data.get("tools", [])) == 10
        )
        log_test("GET /api/mcp (manifest)", passed, f"Status: {resp.status_code}, Tools: {len(data.get('tools', []))}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in MCP manifest", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("GET /api/mcp (manifest)", False, str(e))
        all_passed = False
    
    # POST MCP tool invocation
    try:
        payload = {"tool": "get_events"}
        resp = requests.post(f"{BASE_URL}/mcp", json=payload, timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("invoked") == True and
            data.get("tool") == "get_events"
        )
        log_test("POST /api/mcp (invoke tool)", passed, f"Status: {resp.status_code}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("No _id in MCP invoke response", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
        
    except Exception as e:
        log_test("POST /api/mcp (invoke tool)", False, str(e))
        all_passed = False
    
    return all_passed


def test_voice_command_api():
    """Test POST /api/voice/command - Voice Copilot intent resolution"""
    print("\n=== 11. VOICE COPILOT COMMAND API ===")
    all_passed = True
    
    # Test 1: Basic navigation - open approvals
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={"transcript": "open approvals"}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("success") == True and
            data.get("intent") == "open_approvals" and
            data.get("actionType") == "navigate" and
            data.get("target") == "/dashboard/approvals" and
            data.get("confidence", 0) > 0.8 and
            "response" in data
        )
        log_test("Voice: 'open approvals' -> navigate to /dashboard/approvals", passed, 
                f"Status: {resp.status_code}, Intent: {data.get('intent')}, Confidence: {data.get('confidence')}, Target: {data.get('target')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: 'open approvals'", False, str(e))
        all_passed = False
    
    # Test 2: Variations of approvals command
    variations = [
        ("go to approvals", "open_approvals"),
        ("take me to approvals", "open_approvals"),
        ("show approvals", "open_approvals")
    ]
    for transcript, expected_intent in variations:
        try:
            resp = requests.post(f"{BASE_URL}/voice/command", 
                               json={"transcript": transcript}, 
                               timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("success") == True and
                data.get("intent") == expected_intent and
                data.get("target") == "/dashboard/approvals"
            )
            log_test(f"Voice: '{transcript}' -> {expected_intent}", passed, 
                    f"Intent: {data.get('intent')}, Target: {data.get('target')}")
            all_passed = all_passed and passed
        except Exception as e:
            log_test(f"Voice: '{transcript}'", False, str(e))
            all_passed = False
    
    # Test 3: Other navigation commands
    nav_tests = [
        ("open events", "open_events", "/dashboard/events"),
        ("open inbox", "open_inbox", "/dashboard/inbox"),
        ("open leads", "open_leads", "/dashboard/leads"),
        ("open ai content", "open_ai_content", "/dashboard/ai-content"),
        ("open settings", "open_settings", "/dashboard/settings"),
        ("open dashboard", "open_dashboard", "/dashboard")
    ]
    for transcript, expected_intent, expected_target in nav_tests:
        try:
            resp = requests.post(f"{BASE_URL}/voice/command", 
                               json={"transcript": transcript}, 
                               timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("success") == True and
                data.get("intent") == expected_intent and
                data.get("target") == expected_target
            )
            log_test(f"Voice: '{transcript}' -> {expected_target}", passed, 
                    f"Intent: {data.get('intent')}, Target: {data.get('target')}")
            all_passed = all_passed and passed
        except Exception as e:
            log_test(f"Voice: '{transcript}'", False, str(e))
            all_passed = False
    
    # Test 4: Show hot leads and show pending approvals
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={"transcript": "show hot leads"}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("success") == True and
            data.get("intent") == "show_hot_leads" and
            data.get("target") == "/dashboard/leads"
        )
        log_test("Voice: 'show hot leads' -> /dashboard/leads", passed, 
                f"Intent: {data.get('intent')}, Target: {data.get('target')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: 'show hot leads'", False, str(e))
        all_passed = False
    
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={"transcript": "show pending approvals"}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("success") == True and
            data.get("intent") == "show_pending_approvals" and
            data.get("mcpTool") == "get_pending_approvals"
        )
        log_test("Voice: 'show pending approvals' -> mcpTool get_pending_approvals", passed, 
                f"Intent: {data.get('intent')}, mcpTool: {data.get('mcpTool')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: 'show pending approvals'", False, str(e))
        all_passed = False
    
    # Test 5: Content generation
    content_tests = [
        ("generate instagram caption", "generate_instagram_caption", "Instagram caption"),
        ("generate facebook post", "generate_facebook_post", "Facebook post"),
        ("generate reel script", "generate_reel_script", "45-second reel script")
    ]
    for transcript, expected_intent, expected_content_type in content_tests:
        try:
            resp = requests.post(f"{BASE_URL}/voice/command", 
                               json={"transcript": transcript}, 
                               timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("success") == True and
                data.get("intent") == expected_intent and
                data.get("actionType") == "generate_content" and
                data.get("payload", {}).get("contentType") == expected_content_type and
                data.get("mcpTool") == "generate_social_content"
            )
            log_test(f"Voice: '{transcript}' -> generate_content", passed, 
                    f"Intent: {data.get('intent')}, ContentType: {data.get('payload', {}).get('contentType')}, mcpTool: {data.get('mcpTool')}")
            all_passed = all_passed and passed
        except Exception as e:
            log_test(f"Voice: '{transcript}'", False, str(e))
            all_passed = False
    
    # Test 6: Create new event
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={"transcript": "create new event"}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("success") == True and
            data.get("intent") == "create_new_event" and
            data.get("target") == "/dashboard/events/new" and
            data.get("mcpTool") == "create_event"
        )
        log_test("Voice: 'create new event' -> /dashboard/events/new", passed, 
                f"Intent: {data.get('intent')}, Target: {data.get('target')}, mcpTool: {data.get('mcpTool')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: 'create new event'", False, str(e))
        all_passed = False
    
    # Test 7: Simulate enquiry
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={"transcript": "simulate enquiry"}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("success") == True and
            data.get("intent") == "simulate_enquiry" and
            data.get("actionType") == "enquiry"
        )
        log_test("Voice: 'simulate enquiry' -> actionType enquiry", passed, 
                f"Intent: {data.get('intent')}, ActionType: {data.get('actionType')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: 'simulate enquiry'", False, str(e))
        all_passed = False
    
    # Test 8: Approval actions (must require confirmation)
    approval_tests = [
        ("approve selected reply", "approve_selected_reply", "approve_ai_reply"),
        ("reject selected reply", "reject_selected_reply", None)
    ]
    for transcript, expected_intent, expected_mcp_tool in approval_tests:
        try:
            resp = requests.post(f"{BASE_URL}/voice/command", 
                               json={"transcript": transcript}, 
                               timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("success") == True and
                data.get("intent") == expected_intent and
                data.get("requiresConfirmation") == True
            )
            if expected_mcp_tool:
                passed = passed and data.get("mcpTool") == expected_mcp_tool
            
            log_test(f"Voice: '{transcript}' -> requiresConfirmation=True", passed, 
                    f"Intent: {data.get('intent')}, RequiresConfirmation: {data.get('requiresConfirmation')}, mcpTool: {data.get('mcpTool')}")
            all_passed = all_passed and passed
        except Exception as e:
            log_test(f"Voice: '{transcript}'", False, str(e))
            all_passed = False
    
    # Test 9: Help commands
    help_tests = ["what can you do?", "help"]
    for transcript in help_tests:
        try:
            resp = requests.post(f"{BASE_URL}/voice/command", 
                               json={"transcript": transcript}, 
                               timeout=10)
            data = resp.json()
            
            passed = (
                resp.status_code == 200 and
                data.get("intent") == "help"
            )
            log_test(f"Voice: '{transcript}' -> help intent", passed, 
                    f"Intent: {data.get('intent')}")
            all_passed = all_passed and passed
        except Exception as e:
            log_test(f"Voice: '{transcript}'", False, str(e))
            all_passed = False
    
    # Test 10: Unknown command (fallback)
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={"transcript": "make me a sandwich"}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            data.get("success") == False and
            data.get("intent") == "fallback" and
            data.get("actionType") == "none" and
            data.get("confidence", 1.0) < 0.4 and
            "response" in data
        )
        log_test("Voice: 'make me a sandwich' -> fallback", passed, 
                f"Success: {data.get('success')}, Intent: {data.get('intent')}, Confidence: {data.get('confidence')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: 'make me a sandwich'", False, str(e))
        all_passed = False
    
    # Test 11: Validation - missing transcript
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 400 and
            data.get("success") == False and
            data.get("intent") == "fallback"
        )
        log_test("Voice: missing transcript -> 400 fallback", passed, 
                f"Status: {resp.status_code}, Success: {data.get('success')}, Intent: {data.get('intent')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: missing transcript", False, str(e))
        all_passed = False
    
    # Test 12: Validation - empty transcript
    try:
        resp = requests.post(f"{BASE_URL}/voice/command", 
                           json={"transcript": ""}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 400 and
            data.get("success") == False and
            data.get("intent") == "fallback"
        )
        log_test("Voice: empty transcript -> 400 fallback", passed, 
                f"Status: {resp.status_code}, Success: {data.get('success')}, Intent: {data.get('intent')}")
        all_passed = all_passed and passed
    except Exception as e:
        log_test("Voice: empty transcript", False, str(e))
        all_passed = False
    
    return all_passed

def test_voice_regression():
    """Regression test: ensure existing endpoints still work after adding voice/command route"""
    print("\n=== 12. VOICE REGRESSION - EXISTING ENDPOINTS ===")
    all_passed = True
    
    # Test GET /api/dashboard/stats
    try:
        resp = requests.get(f"{BASE_URL}/dashboard/stats", timeout=10)
        data = resp.json()
        
        passed = resp.status_code == 200 and "totalEvents" in data
        log_test("Regression: GET /api/dashboard/stats still works", passed, 
                f"Status: {resp.status_code}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("Regression: No _id in dashboard/stats", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
    except Exception as e:
        log_test("Regression: GET /api/dashboard/stats", False, str(e))
        all_passed = False
    
    # Test GET /api/events
    try:
        resp = requests.get(f"{BASE_URL}/events", timeout=10)
        data = resp.json()
        
        passed = resp.status_code == 200 and isinstance(data, list)
        log_test("Regression: GET /api/events returns array", passed, 
                f"Status: {resp.status_code}, Count: {len(data) if isinstance(data, list) else 'N/A'}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("Regression: No _id in events", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
    except Exception as e:
        log_test("Regression: GET /api/events", False, str(e))
        all_passed = False
    
    # Test GET /api/mcp
    try:
        resp = requests.get(f"{BASE_URL}/mcp", timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and 
            "tools" in data and 
            isinstance(data["tools"], list) and
            len(data["tools"]) == 10
        )
        log_test("Regression: GET /api/mcp returns 10 tools", passed, 
                f"Status: {resp.status_code}, Tools: {len(data.get('tools', []))}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("Regression: No _id in mcp", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
    except Exception as e:
        log_test("Regression: GET /api/mcp", False, str(e))
        all_passed = False
    
    # Test POST /api/ai/classify-message
    try:
        resp = requests.post(f"{BASE_URL}/ai/classify-message", 
                           json={"message": "refund"}, 
                           timeout=10)
        data = resp.json()
        
        passed = (
            resp.status_code == 200 and
            "category" in data and
            "riskLevel" in data
        )
        log_test("Regression: POST /api/ai/classify-message works", passed, 
                f"Status: {resp.status_code}, Category: {data.get('category')}, Risk: {data.get('riskLevel')}")
        all_passed = all_passed and passed
        
        # Check no _id
        no_id, msg = check_no_mongo_id(data)
        log_test("Regression: No _id in ai/classify-message", no_id, msg if not no_id else "")
        all_passed = all_passed and no_id
    except Exception as e:
        log_test("Regression: POST /api/ai/classify-message", False, str(e))
        all_passed = False
    
    return all_passed

def main():
    """Run all tests"""
    print("=" * 70)
    print("AI EventOps Assistant - Backend API Test Suite")
    print("=" * 70)
    
    results = []
    
    # Run all test suites
    results.append(("Health Check", test_health()))
    results.append(("Seed Data", test_seed()))
    results.append(("Dashboard Stats", test_dashboard_stats()))
    results.append(("Events CRUD", test_events_crud()))
    results.append(("Messages/AI Inbox", test_messages_ai_inbox()))
    results.append(("Approvals", test_approvals()))
    results.append(("AI Endpoints", test_ai_endpoints()))
    results.append(("Content", test_content()))
    results.append(("Leads CRM", test_leads_crm()))
    results.append(("Misc Endpoints", test_misc_endpoints()))
    results.append(("Voice Copilot Command API", test_voice_command_api()))
    results.append(("Voice Regression Tests", test_voice_regression()))
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed_count}/{total_count} test suites passed")
    
    if passed_count == total_count:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠️  {total_count - passed_count} test suite(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
