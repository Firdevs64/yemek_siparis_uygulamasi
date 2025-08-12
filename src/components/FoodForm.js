import React, { useState } from "react";

function FoodForm({ addFood, type = "yemek" }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Sadece 'name' alanını içeren bir obje gönderin.
    // created_at alanı veritabanı tarafından otomatik olarak eklenecek.
    await addFood({ name: name.trim() });
    
    setName("");
  };

  const placeholder = type === "içecek" ? "Yeni içecek adı" : "Yeni yemek adı";

  return (
    <form onSubmit={handleSubmit} className="food-form">
      <div className="form-row">
        <input
          type="text"
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="food-input"
        />
        <button type="submit" className="save-btn">
          KAYDET
        </button>
      </div>
    </form>
  );
}

export default FoodForm;
