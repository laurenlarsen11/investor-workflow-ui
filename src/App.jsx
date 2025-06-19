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
        pitchDeck: record.fields['Pitch Deck'],
        investmentMemo: record.fields['Investment Memo'],
        dataroom: record.fields['Dataroom'],
      }));

      setStartups(formatted);
    }

    fetchStartups();
  }, []);

  const handleAirtableSubmit = async (formData) => {
    try {
      const res = await fetch('https://api.airtable.com/v0/appV5AzCASIk3QV6z/Investor%20Interest', {
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
            "Investment Amount": formData.investmentAmount,
            "Investment Experience": formData.experience,
            "Strategic Value & Fit": formData.strategicValue,
            "Additional Notes": formData.notes,
          }
        }),
      });

      const data = await res.json();
      console.log("✅ Submitted to Airtable:", data);
    } catch (error) {
      console.error("❌ Airtable submission failed:", error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Investor Workflow</h1>
      <p>Select a startup to view its materials and express interest.</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {startups.map((startup) => (
          <div key={startup.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h2>{startup.name}</h2>
            {startup.pitchDeck && <a href={startup.pitchDeck} target="_blank" rel="noopener noreferrer">📄 Pitch Deck</a>}<br />
            {startup.investmentMemo && <a href={startup.investmentMemo} target="_blank" rel="noopener noreferrer">📝 Investment Memo</a>}<br />
            {startup.dataroom && <a href={startup.dataroom} target="_blank" rel="noopener noreferrer">📁 Dataroom</a>}<br />
            <br />
            <button onClick={() => setSelectedStartup(startup.name)}>Express Interest</button>
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




