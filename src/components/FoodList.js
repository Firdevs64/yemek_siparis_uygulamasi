// React ve useState hook'unu import ediyoruz
import React, { useState } from "react";

// FoodDetail bileşenini import ediyoruz
import FoodDetail from "./FoodDetail";

// FoodList bileşeni - Yemek/içecek listesini gösterir
// Props: foods (yemek/içecek listesi), deleteFood (silme fonksiyonu), orders (siparişler), users (kullanıcılar), title (başlık)
function FoodList({ foods, deleteFood, orders, users, title = "Yemek Listesi" }) {
  // Seçili yemek state'i - Hangi yemeğin detayının gösterileceğini belirler
  // null: Hiçbir yemek seçili değil
  const [selectedFood, setSelectedFood] = useState(null);

  // Yemek tıklama işleyicisi
  // Eğer aynı yemek tekrar tıklanırsa detayı gizle, farklı yemek tıklanırsa onu göster
  const handleFoodClick = (food) => {
    setSelectedFood(selectedFood?.id === food.id ? null : food);
  };

  return (
    <div className="food-list">
      <h3>{title}</h3>
      
      {/* Yemek grid'i - Tüm yemekleri listeler */}
      <div className="food-grid">
        {/* map(): Her yemek için bir div oluştur */}
        {foods.map((food, index) => (
          <div key={food.id} className="food-item">
            {/* Sıra numarası */}
            <span className="food-number">{index + 1}</span> 
            
            {/* Yemek adı input'u - Tıklanabilir */}
            <input
              type="text"
              value={food.name}
              readOnly
              className="food-name-input"
              onClick={() => handleFoodClick(food)}
            />
            
            {/* Silme butonu */}
            <button 
              onClick={() => deleteFood(food.id)}
              className="delete-btn"
            >
              SIL
            </button>
            
            {/* Detay/Gizle butonu - Duruma göre değişir */}
            <button 
              onClick={() => handleFoodClick(food)}
              className="detail-btn"
            >
              {selectedFood?.id === food.id ? "GİZLE" : "DETAY"}
            </button>
          </div>
        ))}
      </div>

      {/* Koşullu render: Sadece bir yemek seçiliyse FoodDetail göster */}
      {selectedFood && (
        <div className="food-detail-container">
          <FoodDetail 
            food={selectedFood} 
            orders={orders} 
            users={users}
          />
        </div>
      )}
    </div>
  );
}

// Bileşeni dışa aktar
export default FoodList;