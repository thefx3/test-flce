import "../components/StartTestForm.css"

export default function HostingFamily({ family, onChange }) {
    return (
      <div className="form-section">
        <h3 className="section-title">Hosting Family</h3>
  
        <label className="field">
          <span>Family Name 1</span>
          <input type="text" name="familyname1" value={family.familyname1} onChange={onChange} />
        </label>
  
        <label className="field">
          <span>Family Name 2</span>
          <input type="text" name="familyname2" value={family.familyname2} onChange={onChange} />
        </label>
  
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" value={family.email} onChange={onChange} />
        </label>
  
        <label className="field">
          <span>Phone</span>
          <input type="tel" name="phone" value={family.phone} onChange={onChange} />
        </label>
      </div>
    );
  }
  