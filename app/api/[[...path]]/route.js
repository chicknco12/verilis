import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// ---------------- Virellis LLM (Emergent universal key) ----------------
const EMERGENT_LLM_KEY = process.env.EMERGENT_LLM_KEY
const LLM_BASE = 'https://integrations.emergentagent.com/llm'
const LLM_MODEL = 'gpt-4o-mini'

const CONCIERGE_SYSTEM = `You are the Virellis AI Concierge — the digital front door of Virellis, a premier enterprise transformation consultancy led by Founder & Principal Consultant Fidelis Chick.

Virellis helps governments, healthcare, financial services, technology, retail and telecommunications organizations turn complexity into predictable, intelligent delivery across Strategy, Governance, AI, Delivery, Data, Cloud, PMO and Innovation.

Your role: greet the visitor like a senior executive advisor and conversationally qualify the engagement. Ask ONE focused question at a time to understand: (1) the transformation they are trying to achieve, (2) their industry/organization, (3) the core challenge or trigger, (4) approximate scale/timeline, and (5) their role. Be warm, precise, and confident — never salesy or verbose. Keep every reply to 2-4 sentences. Once you understand their goal, industry and challenge, tell them you can generate a tailored engagement brief and invite them to click "Generate Engagement Brief". Never invent Virellis case studies or numbers.`

const BRIEF_SYSTEM = `You are a McKinsey-grade engagement strategist for Virellis. From the conversation transcript, produce a concise, board-ready engagement brief.
Return STRICT JSON only (no markdown) with EXACTLY these keys:
{
  "summary": string,                     // 2-3 sentence executive summary of the opportunity
  "agenda": string[],                    // 4-6 strategy-session agenda items
  "proposalOutline": [ { "title": string, "detail": string } ],  // 3-5 proposed workstreams
  "followUpEmail": string,               // a professional follow-up email from Fidelis Chick, Virellis
  "crm": { "leadName": string, "organization": string, "industry": string, "priority": "High"|"Medium"|"Low", "nextStep": string }
}
Where information is missing, make reasonable, senior-level assumptions. Keep it crisp and executive.`

async function llmChat(messages, { json = false, maxTokens = 500 } = {}) {
  const payload = { model: LLM_MODEL, messages, max_tokens: maxTokens }
  if (json) payload.response_format = { type: 'json_object' }
  const res = await fetch(`${LLM_BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${EMERGENT_LLM_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`LLM ${res.status}: ${t}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function rnd(min, max) { return Math.round(min + Math.random() * (max - min)) }

function generatePortfolio() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const velocity = months.map((m, i) => ({
    month: m,
    planned: 42 + i * 5 + rnd(-2, 2),
    actual: 40 + i * 5 + rnd(-4, 5),
  }))
  const kpis = {
    portfolioHealth: rnd(87, 96),
    deliveryConfidence: rnd(90, 98),
    riskIndex: rnd(12, 23),
    budgetHealth: rnd(91, 99),
  }
  const risk = [
    { name: 'Delivery', value: rnd(10, 24) },
    { name: 'Financial', value: rnd(8, 18) },
    { name: 'Resource', value: rnd(10, 20) },
    { name: 'Vendor', value: rnd(6, 15) },
    { name: 'Compliance', value: rnd(5, 12) },
  ]
  const budget = [
    { name: 'Government', allocated: rnd(90, 130), spent: rnd(60, 110) },
    { name: 'Healthcare', allocated: rnd(70, 110), spent: rnd(50, 95) },
    { name: 'Financial', allocated: rnd(80, 120), spent: rnd(55, 100) },
    { name: 'Technology', allocated: rnd(60, 100), spent: rnd(40, 85) },
  ]
  const statuses = ['On Track', 'On Track', 'At Risk', 'On Track', 'Watch']
  const programs = [
    { name: 'National Digital Services Platform', phase: 'Execution', confidence: rnd(86, 97) },
    { name: 'Core Banking Modernization', phase: 'Governance', confidence: rnd(80, 94) },
    { name: 'Healthcare Data Foundation', phase: 'Discovery', confidence: rnd(78, 92) },
    { name: 'Enterprise AI Adoption Program', phase: 'Planning', confidence: rnd(82, 95) },
    { name: 'ERP & Operations Transformation', phase: 'Execution', confidence: rnd(84, 96) },
  ].map((p, i) => ({ ...p, status: statuses[i % statuses.length] }))
  return {
    kpis,
    velocity,
    risk,
    budget,
    programs,
    dependencies: rnd(120, 180),
    activePrograms: programs.length,
    generatedAt: new Date().toISOString(),
  }
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }
    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }

    // Status endpoints - POST /api/status
    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" }, 
          { status: 400 }
        ))
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    // Status endpoints - GET /api/status
    if (route === '/status' && method === 'GET') {
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedStatusChecks))
    }

    // Virellis: PMO portfolio (simulated executive telemetry)
    if (route === '/portfolio' && method === 'GET') {
      return handleCORS(NextResponse.json(generatePortfolio()))
    }

    // Virellis: AI Concierge (multi-turn lead qualification)
    if (route === '/concierge' && method === 'POST') {
      const body = await request.json()
      const sessionId = body.sessionId || uuidv4()
      const message = (body.message || '').toString().slice(0, 4000)
      if (!message) {
        return handleCORS(NextResponse.json({ error: 'message is required' }, { status: 400 }))
      }
      const conv = await db.collection('virellis_conversations').findOne({ sessionId })
      const history = (conv?.messages || []).map((m) => ({ role: m.role, content: m.content }))
      const llmMessages = [{ role: 'system', content: CONCIERGE_SYSTEM }, ...history, { role: 'user', content: message }]
      const reply = await llmChat(llmMessages, { maxTokens: 350 })
      const newMessages = [...history, { role: 'user', content: message }, { role: 'assistant', content: reply }]
      await db.collection('virellis_conversations').updateOne(
        { sessionId },
        { $set: { sessionId, messages: newMessages, updatedAt: new Date() } },
        { upsert: true }
      )
      return handleCORS(NextResponse.json({ sessionId, reply, userTurns: newMessages.filter((m) => m.role === 'user').length }))
    }

    // Virellis: generate engagement brief from a conversation
    if (route === '/concierge/brief' && method === 'POST') {
      const body = await request.json()
      const sessionId = body.sessionId
      const conv = await db.collection('virellis_conversations').findOne({ sessionId })
      if (!conv || !conv.messages?.length) {
        return handleCORS(NextResponse.json({ error: 'no conversation found' }, { status: 400 }))
      }
      const transcript = conv.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')
      const briefMsgs = [
        { role: 'system', content: BRIEF_SYSTEM },
        { role: 'user', content: `Conversation transcript:\n${transcript}\n\nGenerate the engagement brief as strict JSON.` },
      ]
      const raw = await llmChat(briefMsgs, { json: true, maxTokens: 1200 })
      let brief
      try { brief = JSON.parse(raw) } catch { brief = { summary: raw, agenda: [], proposalOutline: [], followUpEmail: '', crm: {} } }
      await db.collection('virellis_briefs').insertOne({ id: uuidv4(), sessionId, brief, createdAt: new Date() })
      return handleCORS(NextResponse.json({ brief }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute