// React'ın temel kütüphanelerini import ediyoruz
// useState: Bileşenlerde durum (state) yönetimi için
// useEffect: Yan etkiler (side effects) için (LocalStorage kaydetme gibi)
import React, { useState, useEffect } from "react";

// Kendi oluşturduğumuz bileşenleri import ediyoruz
import FoodList from "./components/FoodList";
import FoodForm from "./components/FoodForm";

// CSS stillerimizi import ediyoruz
import "./App.css";

//Supabase İstemcisini import ediyoruz
import { supabase } from "./supabaseClient";

// Ana uygulama bileşeni - Tüm uygulamanın merkezi
function App() {

  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [drinks, setDrinks] = useState([]);

  // Yeni kullanıcı formu için state
  // newUser: Form'da girilen kullanıcı bilgileri
  // setNewUser: Form verilerini güncellemek için fonksiyon
  const [newUser, setNewUser] = useState({ full_name: "", office: "", email: "", password: "" });
  
  // Yeni sipariş formu için state
  // newOrder: Form'da girilen sipariş bilgileri
  // setNewOrder: Form verilerini güncellemek için fonksiyon
  const [newOrder, setNewOrder] = useState({ 
    userId: "", 
    mealId: "", 
    drinkId: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    status: "hazırlanıyor"
  });

  // ===== useEffect HOOK'LARI =====
  // useEffect: Bileşen render edildikten sonra çalışan fonksiyonlar
  // İkinci parametre [foods]: Sadece foods değiştiğinde çalışır
  
// Eski useEffect'leri tamamen kaldırın ve aşağıdaki bloğu ekleyin
useEffect(() => {
  // Yemekleri veritabanından çek
  const fetchFoods = async () => {
    let { data: foods, error } = await supabase.from('meals').select('*');
    if (error) console.error("Yemekleri çekerken hata oluştu", error);
    else setFoods(foods);
  };
  // İçecekleri veritabanından çek
  const fetchDrinks = async () => {
    let { data: drinks, error } = await supabase.from('drinks').select('*');
    if (error) console.error("İçecekleri çekerken hata oluştu", error);
    else setDrinks(drinks);
  };
  // Kullanıcıları veritabanından çek (şimdilik)
  const fetchUsers = async () => {
    let { data: users, error } = await supabase.from('profiles').select('*');
    if (error) console.error("Kullanıcıları çekerken hata oluştu", error);
    else setUsers(users);
  };
  // Siparişleri veritabanından çek
  const fetchOrders = async () => {
    let { data: orders, error } = await supabase.from('orders').select('*');
    if (error) {
      console.error("Siparişleri çekerken hata oluştu", error);
      console.error("Hata detayları:", error.details);
    } else {
      console.log("Çekilen siparişler:", orders);
      setOrders(orders);
    }
  };

  fetchFoods();
  fetchDrinks();
  fetchUsers();
  fetchOrders();
}, []); // Boş dependency array ile sadece ilk render'da çalışır.
// Component'in başında

  // ===== CRUD FONKSİYONLARI (Create, Read, Update, Delete) =====
  
// Yeni yemek ekleme fonksiyonu
const addFood = async (food) => {
  // FoodForm'dan gelen objeyi doğrudan kullanıyoruz. created_at'i eklemiyoruz.
  const { data, error } = await supabase.from('meals').insert(food).select();
  if (error) {
    console.error("Yemek eklerken hata oluştu", error);
  } else {
    setFoods([...foods, ...data]);
  }
};

// Yemek silme fonksiyonu
const deleteFood = async (id) => {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) {
    console.error("Yemek silerken hata oluştu", error);
  } else {
    // Başarılı olursa, state'i güncelle
    setFoods(foods.filter((food) => food.id !== id));
  }
};

// Yeni içecek ekleme fonksiyonu
const addDrink = async (drink) => {
  // FoodForm'dan gelen objeyi doğrudan kullanıyoruz. created_at'i eklemiyoruz.
  const { data, error } = await supabase.from('drinks').insert(drink).select();
  if (error) {
    console.error("İçecek eklerken hata oluştu", error);
  } else {
    setDrinks([...drinks, ...data]);
  }
};

