// React kütüphanesini import ediyoruz
import React from "react";

// FoodDetail bileşeni - Seçili yemeğin detaylı bilgilerini gösterir
// Props: food (seçili yemek), orders (tüm siparişler), users (tüm kullanıcılar)
function FoodDetail({ food, orders, users }) {
  // ===== HESAPLAMA FONKSİYONLARI =====
  
  // Bu yemeğin sipariş geçmişini hesapla
  // filter(): Bu yemeğe ait tüm siparişleri filtrele
  const getFoodOrders = () => {
    return orders.filter(order => order.foodId === food.id);
  };

  // Bu yemeği sipariş eden kullanıcıları bul
  // Set: Tekrarlanan kullanıcı ID'lerini kaldır
  // map(): Siparişlerden kullanıcı ID'lerini al
  const getFoodUsers = () => {
    const foodOrders = getFoodOrders();
    const userIds = [...new Set(foodOrders.map(order => order.userId))];
    return users.filter(user => userIds.includes(user.id));  //includes(): Kullanıcı ID'lerini kontrol eder.True/false döndürür.
  };

  // Toplam sipariş adedi
  // reduce(): Tüm siparişlerin miktarını topla
  const getTotalQuantity = () => {
    return getFoodOrders().reduce((total, order) => total + order.quantity, 0);  //reduce(): Siparişlerin toplamını hesaplar.
  };

  // Durum dağılımı hesapla
  // forEach(): Her sipariş için durum sayısını artır
  const getStatusDistribution = () => {
    const foodOrders = getFoodOrders();
    const statusCount = {};
    
    foodOrders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    
    return statusCount;
  };

  // Hesaplamaları yap ve değişkenlere ata
  const foodOrders = getFoodOrders();
  const foodUsers = getFoodUsers();
  const totalQuantity = getTotalQuantity();
  const statusDistribution = getStatusDistribution(); //statusDistribution: durum dağılımını tutmak için kullanılan bir değişkendir.

  return (
    <div className="food-detail">
      {/* Başlık bölümü */}
      <div className="detail-header">
        <h3>{food.name}</h3>
        <span className="food-id">ID: {food.id}</span>
      </div>

      {/* İstatistik kartları */}
      <div className="detail-stats">
        <div className="stat-card">
          <div className="stat-number">{totalQuantity}</div>
          <div className="stat-label">Toplam Sipariş</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{foodUsers.length}</div>
          <div className="stat-label">Sipariş Veren</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{foodOrders.length}</div>
          <div className="stat-label">Sipariş Sayısı</div>
        </div>
      </div>

      {/* Detay bölümleri */}
      <div className="detail-sections">
        {/* Durum dağılımı bölümü */}
        <div className="detail-section">
          <h4>Durum Dağılımı</h4>
          <div className="status-list">
            {/* Object.entries(): Objeyi [key, value] çiftlerine çevir */}
            {Object.entries(statusDistribution).map(([status, count]) => (  //Object.entries(): Objeyi [key, value] çiftlerine çevirir.
              <div key={status} className="status-item">
                <span className="status-name">{status.toUpperCase()}</span>  
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sipariş veren kullanıcılar bölümü */}
        <div className="detail-section">
          <h4>Sipariş Veren Kullanıcılar</h4>
          <div className="user-list">
            {foodUsers.map(user => (
              <div key={user.id} className="user-item">
                <span className="user-name">{user.name}</span>
                <span className="user-office">{user.office}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Son siparişler bölümü */}
        <div className="detail-section">
          <h4>Son Siparişler</h4>
          <div className="recent-orders">
            {/* slice(-5): Son 5 siparişi al, reverse(): Ters çevir */}
            {foodOrders.slice(-5).reverse().map(order => {  
              const user = users.find(u => u.id === order.userId);
              return (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-user">{user?.name}</span>
                    <span className="order-date">{order.date} {order.time}</span>
                  </div>
                  <div className="order-details">
                    <span className="order-quantity">{order.quantity} adet</span>
                    <span 
                      className="order-status"
                      style={{ 
                        backgroundColor: getStatusColor(order.status),
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        color: '#fff'
                      }}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Durum renkleri için yardımcı fonksiyon
const getStatusColor = (status) => {
  switch(status) {
    case "hazırlanıyor": return "#f39c12";
    case "hazır": return "#27ae60";
    case "teslim edildi": return "#3498db";
    default: return "#95a5a6";
  }
};

export default FoodDetail;
