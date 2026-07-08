#!/usr/bin/env python3
"""
Backend API Tests for Virellis Phase 2
Tests the 3 backend endpoints: /api/portfolio, /api/concierge, /api/concierge/brief
"""

import requests
import json
import uuid
import time
from typing import Dict, Any

# Base URL for testing - using localhost:3000 as per instructions
BASE_URL = "http://localhost:3000/api"

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def log_result(test_name: str, passed: bool, message: str):
    """Log test result"""
    result = {"test": test_name, "message": message}
    if passed:
        test_results["passed"].append(result)
        print(f"✅ PASS: {test_name}")
        print(f"   {message}\n")
    else:
        test_results["failed"].append(result)
        print(f"❌ FAIL: {test_name}")
        print(f"   {message}\n")

def log_warning(test_name: str, message: str):
    """Log warning"""
    test_results["warnings"].append({"test": test_name, "message": message})
    print(f"⚠️  WARNING: {test_name}")
    print(f"   {message}\n")

def test_portfolio_endpoint():
    """Test GET /api/portfolio endpoint"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/portfolio")
    print("="*80)
    
    try:
        # First call
        print("Making first request to /api/portfolio...")
        response1 = requests.get(f"{BASE_URL}/portfolio", timeout=10)
        
        if response1.status_code != 200:
            log_result("Portfolio - HTTP Status", False, 
                      f"Expected 200, got {response1.status_code}. Response: {response1.text}")
            return
        
        log_result("Portfolio - HTTP Status", True, "Received HTTP 200")
        
        # Parse JSON
        try:
            data1 = response1.json()
        except json.JSONDecodeError as e:
            log_result("Portfolio - JSON Parse", False, f"Failed to parse JSON: {e}")
            return
        
        log_result("Portfolio - JSON Parse", True, "Successfully parsed JSON response")
        
        # Check required keys
        required_keys = ["kpis", "velocity", "risk", "budget", "programs", 
                        "dependencies", "activePrograms", "generatedAt"]
        missing_keys = [key for key in required_keys if key not in data1]
        
        if missing_keys:
            log_result("Portfolio - Required Keys", False, 
                      f"Missing keys: {missing_keys}. Got keys: {list(data1.keys())}")
            return
        
        log_result("Portfolio - Required Keys", True, 
                  f"All required keys present: {required_keys}")
        
        # Validate kpis structure
        kpis = data1.get("kpis", {})
        kpi_keys = ["portfolioHealth", "deliveryConfidence", "riskIndex", "budgetHealth"]
        missing_kpi_keys = [key for key in kpi_keys if key not in kpis]
        
        if missing_kpi_keys:
            log_result("Portfolio - KPIs Structure", False, 
                      f"Missing KPI keys: {missing_kpi_keys}")
        else:
            log_result("Portfolio - KPIs Structure", True, 
                      f"KPIs object has all required keys: {kpi_keys}")
        
        # Validate arrays
        if not isinstance(data1.get("velocity"), list):
            log_result("Portfolio - Velocity Array", False, "velocity is not an array")
        elif len(data1["velocity"]) == 0:
            log_result("Portfolio - Velocity Array", False, "velocity array is empty")
        else:
            log_result("Portfolio - Velocity Array", True, 
                      f"velocity is array with {len(data1['velocity'])} items")
        
        if not isinstance(data1.get("risk"), list):
            log_result("Portfolio - Risk Array", False, "risk is not an array")
        elif len(data1["risk"]) == 0:
            log_result("Portfolio - Risk Array", False, "risk array is empty")
        else:
            log_result("Portfolio - Risk Array", True, 
                      f"risk is array with {len(data1['risk'])} items")
        
        if not isinstance(data1.get("budget"), list):
            log_result("Portfolio - Budget Array", False, "budget is not an array")
        elif len(data1["budget"]) == 0:
            log_result("Portfolio - Budget Array", False, "budget array is empty")
        else:
            log_result("Portfolio - Budget Array", True, 
                      f"budget is array with {len(data1['budget'])} items")
        
        if not isinstance(data1.get("programs"), list):
            log_result("Portfolio - Programs Array", False, "programs is not an array")
        elif len(data1["programs"]) == 0:
            log_result("Portfolio - Programs Array", False, "programs array is empty")
        else:
            log_result("Portfolio - Programs Array", True, 
                      f"programs is array with {len(data1['programs'])} items")
        
        # Second call to verify values differ (simulated live data)
        print("\nMaking second request to verify data changes...")
        time.sleep(0.5)
        response2 = requests.get(f"{BASE_URL}/portfolio", timeout=10)
        
        if response2.status_code != 200:
            log_result("Portfolio - Second Call", False, 
                      f"Second call failed with status {response2.status_code}")
            return
        
        data2 = response2.json()
        
        # Compare some values to ensure they differ
        values_differ = False
        differences = []
        
        if data1.get("kpis", {}).get("portfolioHealth") != data2.get("kpis", {}).get("portfolioHealth"):
            values_differ = True
            differences.append("portfolioHealth")
        
        if data1.get("kpis", {}).get("deliveryConfidence") != data2.get("kpis", {}).get("deliveryConfidence"):
            values_differ = True
            differences.append("deliveryConfidence")
        
        if data1.get("dependencies") != data2.get("dependencies"):
            values_differ = True
            differences.append("dependencies")
        
        if data1.get("generatedAt") != data2.get("generatedAt"):
            values_differ = True
            differences.append("generatedAt")
        
        if values_differ:
            log_result("Portfolio - Live Data Simulation", True, 
                      f"Values differ between calls (changed: {differences}), confirming simulated live data")
        else:
            log_warning("Portfolio - Live Data Simulation", 
                       "Values are identical between calls - may not be properly randomized")
        
        print(f"\nSample data from first call:")
        print(f"  KPIs: {data1.get('kpis')}")
        print(f"  Dependencies: {data1.get('dependencies')}")
        print(f"  Active Programs: {data1.get('activePrograms')}")
        print(f"  Generated At: {data1.get('generatedAt')}")
        
    except requests.exceptions.RequestException as e:
        log_result("Portfolio - Connection", False, f"Request failed: {e}")
    except Exception as e:
        log_result("Portfolio - Unexpected Error", False, f"Unexpected error: {e}")

def test_concierge_endpoint():
    """Test POST /api/concierge endpoint (multi-turn chat)"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/concierge (Multi-turn AI Chat)")
    print("="*80)
    
    session_id = str(uuid.uuid4())
    print(f"Generated session ID: {session_id}\n")
    
    try:
        # Turn 1: Initial message
        print("TURN 1: Sending initial message...")
        message1 = "We are a government healthcare agency and want to adopt AI across our project delivery."
        payload1 = {
            "sessionId": session_id,
            "message": message1
        }
        
        print(f"Request: {json.dumps(payload1, indent=2)}")
        response1 = requests.post(f"{BASE_URL}/concierge", 
                                 json=payload1, 
                                 timeout=30)
        
        if response1.status_code != 200:
            log_result("Concierge - Turn 1 Status", False, 
                      f"Expected 200, got {response1.status_code}. Response: {response1.text}")
            return None
        
        log_result("Concierge - Turn 1 Status", True, "Received HTTP 200")
        
        try:
            data1 = response1.json()
        except json.JSONDecodeError as e:
            log_result("Concierge - Turn 1 JSON", False, f"Failed to parse JSON: {e}")
            return None
        
        log_result("Concierge - Turn 1 JSON", True, "Successfully parsed JSON response")
        
        # Validate response structure
        if "sessionId" not in data1:
            log_result("Concierge - Turn 1 sessionId", False, "sessionId not in response")
            return None
        
        log_result("Concierge - Turn 1 sessionId", True, 
                  f"sessionId present: {data1['sessionId']}")
        
        if "reply" not in data1 or not data1["reply"]:
            log_result("Concierge - Turn 1 Reply", False, "reply is missing or empty")
            return None
        
        log_result("Concierge - Turn 1 Reply", True, 
                  f"Received non-empty reply ({len(data1['reply'])} chars)")
        
        if "userTurns" not in data1:
            log_result("Concierge - Turn 1 userTurns", False, "userTurns not in response")
        elif data1["userTurns"] != 1:
            log_result("Concierge - Turn 1 userTurns", False, 
                      f"Expected userTurns=1, got {data1['userTurns']}")
        else:
            log_result("Concierge - Turn 1 userTurns", True, "userTurns = 1")
        
        print(f"\nAI Reply (Turn 1): {data1['reply']}\n")
        
        # Turn 2: Follow-up message with same sessionId
        print("TURN 2: Sending follow-up message with same sessionId...")
        time.sleep(1)  # Brief pause between turns
        
        message2 = "Timeline is about 12 months, budget mid seven figures, I am the transformation director."
        payload2 = {
            "sessionId": session_id,
            "message": message2
        }
        
        print(f"Request: {json.dumps(payload2, indent=2)}")
        response2 = requests.post(f"{BASE_URL}/concierge", 
                                 json=payload2, 
                                 timeout=30)
        
        if response2.status_code != 200:
            log_result("Concierge - Turn 2 Status", False, 
                      f"Expected 200, got {response2.status_code}. Response: {response2.text}")
            return session_id
        
        log_result("Concierge - Turn 2 Status", True, "Received HTTP 200")
        
        try:
            data2 = response2.json()
        except json.JSONDecodeError as e:
            log_result("Concierge - Turn 2 JSON", False, f"Failed to parse JSON: {e}")
            return session_id
        
        log_result("Concierge - Turn 2 JSON", True, "Successfully parsed JSON response")
        
        if "reply" not in data2 or not data2["reply"]:
            log_result("Concierge - Turn 2 Reply", False, "reply is missing or empty")
            return session_id
        
        log_result("Concierge - Turn 2 Reply", True, 
                  f"Received non-empty reply ({len(data2['reply'])} chars)")
        
        if "userTurns" not in data2:
            log_result("Concierge - Turn 2 userTurns", False, "userTurns not in response")
        elif data2["userTurns"] != 2:
            log_result("Concierge - Turn 2 userTurns", False, 
                      f"Expected userTurns=2, got {data2['userTurns']}")
        else:
            log_result("Concierge - Turn 2 userTurns", True, "userTurns = 2")
        
        print(f"\nAI Reply (Turn 2): {data2['reply']}\n")
        
        # Check context continuity - reply should not restart greeting
        reply2_lower = data2['reply'].lower()
        greeting_indicators = ["hello", "hi there", "welcome", "greetings", "good morning", "good afternoon"]
        has_greeting = any(indicator in reply2_lower for indicator in greeting_indicators)
        
        if has_greeting and "virellis" in reply2_lower:
            log_warning("Concierge - Context Continuity", 
                       "Turn 2 reply appears to restart greeting - context may not be maintained")
        else:
            log_result("Concierge - Context Continuity", True, 
                      "Turn 2 reply appears contextually coherent (no restart greeting)")
        
        # Negative test: empty message
        print("\nNEGATIVE TEST: Sending empty message...")
        payload_empty = {
            "sessionId": session_id,
            "message": ""
        }
        
        response_empty = requests.post(f"{BASE_URL}/concierge", 
                                      json=payload_empty, 
                                      timeout=10)
        
        if response_empty.status_code == 400:
            log_result("Concierge - Empty Message Validation", True, 
                      "Empty message correctly rejected with HTTP 400")
        else:
            log_result("Concierge - Empty Message Validation", False, 
                      f"Expected 400 for empty message, got {response_empty.status_code}")
        
        # Negative test: missing message
        print("NEGATIVE TEST: Sending request without message field...")
        payload_no_msg = {
            "sessionId": session_id
        }
        
        response_no_msg = requests.post(f"{BASE_URL}/concierge", 
                                       json=payload_no_msg, 
                                       timeout=10)
        
        if response_no_msg.status_code == 400:
            log_result("Concierge - Missing Message Validation", True, 
                      "Missing message correctly rejected with HTTP 400")
        else:
            log_result("Concierge - Missing Message Validation", False, 
                      f"Expected 400 for missing message, got {response_no_msg.status_code}")
        
        return session_id
        
    except requests.exceptions.RequestException as e:
        log_result("Concierge - Connection", False, f"Request failed: {e}")
        return None
    except Exception as e:
        log_result("Concierge - Unexpected Error", False, f"Unexpected error: {e}")
        return None

