import React, {useState} from 'react';
import {PageNotFound} from './PageNotFound';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import {Route, Routes} from 'react-router-dom';
import Cart from './Cart';
import Detail from './Detail';
import Products from './Products';

export default function App() {

  const [cart, setCart] = useState([]);

  // Adds an item to the cart. If the item was already in the cart (i.e. the SKU matches), then we update the item's quantity instead of 'adding it.'
  // This scenario is complicated because in order to preserve immutability, we must clone the cart's existing items array while also adjusting the matching item's quantity.
  // If the item is NOT in the cart, then we can just use the spread operator to clone [...items] and just add the new item using the id and sku passed to addToCart.
  function addToCart(id, sku) {
    // NOTE: The 'items' array argument below is the current cart STATE. It is Provided by react!
    // SetCart expects an array of items, so we will 'update' the cart by cloning the existing items array and 'adding' the new item to our cloned array.
    // However, if an identical item was already in the cart, then we must update the *quantity* of that existing item instead re-adding it.
    // Here are the steps for building the new array:
    // 1. Use items.find() to see if the item (i.e. the sku) is already in the cart.
    //  A. If the item was NOT in the cart, we just use spread to clone the array and add the new item: [...items, {id, sku, quantity: 1}].
    //     This clones the existing array while adding a new object. We use the id and sku passed and set the item's quantity to 1.
    //  B. However, if the item IS already in the cart, then we need to increment it's quantity (instead of adding a new object). So we...
    //    1. Use map to go over all the items in the existing/old array.
    //       A. If the current item matches the SKU that's being 'add' to the cart, update that item's quantity.
    //       B. Otherwise, no matching item was found, so just return the item to keep looping through .map()
    //    2. After map goes through all the items, we're left with a NEW/Changed items array (created by map).
    //       This array is returned to setCart: return items.map(...);
    setCart((items) => {
      // NOTE: The 'items' argument above is the current cart STATE, which is an array of (partial) product objects. This is is provided by React!
      // See if an identical item is already in the cart.
    	const itemInCart = items.find(item => item.sku === sku);
    	// If there IS a matching item, update it's quantity
    	if (itemInCart) {
    	  // Return a new (cloned) array of items, but use map to find the matching item and update it's quantity before returning the array
        // Note: This ternary line is equivalent to the code below. The ternary just gets rid of the inner return statements.
        return items.map((item) => item.sku === sku ? { ...item, quantity: item.quantity + 1} : item);

        // This code is equivalent to the ternary above, but more verbose to explain what's happening.
        // Map returns a new array of items after we make our change (i.e. it clones the items but makes our change).
        // The inner return statements say to continue mapping through each item, but once that's done, the final array created by .map
        // is returned as our final cart array, which is passed to setCart().
        // return items.map((item) => {
        //   if (item.sku === sku) {   // If the item matches
        //     // Increment the item's quantity by 1. We clone the item in order to preserve its immutability.
        //     return { ...item, quantity: item.quantity + 1};
        //   }
        //   // Otherwise, just return the item unchanged
        //   return item;
        // });
      }
      else {
        // If no matching items were found, return a clone of the old items array, with the new item added to the array.
        return [...items, {id, sku, quantity: 1}];
      }
    })
  }

  return (
    <>
      <div className="content">
        <Header/>
        <main>
          <Routes>
            <Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>}/>
            <Route path="/:category" element={<Products />}/>
            <Route path="/:category/:id" element={<Detail addToCart={addToCart}/>}/>
            <Route path="/cart" element={<Cart/>}/>
          </Routes>
        </main>
      </div>
      <Footer/>
    </>
  );
}
