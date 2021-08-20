import React from 'react';
import {PageNotFound} from './PageNotFound';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import {Route, Routes} from 'react-router-dom';
import Cart from './Cart';
import Detail from './Detail';
import Products from './Products';

export default function App() {
  return (
    <>
      <div className="content">
        <Header/>
        <main>
          <Routes>
            <Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>}/>
            <Route path="/:category" element={<Products/>}/>
            <Route path="/:category/:id" element={<Detail/>}/>
            <Route path="/cart" element={<Cart/>}/>
          </Routes>
        </main>
      </div>
      <Footer/>
    </>
  );
}
