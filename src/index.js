import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Kalau ada, biarkan saja
import App from './App'; // Pastikan ini ada dan mengimpor App
import reportWebVitals from './reportWebVitals'; // Opsional, bisa dihapus kalau mau

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); // Opsional, bisa dihapus