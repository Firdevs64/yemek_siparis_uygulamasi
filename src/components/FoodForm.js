// React ve useState hook'unu import ediyoruz
import React, { useState } from "react";

// FoodForm bileşeni - Yeni yemek/içecek ekleme formu
// Props: addFood (ekleme fonksiyonu), type (tür - "yemek" veya "içecek")
function FoodForm({ addFood, type = "yemek" }) {
  // Form input'u için state - Kullanıcının yazdığı metin
  const [name, setName] = useState("");

  // Form submit işleyicisi
  // e.preventDefault(): Sayfanın yenilenmesini engelle
  // trim(): Başındaki ve sonundaki boşlukları temizle
  // Validation: Boş metin kontrolü
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return; // Boşsa işlemi durdur
    addFood({ name: name.trim(), description: "" }); // Yeni yemek/içecek ekle
    setName(""); // Form'u temizle
  };

  // Dinamik placeholder metni - Tür'e göre değişir
  const placeholder = type === "içecek" ? "Yeni içecek adı" : "Yeni yemek adı";

  return (
    <form onSubmit={handleSubmit} className="food-form">
      <div className="form-row">
        {/* Text input - Kullanıcı yemek/içecek adını yazar */}
        <input
          type="text"
          placeholder={placeholder}
          value={name} // Controlled component - React state'i ile kontrol edilir
          onChange={(e) => setName(e.target.value)} // Her yazı değişikliğinde state'i güncelle
          className="food-input"
        />
        
        {/* Submit butonu - Form'u gönderir */}
        <button type="submit" className="save-btn">
          KAYDET
        </button>
      </div>
    </form>
  );
}

// Bileşeni dışa aktar
export default FoodForm;