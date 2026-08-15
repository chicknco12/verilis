#!/usr/bin/env python3
"""
Virellis Backend API Test Suite - OpenAI Chat Models Integration Retest
Tests POST /api/concierge and POST /api/concierge/brief after GPT-5 integration
"""

import requests
import json
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/.env')

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
API_BASE = f"{BASE_URL}/api"

print(f"Testing against: {API_BASE}")
print("=" * 80)

# Track test results
tests_passed = 0
tests_failed = 0
session_id = None

def test_result(name, passed, details=""):
    global tests_passed, tests_failed
    if passed:
        tests_passed += 1
        print(f"✅ PASS: {name}")
        if details:
            print(f"   {details}")
    else:
        tests_failed += 1
        print(f"❌ FAIL: {name}")
        if details:
            print(f"   {details}")
    print()

# ============================================================================
# TEST 1: POST /api/concierge - Turn 1 (new conversation)
# ============================================================================
print("TEST 1: POST /api/concierge - Turn 1 (new conversation)")
print("-" * 80)

try:
    payload = {
        "message": "We are a government healthcare agency exploring enterprise AI adoption across our claims and case management systems."
    }
    response = requests.post(f"{API_BASE}/concierge", json=payload, timeout=60)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response keys: {list(data.keys())}")
        
        # Check for required fields
        has_session_id = 'sessionId' in data and data['sessionId']
        has_reply = 'reply' in data and data['reply']
        has_user_turns = 'userTurns' in data and data['userTurns'] == 1
        
        if has_session_id:
            session_id = data['sessionId']
            print(f"Session ID: {session_id}")
        
        if has_reply:
            reply_length = len(data['reply'])
            print(f"Reply length: {reply_length} chars")
            print(f"Reply preview: {data['reply'][:150]}...")
        
        if has_user_turns:
            print(f"User turns: {data['userTurns']}")
        
        all_checks = has_session_id and has_reply and has_user_turns
        test_result(
            "Turn 1: New conversation with realistic message",
            all_checks,
            f"sessionId={'✓' if has_session_id else '✗'}, reply={'✓' if has_reply else '✗'}, userTurns=1={'✓' if has_user_turns else '✗'}"
        )
    else:
        test_result(
            "Turn 1: New conversation with realistic message",
            False,
            f"Expected 200, got {response.status_code}: {response.text[:200]}"
        )
        
