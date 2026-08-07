const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const axios = require('axios');

// GraphQL Schema definition
const typeDefs = `#graphql
  type Insight {
    id: ID!
    summary: String!
    sentiment: String!
    confidence: Float!
    timestamp: String!
  }

  type Query {
    getInsights: [Insight!]!
  }

  type Mutation {
    analyzeReport(text: String!): Insight!
  }
`;

// In-memory data store (can be easily swapped with PostgreSQL)
const insightsDatabase = [];

// Resolvers
const resolvers = {
  Query: {
    getInsights: () => insightsDatabase,
  },
  Mutation: {
    analyzeReport: async (_, { text }) => {
      try {
        // HTTP call to Python FastAPI microservice
        const aiResponse = await axios.post('http://localhost:8000/analyze', { text });
        const { sentiment, confidence, summary } = aiResponse.data;

        const newInsight = {
          id: String(insightsDatabase.length + 1),
          summary,
          sentiment,
          confidence: Math.round(confidence * 100) / 100,
          timestamp: new Date().toISOString(),
        };

        insightsDatabase.unshift(newInsight);
        return newInsight;
      } catch (error) {
        console.error('Error communicating with AI Service:', error.message);
        throw new Error('Failed to analyze financial document');
      }
    },
  },
};

async function startGateway() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  app.use(cors(), express.json(), expressMiddleware(server));

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 ExpressJS GraphQL Gateway active on http://localhost:${PORT}/graphql`);
  });
}

startGateway();