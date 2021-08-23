import React, {useEffect, useState} from 'react';
import './App.css';
import Footer from './Footer';
import Header from './Header';
import {Route, Routes} from 'react-router-dom';
import Cart from './Cart';
import Detail from './Detail';
import Products from './Products';
import Checkout from './Checkout';

export default function App() {
  // The default value you pass to useState is only applied on the first render, BUT it is evaluated on EVERY render
  // Passing a function to useState ensures that the function is only run the first time the component renders.
  // For complicated use cases, you can also look into https://github.com/rehooks/local-storage
  const [cart, setCart] = useState(() => {
    try {
      // If the cart is available in localStorage, use it. NOTE: You could also use ?? to only return an empty array if the left side is null or undefined.
      return JSON.parse(localStorage.getItem('cart')) || [];
    }
    catch {
      console.error('The cart could not be parsed into JSON');
      return [];
    }
  });

  // Any time the cart changes, store it in localStorage.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]);

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

  // Update the quantity of an item already in the cart. AddToCart just increments the quantity by 1, but this function increments it by any number
  // NOTE: The 'items' argument is the current cart STATE, which is an array of (partial) product objects. This is is provided by React.
  // Unlike addToCart(), we don't need to use .find() to see if the item is already in the cart; we already know that it is. We just need to update that item.
  function updateQuantity(sku, quantity) {
    if (quantity === 0) {
      removeItemFromCart(sku);
    }
    else {
      setCart((items) => {
        // See AddToCart documentation. The is identical except that we use the specified quantity instead of just incrementing quantity +1.
        // Note: You can't use updateQuantity() from addToCart's else statement above because the map below won't add a new item, it just updates an item if it's already in the cart.
        return items.map((item) => item.sku === sku ? {...item, quantity} : item);
      });
    }
  }

  // Removes the item from the cart. Note: If you need to lower the QTY, use updateQuantity() instead. RemoveItemFromCart() removes the product completely.
  function removeItemFromCart(sku) {
    setCart((items) => {
      // Keep all items in the cart *except* the item that matches the sku passed.
      return items.filter((item) => item.sku !== sku);
    });
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
            <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity}/>}/>
            <Route path="/checkout" element={<Checkout cart={cart}/>}/>
          </Routes>
        </main>
      </div>
      <Footer/>
    </>
  );
}
