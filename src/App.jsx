import React, { useEffect, useState } from 'react';
import InterestForm from './components/InterestForm';
import './App.css';

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
    console.log("📤 Submitting this data to Airtable:", formData);
  
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
      console.log("📨 Airtable raw response:", responseText);
  
      if (!res.ok) {
        console.error("❌ Submission failed:", responseText);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  };
  

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Startup Interest Form</h1>
      <p>Select a startup to view its materials and express interest.</p>
  
      {/* ✅ Disclaimer is now ABOVE the grid */}
      <div style={{
        fontSize: '0.9rem',
        lineHeight: '1.6',
        backgroundColor: '#f7f7f7',
        color: '#333',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '1.5rem 0',
      }}>
        <p><strong>CivilizationX</strong> is an angel syndicate dedicated to strategically investing in the foundational layers of Artificial Intelligence. We are a collective of forward-thinking individuals united by a shared vision: to propel civilization beyond its current technological horizons by fostering groundbreaking innovations in Hardware, Data, Machine Learning Operations, Cloud Infrastructure, and Foundational Models.</p>
        <p>As you review the pitch decks and investment memorandums for these four promising AI infrastructure startups, we encourage you to indicate your interest in investing in any or all of them, with a minimum investment of £5,000 per startup. At this stage, we are gathering soft commitments or indications of interest. This will help the syndicate and the individual startups gauge the level of funding interest and plan accordingly for the next steps, which will involve more detailed due diligence and the formal investment agreements.</p>
        <p>By submitting this form, you acknowledge and consent to the collection and use of your personal data, as included in your submission. We assure you that your data will be handled in compliance with GDPR regulations, ensuring privacy and security. You also agree to CivilizationX contacting you regarding this submission and future opportunities related to your interests in our community. Your personal data will not be shared with third parties without your explicit consent. For more information or to exercise your GDPR rights, please contact us at <a href="mailto:team@civilizationx.co.uk">team@civilizationx.co.uk</a>.</p>
        <p>The Dataroom for each startup is available upon request - please indicate in the 'Additional Notes' section of the interest form if you are interested in viewing it.</p>
      </div>
  
      {/* ✅ Startup grid below */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          marginTop: '2rem',
        }}
      >
        {startups.map((startup) => (
          <div
            key={startup.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
              textAlign: 'left',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#222' }}>{startup.name}</h2>
  
            {startup.description && (
              <p style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.95rem' }}>
              {startup.description}
              </p>
            )}
            {startup.sector && (
              <p style={{
              backgroundColor: '#e0e7ff',
              color: '#1e40af',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: '600',
               marginBottom: '0.75rem',
            }}>
              {startup.sector}
            </p>
            )}
            {startup.pitchDeck && (
              <div><a href={startup.pitchDeck} target="_blank" rel="noopener noreferrer">📄 Pitch Deck</a></div>
            )}
            {startup.investmentMemo && (
              <div><a href={startup.investmentMemo} target="_blank" rel="noopener noreferrer">📝 Investment Memo</a></div>
            )}
  
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




