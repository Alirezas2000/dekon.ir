import React from 'react';import{createRoot}from'react-dom/client';import{BrowserRouter}from'react-router-dom';import{StoreProvider}from'./context/StoreContext';import App from './App';import './style.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><StoreProvider><App/></StoreProvider></BrowserRouter></React.StrictMode>);