except Exception as e:
    test_result("Turn 1: New conversation with realistic message", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2: POST /api/concierge - Turn 2 (context maintained)
# ============================================================================
print("TEST 2: POST /api/concierge - Turn 2 (context maintained)")
print("-" * 80)

if session_id:
    try:
        payload = {
            "sessionId": session_id,
            "message": "Timeline is about 12 months and I am the transformation director."
        }
        response = requests.post(f"{API_BASE}/concierge", json=payload, timeout=60)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response keys: {list(data.keys())}")
            
            # Check for required fields
            has_same_session = 'sessionId' in data and data['sessionId'] == session_id
            has_reply = 'reply' in data and data['reply']
            has_user_turns_2 = 'userTurns' in data and data['userTurns'] == 2
            
            if has_reply:
                reply = data['reply']
                reply_length = len(reply)
                print(f"Reply length: {reply_length} chars")
                print(f"Reply preview: {reply[:150]}...")
                
                # Check that reply doesn't restart conversation (no greeting like "Hello", "Welcome", etc.)
                restart_indicators = ['hello', 'welcome', 'greetings', 'good morning', 'good afternoon', 'nice to meet']
                is_contextual = not any(indicator in reply.lower()[:50] for indicator in restart_indicators)
                print(f"Contextual reply (no restart greeting): {'✓' if is_contextual else '✗'}")
            else:
                is_contextual = False
            
            if has_user_turns_2:
                print(f"User turns: {data['userTurns']}")
            
            all_checks = has_same_session and has_reply and has_user_turns_2 and is_contextual
            test_result(
                "Turn 2: Context maintained, userTurns=2",
                all_checks,
                f"sessionId match={'✓' if has_same_session else '✗'}, reply={'✓' if has_reply else '✗'}, userTurns=2={'✓' if has_user_turns_2 else '✗'}, contextual={'✓' if is_contextual else '✗'}"
            )
        else:
            test_result(
                "Turn 2: Context maintained, userTurns=2",
                False,
                f"Expected 200, got {response.status_code}: {response.text[:200]}"
            )
            
    except Exception as e:
        test_result("Turn 2: Context maintained, userTurns=2", False, f"Exception: {str(e)}")
else:
    test_result("Turn 2: Context maintained, userTurns=2", False, "Skipped - no session_id from Turn 1")

# ============================================================================
# TEST 3: POST /api/concierge - Negative test: empty message
# ============================================================================
print("TEST 3: POST /api/concierge - Negative test: empty message")
print("-" * 80)

try:
    payload = {
        "message": ""
    }
    response = requests.post(f"{API_BASE}/concierge", json=payload, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 400:
        print(f"Response: {response.text[:200]}")
        test_result(
            "Negative: Empty message rejected with 400",
            True,
            "Empty message correctly rejected"
        )
    else:
        test_result(
            "Negative: Empty message rejected with 400",
            False,
            f"Expected 400, got {response.status_code}"
        )
        
except Exception as e:
    test_result("Negative: Empty message rejected with 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 4: POST /api/concierge - Negative test: missing message field
# ============================================================================
print("TEST 4: POST /api/concierge - Negative test: missing message field")
print("-" * 80)

try:
    payload = {
        "sessionId": "some-id"
    }
    response = requests.post(f"{API_BASE}/concierge", json=payload, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 400:
        print(f"Response: {response.text[:200]}")
        test_result(
            "Negative: Missing message field rejected with 400",
            True,
            "Missing message field correctly rejected"
        )
    else:
        test_result(
            "Negative: Missing message field rejected with 400",
            False,
            f"Expected 400, got {response.status_code}"
        )
        
except Exception as e:
    test_result("Negative: Missing message field rejected with 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 5: POST /api/concierge/brief - Generate structured brief
# ============================================================================
print("TEST 5: POST /api/concierge/brief - Generate structured brief")
print("-" * 80)

if session_id:
    try:
        payload = {
            "sessionId": session_id
        }
        response = requests.post(f"{API_BASE}/concierge/brief", json=payload, timeout=90)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response keys: {list(data.keys())}")
            
            # Check for brief object
            has_brief = 'brief' in data
            
            if has_brief:
                brief = data['brief']
                print(f"Brief keys: {list(brief.keys())}")
                
                # Check all required keys
                required_keys = ['summary', 'agenda', 'proposalOutline', 'followUpEmail', 'crm']
                has_all_keys = all(key in brief for key in required_keys)
                
                # Validate each field
                has_summary = isinstance(brief.get('summary'), str) and len(brief.get('summary', '')) > 0
                has_agenda = isinstance(brief.get('agenda'), list) and len(brief.get('agenda', [])) > 0
                has_proposal = isinstance(brief.get('proposalOutline'), list) and len(brief.get('proposalOutline', [])) > 0
                has_email = isinstance(brief.get('followUpEmail'), str) and len(brief.get('followUpEmail', '')) > 0
                has_crm = isinstance(brief.get('crm'), dict)
                
                print(f"  summary: {'✓' if has_summary else '✗'} ({len(brief.get('summary', ''))} chars)")
                print(f"  agenda: {'✓' if has_agenda else '✗'} ({len(brief.get('agenda', []))} items)")
                print(f"  proposalOutline: {'✓' if has_proposal else '✗'} ({len(brief.get('proposalOutline', []))} items)")
                print(f"  followUpEmail: {'✓' if has_email else '✗'} ({len(brief.get('followUpEmail', ''))} chars)")
                print(f"  crm: {'✓' if has_crm else '✗'} ({list(brief.get('crm', {}).keys())})")
                
                # Validate JSON structure
                try:
                    json_str = json.dumps(brief)
                    json.loads(json_str)
                    is_valid_json = True
                    print(f"  Valid JSON: ✓")
                except Exception:
                    is_valid_json = False
                    print(f"  Valid JSON: ✗")
                
                all_checks = has_all_keys and has_summary and has_agenda and has_proposal and has_email and has_crm and is_valid_json
                test_result(
                    "Brief generation: All required keys present and valid JSON",
                    all_checks,
                    f"Keys present={'✓' if has_all_keys else '✗'}, all fields valid={'✓' if all_checks else '✗'}"
                )
            else:
                test_result(
                    "Brief generation: All required keys present and valid JSON",
                    False,
                    "No 'brief' key in response"
                )
        else:
            test_result(
                "Brief generation: All required keys present and valid JSON",
                False,
                f"Expected 200, got {response.status_code}: {response.text[:200]}"
            )
            
    except Exception as e:
        test_result("Brief generation: All required keys present and valid JSON", False, f"Exception: {str(e)}")
else:
    test_result("Brief generation: All required keys present and valid JSON", False, "Skipped - no session_id from Turn 1")

# ============================================================================
# TEST 6: POST /api/concierge/brief - Negative test: non-existent sessionId
# ============================================================================
print("TEST 6: POST /api/concierge/brief - Negative test: non-existent sessionId")
print("-" * 80)

try:
    payload = {
        "sessionId": "non-existent-session-id-12345"
    }
    response = requests.post(f"{API_BASE}/concierge/brief", json=payload, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 400:
        print(f"Response: {response.text[:200]}")
        test_result(
            "Negative: Non-existent sessionId rejected with 400",
            True,
            "Non-existent sessionId correctly rejected"
        )
    else:
        test_result(
            "Negative: Non-existent sessionId rejected with 400",
            False,
            f"Expected 400, got {response.status_code}"
        )
        
except Exception as e:
    test_result("Negative: Non-existent sessionId rejected with 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 7: GET /api/portfolio - Quick smoke test (unchanged endpoint)
# ============================================================================
print("TEST 7: GET /api/portfolio - Quick smoke test (unchanged endpoint)")
print("-" * 80)

try:
    response = requests.get(f"{API_BASE}/portfolio", timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Response keys: {list(data.keys())}")
        test_result(
            "Smoke test: GET /api/portfolio returns 200",
            True,
            "Portfolio endpoint still working"
        )
    else:
        test_result(
            "Smoke test: GET /api/portfolio returns 200",
            False,
            f"Expected 200, got {response.status_code}"
        )
        
except Exception as e:
    test_result("Smoke test: GET /api/portfolio returns 200", False, f"Exception: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total tests: {tests_passed + tests_failed}")
print(f"Passed: {tests_passed}")
print(f"Failed: {tests_failed}")
print()

if tests_failed == 0:
    print("✅ ALL TESTS PASSED")
    sys.exit(0)
else:
    print("❌ SOME TESTS FAILED")
    sys.exit(1)
