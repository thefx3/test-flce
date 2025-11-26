import "../components/StartTestForm.css"

export default function PersonnalInfos({ form, onChange }) {
    return (
      <div className="form-section">
  
        {/* Civility */}
        <p className="section-label">Civility</p>
  
        <label className="radio-line">
          <input
            type="radio"
            name="civility"
            value="Mr"
            checked={form.civility === "Mr"}
            onChange={onChange}
          />
          Monsieur
        </label>
  
        <label className="radio-line">
          <input
            type="radio"
            name="civility"
            value="Mrs"
            checked={form.civility === "Mrs"}
            onChange={onChange}
          />
          Madame
        </label>
  
        {/* Name */}
        <label className="field">
          <span>First Name</span>
          <input type="text" name="name" value={form.name} onChange={onChange} />
        </label>
  
        <label className="field">
          <span>Last Name</span>
          <input type="text" name="lastname" value={form.lastname} onChange={onChange} />
        </label>
  
        {/* Email */}
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={onChange} />
        </label>
  
        {/* Phone */}
        <label className="field">
          <span>Phone</span>
          <input type="tel" name="phone" value={form.phone} onChange={onChange} />
        </label>
  
        {/* Birthdate */}
        <label className="field">
          <span>Birthdate</span>
          <input type="date" name="birthdate" value={form.birthdate} onChange={onChange} />
        </label>
  
        {/* Birthplace */}
        <label className="field">
          <span>Birthplace</span>
          <input type="text" name="birthplace" value={form.birthplace} onChange={onChange} />
        </label>
  
        {/* Nationality */}
        <label className="field">
          <span>Nationality</span>
          <input type="text" name="nationality" value={form.nationality} onChange={onChange} />
        </label>
  
        {/* Address */}
        <p className="section-label">Address</p>
  
        <div className="grid-2">
          <label className="field">
            <span>N°</span>
            <input type="text" name="address_number" value={form.address_number} onChange={onChange} />
          </label>
  
          <label className="field">
            <span>Street</span>
            <input type="text" name="address_street" value={form.address_street} onChange={onChange} />
          </label>
        </div>
  
        <div className="grid-2">
          <label className="field">
            <span>City</span>
            <input type="text" name="address_city" value={form.address_city} onChange={onChange} />
          </label>
  
          <label className="field">
            <span>ZIP Code</span>
            <input type="text" name="address_zipcode" value={form.address_zipcode} onChange={onChange} />
          </label>
        </div>
  
        <label className="field">
          <span>Country</span>
          <input type="text" name="address_country" value={form.address_country} onChange={onChange} />
        </label>
      </div>
    );
  }
  