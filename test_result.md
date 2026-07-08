#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Virellis — cinematic 3D enterprise transformation consultancy site. Phase 2 adds backend rooms: AI Concierge (Emergent LLM), engagement-brief generator, and live PMO portfolio telemetry."

backend:
  - task: "PMO portfolio telemetry endpoint (GET /api/portfolio)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Returns simulated executive portfolio JSON (kpis, velocity[], risk[], budget[], programs[], dependencies, activePrograms, generatedAt). Values randomized per call to feel live. Verify 200 + all keys present + numeric ranges sane."
        -working: true
        -agent: "testing"
        -comment: "✅ PASSED all tests. Verified: (1) HTTP 200 response, (2) All required keys present (kpis, velocity, risk, budget, programs, dependencies, activePrograms, generatedAt), (3) KPIs object has all required keys (portfolioHealth, deliveryConfidence, riskIndex, budgetHealth), (4) All arrays properly populated (velocity: 9 items, risk: 5 items, budget: 4 items, programs: 5 items), (5) Live data simulation confirmed - values differ between consecutive calls (portfolioHealth, deliveryConfidence, dependencies, generatedAt all changed). Sample data: portfolioHealth=88, deliveryConfidence=93, riskIndex=21, budgetHealth=98, dependencies=129."

  - task: "AI Concierge chat (POST /api/concierge)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Multi-turn chat via Emergent universal LLM key (OpenAI-compatible proxy https://integrations.emergentagent.com/llm, model gpt-4o-mini). Body {sessionId, message}. Persists conversation to Mongo collection virellis_conversations. Returns {sessionId, reply, userTurns}. Verify: (1) first message returns a non-empty reply and a sessionId; (2) sending a second message with same sessionId keeps context (userTurns increments to 2); (3) missing message returns 400."
        -working: true
        -agent: "testing"
        -comment: "✅ PASSED all tests. Verified: (1) Turn 1 - HTTP 200, non-empty reply (187 chars), sessionId returned, userTurns=1, (2) Turn 2 - HTTP 200 with same sessionId, contextually coherent reply (179 chars) without restart greeting, userTurns=2, context maintained correctly, (3) Negative tests - empty message rejected with HTTP 400, missing message field rejected with HTTP 400. LLM integration working correctly via Emergent proxy. Sample conversation: User asked about AI adoption for government healthcare agency, AI responded with focused qualification questions as expected."

  - task: "Engagement brief generator (POST /api/concierge/brief)"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Generates structured JSON brief (summary, agenda[], proposalOutline[], followUpEmail, crm{}) from a stored conversation using json response_format. Body {sessionId}. Persists to virellis_briefs. Verify: (1) after a 2-3 turn conversation, returns brief object with keys summary/agenda/proposalOutline/followUpEmail/crm; (2) unknown sessionId returns 400."
        -working: true
        -agent: "testing"
        -comment: "✅ PASSED all tests. Verified: (1) HTTP 200 response, (2) Brief object returned with all required keys (summary, agenda, proposalOutline, followUpEmail, crm), (3) Summary is non-empty string (340 chars), (4) Agenda is non-empty array (5 items), (5) ProposalOutline is non-empty array (5 items), (6) FollowUpEmail is non-empty string (505 chars), (7) CRM object properly structured with keys: leadName, organization, industry, priority, nextStep, (8) Negative test - non-existent sessionId correctly rejected with HTTP 400. LLM JSON generation working correctly. Sample CRM data: leadName='Transformation Director', organization='Government Healthcare Agency', industry='Healthcare', priority='High'."

frontend:
  - task: "PMO Dashboard + AI Concierge Boardroom UI"
    implemented: true
    working: "NA"
    file: "components/virellis/PmoDashboard.jsx, components/virellis/ConciergeBoardroom.jsx, components/virellis/Experience.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Frontend not to be auto-tested yet unless user approves. Built recharts dashboard (auto-refresh 7s) and chat boardroom with brief panel."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "PMO portfolio telemetry endpoint (GET /api/portfolio)"
    - "AI Concierge chat (POST /api/concierge)"
    - "Engagement brief generator (POST /api/concierge/brief)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: "Phase 2 backend added: /api/portfolio (simulated), /api/concierge (Emergent LLM multi-turn chat), /api/concierge/brief (structured JSON brief). Emergent key is in .env as EMERGENT_LLM_KEY and verified working via direct proxy curl. Please test the 3 backend endpoints per the notes. Do NOT test frontend. Base path is /api. Use realistic conversation for concierge (e.g., about AI adoption in a government agency) before requesting a brief."
    -agent: "testing"
    -message: "✅ Backend testing COMPLETE - ALL 3 ENDPOINTS PASSED (31/31 tests). Tested: (1) GET /api/portfolio - simulated portfolio data with proper randomization, (2) POST /api/concierge - multi-turn AI chat with Emergent LLM, context maintained across turns, proper validation, (3) POST /api/concierge/brief - structured brief generation from conversation with all required fields. All negative test cases passed (empty/missing messages, non-existent sessionId). Emergent LLM integration working correctly. No critical issues found. Backend is production-ready."
