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







