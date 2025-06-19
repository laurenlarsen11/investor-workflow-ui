import React, { useEffect, useState } from 'react';
import { fetchStartups } from './data/fetchStartups';
import InterestForm from './components/InterestForm';
import './App.css';

function App() {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);

  useEffect(() => {
    fetchStartups().then(setStartups);
  }, []);


  const handleAirtableSubmit = async (formData) => {
    const res = await fetch('https://api.airtable.com/v0/appV5AzCASIk3QV6z/Investor%20Submissions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          "Startup Interested In": formData.startup,
          "Name": formData.name,
          "Email": formData.email,
          "Investment Amount": formData.investmentAmount,
          "Experience": formData.experience,
          "Strategic Interest": formData.strategicValue,
          "Notes": formData.notes,
        }
      }),
    });

    const data = await res.json();
    console.log('✅ Submitted to Airtable:', data);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Investor Workflow</h1>
      <p>Select a startup to view its materials and express interest.</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {startups.map((startup) => (
          <div key={startup.name} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
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