// İçecek silme fonksiyonu
const deleteDrink = async (id) => {
  const { error } = await supabase.from('drinks').delete().eq('id', id);
  if (error) {
    console.error("İçecek silerken hata oluştu", error);
  } else {
    setDrinks(drinks.filter((drink) => drink.id !== id));
  }
};

const addUser = async (user) => {
  // 1. Supabase Auth servisine kullanıcıyı kaydet
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: user.email, // E-posta eklenmeli!
    password: user.password,
  });

  if (authError || !authData?.user) {
    console.error("Kayıt olurken hata oluştu:", authError?.message || "Kullanıcı oluşturulamadı.");
    return;
  }

  // 2. Profil tablosuna bilgileri ekle
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: authData.user.id,
        full_name: user.full_name,
        office: user.office,
      },
    ])
    .select();

  if (profileError) {
    console.error("Profil oluştururken hata oluştu:", profileError.message);
  } else {
    setUsers([...users, ...profileData]);
    setNewUser({ full_name: "", office: "", email: "", password: "" }); // Formu temizle
  }
};


// Kullanıcı silme fonksiyonu
const deleteUser = async (id) => {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) {
    console.error("Kullanıcı silerken hata oluştu", error);
  } else {
    setUsers(users.filter((user) => user.id !== id));
  }
};

// Yeni sipariş ekleme fonksiyonu
const addOrder = async (order) => {
  // Form'dan gelen userId'yi kullan (oturum kullanıcısı değil)
  if (!order.userId) {
    alert("Lütfen bir kullanıcı seçin.");
    return;
  }

  if (!order.mealId) {
    alert("Lütfen bir yemek seçin.");
    return;
  }

  // Debug için veriyi konsola yazdır
  console.log("Gönderilecek sipariş verisi:", order);

  // Veritabanı şemasına göre sadece mevcut sütunları kullan
  const newOrderData = {
    user_id: order.userId,
    meal_id: order.mealId,
    order_date: new Date().toISOString(),
    status: "hazırlanıyor"
  };
  
  // Eğer içecek seçildiyse ekle
  if (order.drinkId) {
    newOrderData.drink_id = order.drinkId;
  }

  // Debug için veritabanına gönderilecek veriyi konsola yazdır
  console.log("Veritabanına gönderilecek veri:", newOrderData);

  const { data, error } = await supabase.from('orders').insert(newOrderData).select();

  if (error) {
    console.error("Sipariş eklerken hata oluştu", error);
    console.error("Hata detayları:", error.details);
    console.error("Hata mesajı:", error.message);
    alert(`Sipariş eklenirken hata oluştu: ${error.message}`);
  } else {
    console.log("Başarıyla eklenen sipariş:", data);
    setOrders([...orders, ...data]);
    // Formu tamamen temizle
    setNewOrder({
      userId: "",
      mealId: "",
      drinkId: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      status: "hazırlanıyor"
    });
  }
};

// Sipariş silme fonksiyonu
const deleteOrder = async (id) => {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) {
    console.error("Sipariş silerken hata oluştu", error);
  } else {
    setOrders(orders.filter((order) => order.id !== id));
  }
};

// Sipariş durumunu güncelleme fonksiyonu
const updateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select();

  if (error) {
    console.error("Sipariş durumu güncellenirken hata oluştu", error);
  } else {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  }
};

// Kullanıcı formu submit işleyicisi
const handleUserSubmit = async (e) => {
  e.preventDefault();
  if (!newUser.full_name || !newUser.office || !newUser.email || !newUser.password) return;
  await addUser(newUser);
};

