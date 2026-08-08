# SmartPortfolio AI 📈🤖
> An AI-powered financial document analysis and portfolio insights dashboard built with React, ExpressJS, GraphQL, Python (FastAPI), and Hugging Face.
# youtube link : https://www.youtube.com/watch?v=b1Z2Lbh6Kwo
---

## 🌟 Project Overview

**SmartPortfolio AI** is a full-stack microservices application designed for fund management teams and financial analysts. It processes financial market updates, earnings reports, and portfolio notes in real-time to generate:
- **Automated Summaries** via Hugging Face sequence-to-sequence transformers.
- **Sentiment Classification** (Positive, Neutral, Negative) with confidence scoring.
- **Unified Insights Feed** served via a GraphQL API gateway to a modern React TypeScript dashboard.

---

## 🏗️ Architecture & Tech Stack

The system follows a decoupling strategy separating AI inference, business logic, and UI layer:

### Run Python AI Service:Open terminal in ai-service
#### pip install -r requirements.txt
#### uvicorn main:app --port 8000 --reload
### Run GraphQL Express Gateway:Open terminal in graphql-gateway
#### npm install
#### npm start
### Run React TypeScript Frontend:Open terminal in frontend
#### npm install
#### npm run dev
┌──────────────────────────────────────────────────────────────────┐
│                   React + TypeScript Frontend                    │
│           (Dashboard, Sentiment Badges, Form Handlers)           │
└────────────────────────────────┬─────────────────────────────────┘
│ GraphQL Queries / Mutations
▼
┌──────────────────────────────────────────────────────────────────┐
│                   ExpressJS GraphQL API Gateway                  │
│             (Apollo Server 4, Data Aggregation, Schema)          │
└────────────────────────────────┬─────────────────────────────────┘
│ REST API Calls (Axios)
▼
┌──────────────────────────────────────────────────────────────────┐
│                    Python FastAPI AI Microservice                │
│       (Hugging Face BART Summarizer & DistilBERT Sentiment)      │
└──────────────────────────────────────────────────────────────────┘


### Tech Stack Breakdown
* **Frontend:** React 18, TypeScript, Vite, CSS Modules / Tailwind.
* **API Gateway:** Node.js, ExpressJS, Apollo Server 4, GraphQL.
* **AI Engine:** Python 3.10+, FastAPI, Hugging Face `transformers`, PyTorch, Uvicorn.

---

##  Getting Started

### Prerequisites
* **Node.js:** v18+ and `npm`
* **Python:** 3.10+ and `pip`

---

### 1 AI Microservice (FastAPI + Hugging Face)

```bash
# Navigate to AI service
cd ai-service

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --port 8000 --reload
The AI service will start at http://127.0.0.1:8000. API documentation is available at http://127.0.0.1:8000/docs.

 API Gateway (ExpressJS + GraphQL)
Bash
# Navigate to GraphQL Gateway
cd graphql-gateway

# Install dependencies
npm install

# Start ExpressJS server
npm start
The GraphQL Gateway will run on http://localhost:4000/graphql.

 Frontend Client (React + TypeScript)
Bash
# Navigate to Frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
Access the React application in your browser at http://localhost:5173/.

 API Reference
GraphQL Mutations & Queries (http://localhost:4000/graphql)
Generate Insight Mutation
GraphQL
mutation AnalyzeReport($text: String!) {
  analyzeReport(text: $text) {
    id
    summary
    sentiment
    confidence
    timestamp
  }
}
Fetch Insights Query
GraphQL
query GetInsights {
  getInsights {
    id
    summary
    sentiment
    confidence
    timestamp
  }
}
 Sample Test Input
Paste this financial update into the dashboard to test sentiment analysis and summarization:

"Australia's commercial property funds delivered strong quarterly results, outperforming initial risk benchmarks by 14%. Driven by high occupancy rates across industrial logistics hubs in Sydney and Melbourne, distribution yields reached a 3-year high."

 Future Enhancements
[ ] Database integration using PostgreSQL & Prisma ORM.

[ ] Docker Compose orchestration for single-command deployment.

[ ] Vector database support (Pinecone / ChromaDB) for PDF document Q&A (RAG pipeline).
