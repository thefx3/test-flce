import "../components/TestForm.css"
export default function HostingFamily({ family, onChange }) {
    return (
      <div className="form-section">
        <h2 className="section-title">Hosting Family</h2>
  
        <label className="field">
          <span>Family Name 1</span>
          <input
            type="text"
            name="familyname1"
            value={family.familyname1}
            onChange={onChange}
          />
        </label>
  
        <label className="field">
          <span>Family Name 2</span>
          <input
            type="text"
            name="familyname2"
            value={family.familyname2}
            onChange={onChange}
          />
        </label>
  
        <div className="field-group">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={family.email}
                onChange={onChange}
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="number"
                name="phone"
                value={family.phone}
                onChange={onChange}
              />
            </label>
        </div>
      </div>
    );
  }
  