// Sipariş formu submit işleyicisi
const handleOrderSubmit = async (e) => {
  e.preventDefault();
  if (!newOrder.mealId) return; // Sadece yemek zorunlu
  await addOrder(newOrder);
};

  // ===== HESAPLAMA FONKSİYONLARI =====
  
  // Ofis bazlı sipariş toplamlarını hesapla
  // officeNumber: Hangi ofisin siparişleri hesaplanacak
  // filter(): Belirli koşullara uyan verileri filtrele
  // forEach(): Her sipariş için işlem yap
  const getOfficeOrders = (officeNumber) => {
    const officeUsers = users.filter(user => user.office === `Ofis ${officeNumber}`);
    const officeOrderIds = officeUsers.map(user => user.id);
    
    const officeOrders = orders.filter(order => officeOrderIds.includes(order.user_id));
    
    const orderSummary = {}; //orderSummary: ofis siparişlerinin toplamını tutmak için kullanılan bir değişkendir.Sipabase timestamptz için
    officeOrders.forEach(order => {
      const food = foods.find(f => f.id === order.meal_id);
      if (food) {
        // Quantity sütunu olmadığı için her siparişi 1 olarak say
        orderSummary[food.name] = (orderSummary[food.name] || 0) + 1;
      }
      
      if (order.drink_id) {
        const drink = drinks.find(d => d.id === order.drink_id);
        if (drink) {
          // Quantity sütunu olmadığı için her siparişi 1 olarak say
          orderSummary[drink.name] = (orderSummary[drink.name] || 0) + 1;
        }
      }
    });
    
    return orderSummary;
  };

  // Kullanıcı tercihlerini hesapla
  const getUserPreferences = () => {
    const preferences = []; //preferences: kullanıcı tercihlerini tutmak için kullanılan bir değişkendir.
    
    orders.forEach(order => {
      const user = users.find(u => u.id === order.user_id);
      const food = foods.find(f => f.id === order.meal_id);
      const drink = order.drink_id ? drinks.find(d => d.id === order.drink_id) : null;
      
      // Sadece teslim edilmemiş siparişleri göster
      if (user && food && order.status !== "teslim edildi") {
        preferences.push({
          id: order.id,
          userId: order.user_id,
          userName: user.full_name,
          foodName: food.name,
          drinkName: drink ? drink.name : null,
          date: new Date(order.order_date).toLocaleDateString('tr-TR'),
          time: new Date(order.order_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
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

  // Veritabanı tablo yapısını test et
  const testDatabaseStructure = async () => {
    console.log("=== VERİTABANI YAPISI TEST ===");
    
    // Orders tablosu yapısını kontrol et
    const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*').limit(1);
    console.log("Orders tablosu örnek veri:", ordersData);
    if (ordersError) console.error("Orders tablosu hatası:", ordersError);
    
    // Meals tablosu yapısını kontrol et
    const { data: mealsData, error: mealsError } = await supabase.from('meals').select('*').limit(1);
    console.log("Meals tablosu örnek veri:", mealsData);
    if (mealsError) console.error("Meals tablosu hatası:", mealsError);
    
    // Profiles tablosu yapısını kontrol et
    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*').limit(1);
    console.log("Profiles tablosu örnek veri:", profilesData);
    if (profilesError) console.error("Profiles tablosu hatası:", profilesError);
    
    console.log("=== TEST TAMAMLANDI ===");
  };

  // Sayfa yüklendiğinde veritabanı yapısını test et
  useEffect(() => {
    testDatabaseStructure();
  }, []);

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
                  {user.full_name}
                </option>
              ))}
            </select>
            <select
              value={newOrder.mealId}
              onChange={(e) => setNewOrder({...newOrder, mealId: e.target.value})}
              className="order-input"
            >
              <option value="">YEMEK SEÇİN</option>
              {foods.map(food => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
            </select>

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
                    <td>{user.full_name}</td>
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
              value={newUser.full_name}
              onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
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
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="E-POSTA"
              required
            />
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

      <div className="preference-section" id="tercih-listesi">
        <h2>TERCİH LISTESI</h2>
        <div className="preference-table">
          <table>
                          <thead>
                <tr>
                  <th>#</th>
                  <th>Ad Soyad</th>
                  <th>Yemek</th>
                  <th>İçecek</th>
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
                  <td>{pref.foodName}</td>
                  <td>{pref.drinkName || "-"}</td>
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
