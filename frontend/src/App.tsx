import React, { useState, useEffect } from 'react';

interface Insight {
  id: string;
  summary: string;
  sentiment: string;
  confidence: number;
  timestamp: string;
}

const GRAPHQL_URL = 'http://localhost:4000/graphql';

export default function App() {
  const [text, setText] = useState<string>('');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsights = async () => {
    const query = `
      query {
        getInsights {
          id
          summary
          sentiment
          confidence
          timestamp
        }
      }
    `;
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      setInsights(result.data?.getInsights || []);
    } catch (err) {
      console.error('Failed to fetch insights', err);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);

    const sanitizedText = text.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const mutation = `
      mutation {
        analyzeReport(text: "${sanitizedText}") {
          id
          summary
          sentiment
          confidence
          timestamp
        }
      }
    `;

    try {
      await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation }),
      });
      setText('');
      await fetchInsights();
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 20px' }}>
      <header style={{ borderBottom: '2px solid #eaeaea', pb: '10px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#1a1a1a' }}>SmartPortfolio AI</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>AI-Powered Financial Insights Gateway</p>
      </header>

      <form onSubmit={handleAnalyze} style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
          Fund Market Document / News Update:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste corporate earnings update, fund performance notes, or market news..."
          rows={5}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          style={{
            marginTop: '12px',
            padding: '10px 20px',
            backgroundColor: loading ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? 'Processing through AI Pipeline...' : 'Generate Insight'}
        </button>
      </form>

      <section>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Latest Analyzed Reports</h2>
        {insights.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No reports analyzed yet.</p>
        ) : (
          insights.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: item.sentiment === 'POSITIVE' ? '#dcfce7' : '#fee2e2',
                    color: item.sentiment === 'POSITIVE' ? '#15803d' : '#b91c1c',
                  }}
                >
                  {item.sentiment} ({Math.round(item.confidence * 100)}% confidence)
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                <strong>Summary:</strong> {item.summary}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}