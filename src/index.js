// React kütüphanesini import ediyoruz - React bileşenleri oluşturmak için gerekli
import React from "react";

// ReactDOM kütüphanesini import ediyoruz - React uygulamasını HTML'e render etmek için
import ReactDOM from "react-dom/client";

// Ana uygulama bileşenimizi import ediyoruz
import App from "./App";

// CSS stillerimizi import ediyoruz
import "./App.css";

// HTML'deki 'root' id'li elementi bulup React root'u oluşturuyoruz
// Bu, React uygulamasının nereye render edileceğini belirler
const root = ReactDOM.createRoot(document.getElementById("root"));

// App bileşenini root'a render ediyoruz
// Bu satır uygulamamızı başlatır ve ekranda gösterir
root.render(<App />); 