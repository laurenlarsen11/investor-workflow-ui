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
      fontFamily: 'var(--font-body)',
      background: 'linear-gradient(to bottom, #1869c2, #021d39)',
      color: '#f3f3f3'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-title)',
        fontSize: '2.5rem',
        marginBottom: '0.5rem'
      }}>
        CivilizationX Startup Interest
      </h1>
      <p style={{ maxWidth: '650px' }}>
        Review decks and express soft commitments on the startups below. Minimum investment is £5,000 per deal.
      </p>

      <div style={{
        backgroundColor: 'white',
        color: '#111',
        padding: '1.5rem',
        borderRadius: '12px',
        margin: '2rem 0',
        lineHeight: '1.6'
      }}>
        <p><strong>CivilizationX</strong> is an angel syndicate investing in foundational AI infrastructure.</p>
        <p>Submit interest below to help us gauge soft commitments. Formal due diligence will follow.</p>
        <p>By submitting, you agree to our GDPR policy and allow us to contact you. Your data will not be shared externally.</p>
        <p>Email <a href="mailto:team@civilizationx.co.uk">team@civilizationx.co.uk</a> with questions or to request the data room.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {startups.map((startup) => (
          <div
            key={startup.id}
            style={{
              background: '#fff',
              color: '#111',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-title)' }}>{startup.name}</h2>
            {startup.description && <p style={{ fontSize: '0.95rem' }}>{startup.description}</p>}
            {startup.sector && Array.isArray(startup.sector) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {startup.sector.map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e3a8a',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem'
                  }}>{tag}</span>
                ))}
              </div>
            )}
            {startup.pitchDeck && <p><a href={startup.pitchDeck} target="_blank">📄 Pitch Deck</a></p>}
            {startup.investmentMemo && <p><a href={startup.investmentMemo} target="_blank">📝 Investment Memo</a></p>}

            <button
              onClick={() => setSelectedStartup(startup.name)}
              style={{
                marginTop: '1rem',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.6rem 1.2rem',
                cursor: 'pointer'
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




