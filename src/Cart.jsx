import React from "react";
import Spinner from "./Spinner";
import useFetchAll from './services/useFetchAll';

// The props object sent to the Cart has the cart and an updateQuantity method
export default function Cart(props) {
  const { cart, updateQuantity } = props;
  // Build a URL for each product in the cart. In the real world, the API would just have getCart() to return all the products,
  // but our DB requires a URL for each product, so we build those here.
  const urls = cart.map((i) => `products/${i.id}`);
  // Gets ALL products in the cart by making multiple HTTP requests (once for each product URL) all at once.
  const { data: products, loading, error } = useFetchAll(urls);

  const totalQuantity = () => {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.quantity;
    })
    return sum;
  };

  //const reducer = (accumulator, currentValue) => accumulator + currentValue;


  function renderItem(itemInCart) {
    const { id, sku, quantity } = itemInCart;

    // Use the ID of the item in the cart to find that item in products array (which was returned by useFetchAll)
    const { price, name, image, skus } = products.find(
      (p) => p.id === parseInt(id)
    );

    // Get the size of this item (which we know is a shoe object)
    const {size} = skus.find((s) => s.sku === sku);

    return (
      <li key={sku} className="cart-item">
        <img src={`/images/${image}`} alt={name} />
        <div>
          <h3>{name}</h3>
          <p>${price}</p>
          <p>Size: {size}</p>
          <div>
            <span>Quantity: </span>
            <select
              aria-label={`Select quantity for ${name} size ${size}`}
              onChange={(e) => updateQuantity(sku, parseInt(e.target.value))}
              value={quantity}
            >
              <option value="0">Remove</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </li>
    );
  }

  if (loading) return <Spinner />;
  if (error) throw error;

  return (
    <section id="cart">
      {
        cart.length > 0 ? <h1>Cart ({totalQuantity()} items)</h1> : <h1>Your Cart is empty</h1>
      }

      <ul>{cart.map(renderItem)}</ul>
    </section>
  );
}
