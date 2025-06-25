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
              "Investment Amount": formData.investmentAmount,
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
      <h1>Investor Workflow</h1>
      <p>Select a startup to view its materials and express interest.</p>
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

      {startup.pitchDeck && (
        <div><a href={startup.pitchDeck} target="_blank" rel="noopener noreferrer">📄 Pitch Deck</a></div>
      )}
      {startup.investmentMemo && (
        <div><a href={startup.investmentMemo} target="_blank" rel="noopener noreferrer">📝 Investment Memo</a></div>
      )}
      {startup.dataroom && (
        <div><a href={startup.dataroom} target="_blank" rel="noopener noreferrer">📁 Dataroom</a></div>
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




