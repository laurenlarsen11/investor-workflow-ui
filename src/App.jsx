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
    console.log("\ud83d\udce4 Submitting this data to Airtable:", formData);

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
      console.log("\ud83d\udce8 Airtable raw response:", responseText);

      if (!res.ok) {
        console.error("\u274c Submission failed:", responseText);
      }
    } catch (error) {
      console.error("\u274c Network error:", error);
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #000000, #03436a, #07669f)',
      color: '#f5f5f5'
    }}>
      <h1 style={{ color: '#ffffff' }}>Startup Interest Form</h1>
      <p>Select a startup to view its materials and express interest.</p>

      <div style={{
        fontSize: '0.9rem',
        lineHeight: '1.6',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        color: '#ffffff',
        padding: '1.5rem',
        borderRadius: '8px',
        margin: '1.5rem 0',
      }}>
        <p><strong>CivilizationX</strong> is an angel syndicate dedicated to strategically investing in the foundational layers of Artificial Intelligence. We are a collective of forward-thinking individuals united by a shared vision: to propel civilization beyond its current technological horizons by fostering groundbreaking innovations in Hardware, Data, Machine Learning Operations, Cloud Infrastructure, and Foundational Models.</p>
        <p>As you review the pitch decks and investment memorandums for these four promising AI infrastructure startups, we encourage you to indicate your interest in investing in any or all of them, with a minimum investment of £5,000 per startup. At this stage, we are gathering soft commitments or indications of interest. This will help the syndicate and the individual startups gauge the level of funding interest and plan accordingly for the next steps, which will involve more detailed due diligence and the formal investment agreements.</p>
        <p>By submitting this form, you acknowledge and consent to the collection and use of your personal data, as included in your submission. We assure you that your data will be handled in compliance with GDPR regulations, ensuring privacy and security. You also agree to CivilizationX contacting you regarding this submission and future opportunities related to your interests in our community. Your personal data will not be shared with third parties without your explicit consent. For more information or to exercise your GDPR rights, please contact us at <a style={{ color: '#aad8ff' }} href="mailto:team@civilizationx.co.uk">team@civilizationx.co.uk</a>.</p>
        <p>The Dataroom for each startup is available upon request - please indicate in the 'Additional Notes' section of the interest form if you are interested in viewing it.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem',
      }}>
        {startups.map((startup) => (
          <div
            key={startup.id}
            style={{
              border: '1px solid #2a3b4c',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              color: '#ffffff'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{startup.name}</h2>

            {startup.description && (
              <p style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                {startup.description}
              </p>
            )}
            {startup.sector && Array.isArray(startup.sector) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {startup.sector.map((tag, index) => (
                  <span key={index} style={{
                    backgroundColor: '#ffffff22',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {startup.pitchDeck && (
              <div><a href={startup.pitchDeck} target="_blank" rel="noopener noreferrer" style={{ color: '#aad8ff' }}>📄 Pitch Deck</a></div>
            )}
            {startup.investmentMemo && (
              <div><a href={startup.investmentMemo} target="_blank" rel="noopener noreferrer" style={{ color: '#aad8ff' }}>📝 Investment Memo</a></div>
            )}

            <button
              onClick={() => setSelectedStartup(startup.name)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#aad8ff',
                color: '#000',
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