def test_brief_endpoint(session_id: str):
    """Test POST /api/concierge/brief endpoint"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/concierge/brief (Structured Brief Generation)")
    print("="*80)
    
    if not session_id:
        log_result("Brief - Prerequisites", False, 
                  "Cannot test brief endpoint - no valid sessionId from concierge test")
        return
    
    try:
        # Valid request with existing sessionId
        print(f"Requesting brief for sessionId: {session_id}...")
        payload = {
            "sessionId": session_id
        }
        
        print(f"Request: {json.dumps(payload, indent=2)}")
        response = requests.post(f"{BASE_URL}/concierge/brief", 
                                json=payload, 
                                timeout=30)
        
        if response.status_code != 200:
            log_result("Brief - HTTP Status", False, 
                      f"Expected 200, got {response.status_code}. Response: {response.text}")
            return
        
        log_result("Brief - HTTP Status", True, "Received HTTP 200")
        
        try:
            data = response.json()
        except json.JSONDecodeError as e:
            log_result("Brief - JSON Parse", False, f"Failed to parse JSON: {e}")
            return
        
        log_result("Brief - JSON Parse", True, "Successfully parsed JSON response")
        
        # Check for brief object
        if "brief" not in data:
            log_result("Brief - Structure", False, "Response missing 'brief' key")
            return
        
        log_result("Brief - Structure", True, "Response contains 'brief' object")
        
        brief = data["brief"]
        
        # Check required keys in brief
        required_keys = ["summary", "agenda", "proposalOutline", "followUpEmail", "crm"]
        missing_keys = [key for key in required_keys if key not in brief]
        
        if missing_keys:
            log_result("Brief - Required Keys", False, 
                      f"Brief missing keys: {missing_keys}. Got keys: {list(brief.keys())}")
        else:
            log_result("Brief - Required Keys", True, 
                      f"Brief has all required keys: {required_keys}")
        
        # Validate summary
        if not isinstance(brief.get("summary"), str) or not brief.get("summary"):
            log_result("Brief - Summary", False, "summary is missing or not a non-empty string")
        else:
            log_result("Brief - Summary", True, 
                      f"summary is non-empty string ({len(brief['summary'])} chars)")
        
        # Validate agenda
        if not isinstance(brief.get("agenda"), list):
            log_result("Brief - Agenda", False, "agenda is not an array")
        elif len(brief["agenda"]) == 0:
            log_result("Brief - Agenda", False, "agenda array is empty")
        else:
            log_result("Brief - Agenda", True, 
                      f"agenda is non-empty array with {len(brief['agenda'])} items")
        
        # Validate proposalOutline
        if not isinstance(brief.get("proposalOutline"), list):
            log_result("Brief - ProposalOutline", False, "proposalOutline is not an array")
        elif len(brief["proposalOutline"]) == 0:
            log_result("Brief - ProposalOutline", False, "proposalOutline array is empty")
        else:
            log_result("Brief - ProposalOutline", True, 
                      f"proposalOutline is non-empty array with {len(brief['proposalOutline'])} items")
        
        # Validate followUpEmail
        if not isinstance(brief.get("followUpEmail"), str) or not brief.get("followUpEmail"):
            log_result("Brief - FollowUpEmail", False, "followUpEmail is missing or not a non-empty string")
        else:
            log_result("Brief - FollowUpEmail", True, 
                      f"followUpEmail is non-empty string ({len(brief['followUpEmail'])} chars)")
        
        # Validate crm
        if not isinstance(brief.get("crm"), dict):
            log_result("Brief - CRM", False, "crm is not an object")
        else:
            log_result("Brief - CRM", True, f"crm is object with keys: {list(brief['crm'].keys())}")
        
        print(f"\nGenerated Brief Summary:")
        print(f"  Summary: {brief.get('summary', 'N/A')[:100]}...")
        print(f"  Agenda items: {len(brief.get('agenda', []))}")
        print(f"  Proposal outline items: {len(brief.get('proposalOutline', []))}")
        print(f"  CRM data: {brief.get('crm', {})}")
        
        # Negative test: non-existent sessionId
        print("\nNEGATIVE TEST: Requesting brief for non-existent sessionId...")
        fake_session_id = str(uuid.uuid4())
        payload_fake = {
            "sessionId": fake_session_id
        }
        
        response_fake = requests.post(f"{BASE_URL}/concierge/brief", 
                                     json=payload_fake, 
                                     timeout=10)
        
        if response_fake.status_code == 400:
            log_result("Brief - Invalid SessionId Validation", True, 
                      "Non-existent sessionId correctly rejected with HTTP 400")
        else:
            log_result("Brief - Invalid SessionId Validation", False, 
                      f"Expected 400 for non-existent sessionId, got {response_fake.status_code}")
        
    except requests.exceptions.RequestException as e:
        log_result("Brief - Connection", False, f"Request failed: {e}")
    except Exception as e:
        log_result("Brief - Unexpected Error", False, f"Unexpected error: {e}")

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    total_tests = len(test_results["passed"]) + len(test_results["failed"])
    passed_count = len(test_results["passed"])
    failed_count = len(test_results["failed"])
    warnings_count = len(test_results["warnings"])
    
    print(f"\nTotal Tests: {total_tests}")
    print(f"✅ Passed: {passed_count}")
    print(f"❌ Failed: {failed_count}")
    print(f"⚠️  Warnings: {warnings_count}")
    
    if test_results["failed"]:
        print("\n" + "-"*80)
        print("FAILED TESTS:")
        print("-"*80)
        for result in test_results["failed"]:
            print(f"❌ {result['test']}")
            print(f"   {result['message']}")
    
    if test_results["warnings"]:
        print("\n" + "-"*80)
        print("WARNINGS:")
        print("-"*80)
        for result in test_results["warnings"]:
            print(f"⚠️  {result['test']}")
            print(f"   {result['message']}")
    
    print("\n" + "="*80)
    if failed_count == 0:
        print("✅ ALL TESTS PASSED!")
    else:
        print(f"❌ {failed_count} TEST(S) FAILED")
    print("="*80 + "\n")

if __name__ == "__main__":
    print("="*80)
    print("VIRELLIS PHASE 2 BACKEND API TESTS")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Testing 3 endpoints: /portfolio, /concierge, /concierge/brief")
    print("="*80)
    
    # Run tests
    test_portfolio_endpoint()
    session_id = test_concierge_endpoint()
    test_brief_endpoint(session_id)
    
    # Print summary
    print_summary()
    
    # Exit with appropriate code
    exit(0 if len(test_results["failed"]) == 0 else 1)
