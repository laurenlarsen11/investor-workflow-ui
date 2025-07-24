import React, { useEffect, useState } from 'react';
import InterestForm from './components/InterestForm';
import './App.css';
import './index.css';

function App() {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);

  useEffect(() => {
    async function fetchStartups() {
      const res = await fetch('https://api.airtable.com/v0/appV5AzCASIk3QV6z/Startups', {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`
        }
      });

      const data = await res.json();
      const formatted = data.records.map((record) => ({
        id: record.id,
        name: record.fields['Startup Name'],
        description: record.fields['Description'],
        sector: record.fields['Sector(s)'],
        pitchDeck: record.fields['Pitch Deck'],
        investmentMemo: record.fields['Investment Memo'],
      }));

      setStartups(formatted);
    }

    fetchStartups();
  }, []);

  const handleAirtableSubmit = async (formData) => {
    try {
      const res = await fetch(
        'https://api.airtable.com/v0/appV5AzCASIk3QV6z/Investor%20Interest',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              "Investor name": formData.name,
              "Email": formData.email,
              "Startup Interested In": formData.startup,
              "Investment Amount ($)": formData.investmentAmount,
              "Investment Experience": formData.experience,
              "Strategic Value & Fit": formData.strategicValue,
              "Additional Notes": formData.notes,
            },
          }),
        }
      );

      const responseText = await res.text();
      if (!res.ok) {
        console.error("❌ Submission failed:", responseText);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      minHeight: '100vh',
      fontFamily: 'Agrandir, sans-serif',
      background: 'linear-gradient(to bottom, #1869c2, #021d39)',
      color: '#f5f5f5'
    }}>
      <h1 style={{
        fontFamily: 'Horizon, sans-serif',
        fontSize: '2.5rem',
        marginBottom: '0.5rem'
      }}>
        Startup Interest Form
      </h1>
      <p>Select a startup to view its materials and express interest.</p>

      <div style={{
        fontSize: '0.9rem',
        lineHeight: '1.6',
        backgroundColor: '#f7f7f7',
        color: '#333',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '1.5rem 0',
      }}>
        <p><strong>CivilizationX</strong> is an angel syndicate dedicated to strategically investing in the foundational layers of Artificial Intelligence...</p>
        <p>We encourage you to indicate your interest in investing in any or all of them, with a minimum investment of £5,000 per startup...</p>
        <p>By submitting this form, you acknowledge and consent to the collection and use of your personal data... <a href="mailto:team@civilizationx.co.uk">team@civilizationx.co.uk</a>.</p>
        <p>The Dataroom for each startup is available upon request...</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {startups.map((startup) => (
          <div key={startup.id} style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '12px',
            backgroundColor: '#fff',
            color: '#000',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              marginBottom: '0.75rem',
              fontFamily: 'Horizon, sans-serif'
            }}>{startup.name}</h2>

            {startup.description && <p style={{ marginBottom: '0.75rem' }}>{startup.description}</p>}

            {startup.sector && Array.isArray(startup.sector) && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                {startup.sector.map((tag, i) => (
                  <span key={i} style={{
                    backgroundColor: '#e0e0e0',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem'
                  }}>{tag}</span>
                ))}
              </div>
            )}

            {startup.pitchDeck && <div><a href={startup.pitchDeck} target="_blank">📄 Pitch Deck</a></div>}
            {startup.investmentMemo && <div><a href={startup.investmentMemo} target="_blank">📝 Investment Memo</a></div>}

            <button
              onClick={() => setSelectedStartup(startup.name)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#111',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Express Interest
            </button>
          </div>
        ))}
      </div>

      {selectedStartup && (
        <InterestForm
          startup={selectedStartup}
          onClose={() => setSelectedStartup(null)}
          onSubmit={handleAirtableSubmit}
        />
      )}
    </div>
  );
}

export default App;



