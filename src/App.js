// React'ın temel kütüphanelerini import ediyoruz
// useState: Bileşenlerde durum (state) yönetimi için
// useEffect: Yan etkiler (side effects) için (LocalStorage kaydetme gibi)
import React, { useState, useEffect } from "react";

// Kendi oluşturduğumuz bileşenleri import ediyoruz
import FoodList from "./components/FoodList";
import FoodForm from "./components/FoodForm";

// CSS stillerimizi import ediyoruz
import "./App.css";

// Ana uygulama bileşeni - Tüm uygulamanın merkezi
function App() {
  // LocalStorage'dan verileri yükleme fonksiyonu
  // key: LocalStorage'da saklanan verinin anahtarı
  // defaultValue: Eğer veri bulunamazsa kullanılacak varsayılan değer
  const loadFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('LocalStorage yükleme hatası:', error);
      return defaultValue;
    }
  };

  // LocalStorage'a veri kaydet
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('LocalStorage kaydetme hatası:', error);
    }
  };

  // Yemek listesi state'i - useState hook'u ile tanımlıyoruz
  // foods: Mevcut yemek listesi (array)
  // setFoods: Yemek listesini güncellemek için fonksiyon
  // useState(() => ...): Lazy initialization - Sadece ilk render'da çalışır
  const [foods, setFoods] = useState(() => 
    loadFromStorage('foods', [
      { id: 1, name: "İstemiyorum", description: "" },
      { id: 2, name: "Soğuk Sandviç", description: "" },
      { id: 3, name: "Domates-Peynir Tost", description: "" },
      { id: 4, name: "Karışık Tost", description: "" },
      { id: 5, name: "Pizza", description: "" },
      { id: 6, name: "Hamburger", description: "" },
      { id: 7, name: "Patates Kızartması", description: "" },
      { id: 8, name: "Sezar Salata", description: "" },
      { id: 9, name: "Ton Balıklı Salata", description: "" },
      { id: 10, name: "Tavuk Döner", description: "" },
    ])
  );

  // Kullanıcı listesi state'i
  // users: Mevcut kullanıcı listesi (array)
  // setUsers: Kullanıcı listesini güncellemek için fonksiyon
  const [users, setUsers] = useState(() => 
    loadFromStorage('users', [
      { id: 1, name: "Neslihan Lokman", office: "Ofis 1", password: "123" },
      { id: 2, name: "Elif Sakar", office: "Ofis 1", password: "admin" },
      { id: 3, name: "Şeval Pöze", office: "Ofis 2", password: "456" },
      { id: 4, name: "Adem Köse", office: "Ofis 3", password: "789" },
      { id: 5, name: "Eymen Köse", office: "Ofis 3", password: "101" },
      { id: 6, name: "Emine Ceri", office: "Ofis 2", password: "123456" },
      { id: 7, name: "Deniz Aren Toy", office: "Ofis 3", password: "101" },
    ])
  );

  const [orders, setOrders] = useState(() => 
    loadFromStorage('orders', [
      { 
        id: 1,
        userId: 1, 
        foodId: 4, 
        quantity: 1, 
        date: "2025-07-28",
        time: "12:30",
        status: "hazırlanıyor"
      },
      { 
        id: 2,
        userId: 1, 
        foodId: 2, 
        quantity: 1, 
        date: "2025-07-28",
        time: "12:30",
        status: "hazır"
      },
      { 
        id: 3,
        userId: 3, 
        foodId: 2, 
        quantity: 1, 
        date: "2025-07-28",
        time: "13:15",
        status: "teslim edildi"
      },
      { 
        id: 4,
        userId: 4, 
        foodId: 5, 
        quantity: 2, 
        date: "2025-07-28",
        time: "14:00",
        status: "hazırlanıyor"
      },
      { 
        id: 5,
        userId: 5, 
        foodId: 6, 
        quantity: 1, 
        date: "2025-07-28",
        time: "14:30",
        status: "hazır"
      },
      { 
        id: 6,
        userId: 5, 
        foodId: 3, 
        quantity: 1, 
        date: "2025-07-28",
        time: "14:30",
        status: "hazırlanıyor"
      },
    ])
  );

  // İçecek listesi state'i
  // drinks: Mevcut içecek listesi (array)
  // setDrinks: İçecek listesini güncellemek için fonksiyon
  const [drinks, setDrinks] = useState(() => 
    loadFromStorage('drinks', [
      { id: 1, name: "Su", description: "" },
      { id: 2, name: "Çay", description: "" },
      { id: 3, name: "Kahve", description: "" },
      { id: 4, name: "Kola", description: "" },
      { id: 5, name: "Ayran", description: "" },
      { id: 6, name: "Meyve Suyu", description: "" },
      { id: 7, name: "Soda", description: "" },
      { id: 8, name: "Limonata", description: "" },
    ])
  );

  // Yeni kullanıcı formu için state
  // newUser: Form'da girilen kullanıcı bilgileri
  // setNewUser: Form verilerini güncellemek için fonksiyon
  const [newUser, setNewUser] = useState({ name: "", office: "", password: "" });
  
  // Yeni sipariş formu için state
  // newOrder: Form'da girilen sipariş bilgileri
  // setNewOrder: Form verilerini güncellemek için fonksiyon
  const [newOrder, setNewOrder] = useState({ 
    userId: "", 
    foodId: "", 
    drinkId: "",
    foodQuantity: 1,
    drinkQuantity: 1,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    status: "hazırlanıyor"
  });

  // ===== useEffect HOOK'LARI =====
  // useEffect: Bileşen render edildikten sonra çalışan fonksiyonlar
  // İkinci parametre [foods]: Sadece foods değiştiğinde çalışır
  
  // Yemek listesi değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    saveToStorage('foods', foods);
  }, [foods]);

  // Kullanıcı listesi değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    saveToStorage('users', users);
  }, [users]);

  // Sipariş listesi değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    saveToStorage('orders', orders);
  }, [orders]);

  // İçecek listesi değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    saveToStorage('drinks', drinks);
  }, [drinks]);

  // ===== CRUD FONKSİYONLARI (Create, Read, Update, Delete) =====
  
  // Yeni yemek ekleme fonksiyonu
  // food: Eklenecek yemek objesi
  // ...foods: Mevcut yemek listesini kopyala
  // Date.now(): Benzersiz ID oluştur
  const addFood = (food) => {
    setFoods([...foods, { ...food, id: Date.now() }]);
  };

  // Yemek silme fonksiyonu
  // filter(): ID'si eşleşmeyen yemekleri yeni listeye ekle
  const deleteFood = (id) => {
    setFoods(foods.filter((food) => food.id !== id));
  };

  // Yeni içecek ekleme fonksiyonu
  const addDrink = (drink) => {
    setDrinks([...drinks, { ...drink, id: Date.now() }]);
  };

  // İçecek silme fonksiyonu
  const deleteDrink = (id) => {
    setDrinks(drinks.filter((drink) => drink.id !== id));
  };

  // Sipariş silme fonksiyonu
  const deleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  // Yeni kullanıcı ekleme fonksiyonu
  // Form'u temizlemek için setNewUser kullanıyoruz
  const addUser = (user) => {
    setUsers([...users, { ...user, id: Date.now() }]);
    setNewUser({ name: "", office: "", password: "" });
  };

  // Kullanıcı silme fonksiyonu
  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  // Yeni sipariş ekleme fonksiyonu
  // order: Form'dan gelen sipariş verisi
  // Number(): String değerleri sayıya çevir (parseInt yerine daha güvenli)
  // Form'u temizlemek için setNewOrder kullanıyoruz
  const addOrder = (order) => {
    setOrders([...orders, { 
      ...order, 
      id: Date.now(),
      userId: Number(order.userId),
      foodId: Number(order.foodId),
      drinkId: order.drinkId ? Number(order.drinkId) : null,
      foodQuantity: Number(order.foodQuantity) || 1,  //foodQuantity: yemekten kaç tane sipariş edildiğini belirtmek için kullanılan bir değişkendir.
      drinkQuantity: order.drinkId ? Number(order.drinkQuantity) || 1 : 0, //drinkQuantity: içecekten kaç tane sipariş edildiğini belirtmek için kullanılan bir değişkendir.
      status: "hazırlanıyor"
    }]);
    setNewOrder({ 
      userId: "", 
      foodId: "", 
      drinkId: "",
      foodQuantity: 1,
      drinkQuantity: 1,
      date: new Date().toISOString().split('T')[0],  //toISOString(): Tarihi ISO formatına çevirir.
      time: new Date().toTimeString().slice(0, 5),
      status: "hazırlanıyor"
    });
  };

  // Sipariş durumunu güncelleme fonksiyonu
  // orderId: Güncellenecek siparişin ID'si
  // newStatus: Yeni durum
  // map(): Tüm siparişleri döngüye al, eşleşen ID'yi güncelle
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Form submit işleyicileri
  // e.preventDefault(): Sayfanın yenilenmesini engelle
  // Validation: Boş alan kontrolü
  
  // Kullanıcı formu submit işleyicisi
  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.office || !newUser.password) return;
    addUser(newUser);
  };

  // Sipariş formu submit işleyicisi
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.userId || !newOrder.foodId) return; // Sadece kullanıcı ve yemek zorunlu
    addOrder(newOrder);
  };

  // ===== HESAPLAMA FONKSİYONLARI =====
  
  // Ofis bazlı sipariş toplamlarını hesapla
  // officeNumber: Hangi ofisin siparişleri hesaplanacak
  // filter(): Belirli koşullara uyan verileri filtrele
  // forEach(): Her sipariş için işlem yap
  const getOfficeOrders = (officeNumber) => {
    const officeUsers = users.filter(user => user.office === `Ofis ${officeNumber}`);
    const officeOrderIds = officeUsers.map(user => user.id);
    
    const officeOrders = orders.filter(order => officeOrderIds.includes(order.userId));
    
    const orderSummary = {}; //orderSummary: ofis siparişlerinin toplamını tutmak için kullanılan bir değişkendir.Sipariş özeti
    officeOrders.forEach(order => {
      const food = foods.find(f => f.id === order.foodId);
      if (food) {
        orderSummary[food.name] = (orderSummary[food.name] || 0) + (order.foodQuantity || 1);
      }
      
      if (order.drinkId) {
        const drink = drinks.find(d => d.id === order.drinkId);
        if (drink) {
          orderSummary[drink.name] = (orderSummary[drink.name] || 0) + (order.drinkQuantity || 1);
        }
      }
    });
    
    return orderSummary;
  };

  // Kullanıcı tercihlerini hesapla
  const getUserPreferences = () => {
    const preferences = []; //preferences: kullanıcı tercihlerini tutmak için kullanılan bir değişkendir.
    
    orders.forEach(order => {
      const user = users.find(u => u.id === order.userId);
      const food = foods.find(f => f.id === order.foodId);
      const drink = order.drinkId ? drinks.find(d => d.id === order.drinkId) : null;
      
      // Sadece teslim edilmemiş siparişleri göster
      if (user && food && order.status !== "teslim edildi") {
        preferences.push({
          id: order.id,
          userId: order.userId,
          userName: user.name,
          foodName: food.name,
          foodQuantity: order.foodQuantity || 1,
          drinkName: drink ? drink.name : null,
          drinkQuantity: order.drinkQuantity || 0,
          date: order.date,
          time: order.time,
          status: order.status
        });
      }
    });
    
    return preferences;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "hazırlanıyor": return "#f59e0b"; // Turuncu
      case "hazır": return "#00d4aa"; // Turkuaz yeşil
      case "teslim edildi": return "#3498db"; // Mavi (diğer butonlarla aynı)
      default: return "#7c3aed"; // Mor
    }
  };

  const getNextStatus = (currentStatus) => {  //currentStatus:mevcut durum  //getNextStatus: bir sonraki durumu hesaplar.
    switch(currentStatus) {
      case "hazırlanıyor": return "hazır";
      case "hazır": return "teslim edildi";
      case "teslim edildi": return "hazırlanıyor";
      default: return "hazırlanıyor";
    }
  };

  const office1Orders = getOfficeOrders(1);
  const office2Orders = getOfficeOrders(2);
  const office3Orders = getOfficeOrders(3);
  const userPreferences = getUserPreferences();

  return (
    <div className="container">
      <h1>Yemek Uygulaması</h1>
      
      <div className="food-section">
        <h2>YEMEK EKLE</h2>
        <FoodForm addFood={addFood} />
        <FoodList 
          foods={foods} 
          deleteFood={deleteFood} 
          orders={orders}
          users={users}
        />
      </div>

      <div className="food-section">
        <h2>İÇECEK EKLE</h2>
        <FoodForm addFood={addDrink} type="içecek" />
        <FoodList 
          foods={drinks} 
          deleteFood={deleteDrink} 
          orders={orders}
          users={users}
          title="İçecek Listesi"
        />
      </div>

      <div className="order-section">
        <h2>SIPARIS EKLE</h2>
        <form onSubmit={handleOrderSubmit} className="order-form">
          <div className="form-row">
            <select
              value={newOrder.userId}
              onChange={(e) => setNewOrder({...newOrder, userId: e.target.value})}
              className="order-input"
            >
              <option value="">KULLANICI SEÇİN</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.office}
                </option>
              ))}
            </select>
            <select
              value={newOrder.foodId}
              onChange={(e) => setNewOrder({...newOrder, foodId: e.target.value})}
              className="order-input"
            >
              <option value="">YEMEK SEÇİN</option>
              {foods.map(food => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Yemek Adet"
              value={newOrder.foodQuantity}
              onChange={(e) => setNewOrder({...newOrder, foodQuantity: parseInt(e.target.value) || 1})}
              className="order-input"
              min="1"
            />
          </div>
          <div className="form-row">
            <select
              value={newOrder.drinkId}
              onChange={(e) => setNewOrder({...newOrder, drinkId: e.target.value})}
              className="order-input"
            >
              <option value="">İÇECEK SEÇİN</option>
              {drinks.map(drink => (
                <option key={drink.id} value={drink.id}>
                  {drink.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="İçecek Adet"
              value={newOrder.drinkQuantity}
              onChange={(e) => setNewOrder({...newOrder, drinkQuantity: parseInt(e.target.value) || 1})}
              className="order-input"
              min="1"
            />
            <input
              type="date"
              value={newOrder.date}
              onChange={(e) => setNewOrder({...newOrder, date: e.target.value})}
              className="order-input"
            />
            <input
              type="time"
              value={newOrder.time}
              onChange={(e) => setNewOrder({...newOrder, time: e.target.value})}
              className="order-input"
            />
            <button type="submit" className="save-btn">SIPARIS EKLE</button>
          </div>
        </form>
      </div>

      <div className="office-sections">
        <div className="office-section">
          <h2>OFIS-1 SIPARIS ADETI TOPLAMI</h2>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Yemek</th>
                  <th>Adet</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(office1Orders).map(([foodName, quantity]) => (
                  <tr key={foodName}>
                    <td>{foodName}</td>
                    <td>{quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="office-section">
          <h2>OFIS-2 SIPARIS ADETI TOPLAMI</h2>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Yemek</th>
                  <th>Adet</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(office2Orders).map(([foodName, quantity]) => (
                  <tr key={foodName}>
                    <td>{foodName}</td>
                    <td>{quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="office-section">
          <h2>OFIS-3 SIPARIS ADETI TOPLAMI</h2>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Yemek</th>
                  <th>Adet</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(office3Orders).map(([foodName, quantity]) => (
                  <tr key={foodName}>
                    <td>{foodName}</td>
                    <td>{quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="user-sections">
        <div className="user-section">
          <h2>KULLANICI LISTESI</h2>
          <div className="user-table">
            <table>
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Ofis</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.office}</td>
                    <td>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="delete-btn"
                      >
                        sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="user-section">
          <h2>PERSONEL EKLE</h2>
          <form onSubmit={handleUserSubmit} className="user-form">
            <input
              type="text"
              placeholder="AD SOYAD"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="user-input"
            />
            <select
              value={newUser.office}
              onChange={(e) => setNewUser({...newUser, office: e.target.value})}
              className="user-input"
            >
              <option value="">OFİS SEÇİN</option>
              <option value="Ofis 1">Ofis 1</option>
              <option value="Ofis 2">Ofis 2</option>
              <option value="Ofis 3">Ofis 3</option>
            </select>
            <input
              type="password"
              placeholder="ŞİFRE"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="user-input"
            />
            <div className="form-buttons">
              <button type="submit" className="save-btn">KAYDET</button>
              <button type="button" className="delete-btn">SIL</button>
            </div>
          </form>
        </div>
      </div>

      <div className="preference-section">
        <h2>TERCİH LISTESI</h2>
        <div className="preference-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ad Soyad</th>
                <th>Yemek (Adet)</th>
                <th>İçecek (Adet)</th>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Durum</th>
                <th>İşlem</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userPreferences.map((pref, index) => (
                <tr key={pref.id}>
                  <td>{index + 1}</td>
                  <td>{pref.userName}</td>
                  <td>{pref.foodName} ({pref.foodQuantity})</td>
                  <td>{pref.drinkName ? `${pref.drinkName} (${pref.drinkQuantity})` : "-"}</td>
                  <td>{pref.date}</td>
                  <td>{pref.time}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(pref.status) }}
                    >
                      {pref.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => updateOrderStatus(pref.id, getNextStatus(pref.status))}
                      className="status-btn"
                      style={{ backgroundColor: getStatusColor(getNextStatus(pref.status)) }}
                    >
                      {getNextStatus(pref.status).toUpperCase()}
                    </button>
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteOrder(pref.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;