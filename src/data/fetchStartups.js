export async function fetchStartups() {
    const res = await fetch(
      `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_AIRTABLE_TABLE_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
        },
      }
    );
  
    const { records } = await res.json();
  
    return records.map((record) => ({
      name: record.fields['Startup Name'],
      pitchDeck: record.fields['Pitch Deck'],
      investmentMemo: record.fields['Investment Memo'],
      dataroom: record.fields['Dataroom'],
    }));
  }
  