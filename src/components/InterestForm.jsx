import { useState } from 'react';
import '../formStyles.css';

export default function InterestForm({ startup, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    investmentAmount: '',
    experience: '',
    strategicValue: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ ...form, startup });
    onClose();
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#000',
    marginBottom: '0.25rem',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflowY: 'auto',
        maxHeight: '90vh',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Interest in {startup}</h2>

        {/* ✅ DISCLAIMER TEXT START */}
        <div style={{ fontSize: '0.85rem', lineHeight: '1.5', backgroundColor: '#f7f7f7', padding: '1rem', borderRadius: '6px' }}>
          <p><strong>CivilizationX</strong> is an angel syndicate dedicated to strategically investing in the foundational layers of Artificial Intelligence. We are a collective of forward-thinking individuals united by a shared vision: to propel civilization beyond its current technological horizons by fostering groundbreaking innovations in Hardware, Data, Machine Learning Operations, Cloud Infrastructure, and Foundational Models.</p>
          <p>As you review the pitch decks and investment memorandums for these four promising AI infrastructure startups, we encourage you to indicate your interest in investing in any or all of them, with a minimum investment of £5,000 per startup. At this stage, we are gathering soft commitments or indications of interest. This will help the syndicate and the individual startups gauge the level of funding interest and plan accordingly for the next steps, which will involve more detailed due diligence and the formal investment agreements.</p>
          <p>By submitting this form, you acknowledge and consent to the collection and use of your personal data, as included in your submission. We assure you that your data will be handled in compliance with GDPR regulations, ensuring privacy and security. You also agree to CivilizationX contacting you regarding this submission and future opportunities related to your interests in our community. Your personal data will not be shared with third parties without your explicit consent. For more information or to exercise your GDPR rights, please contact us at <a href="mailto:team@civilizationx.co.uk">team@civilizationx.co.uk</a>.</p>
        </div>
        {/* ✅ DISCLAIMER TEXT END */}

        <label htmlFor="name" style={labelStyle}>Your name</label>
        <input id="name" name="name" onChange={handleChange} required />

        <label htmlFor="email" style={labelStyle}>Email</label>
        <input id="email" name="email" type="email" onChange={handleChange} required />

        <label htmlFor="investmentAmount" style={labelStyle}>Investment Amount</label>
        <input id="investmentAmount" name="investmentAmount" onChange={handleChange} />

        <label htmlFor="experience" style={labelStyle}>Have you invested before?</label>
        <select id="experience" name="experience" onChange={handleChange} required>
          <option value="">Select...</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <label htmlFor="strategicValue" style={labelStyle}>Strategic Value (optional)</label>
        <input id="strategicValue" name="strategicValue" onChange={handleChange} />

        <label htmlFor="notes" style={labelStyle}>Additional Notes</label>
        <textarea id="notes" name="notes" onChange={handleChange} />

        <button type="submit" style={{
          background: '#000',
          color: '#fff',
          padding: '0.75rem',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}>
          Submit
        </button>

        <button type="button" onClick={onClose} style={{
          background: '#eee',
          color: '#333',
          padding: '0.75rem',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
        }}>
          Cancel
        </button>
      </form>
    </div>
  );
}







