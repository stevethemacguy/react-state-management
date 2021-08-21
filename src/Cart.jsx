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

  // A reducer function takes two arguments and returns an aggregated/combined version of those two things.
  // 1. The 1st argument is an accumulator variable that is used to keep a running total. It's also called the 'previous' value because it is passed along by .reduce() to the next reducer function call.
  // 2. The 2nd argument is a variable that represents a single item in the array that's being reduced (e.g. the cart array).
  // ReducerFunction() will be called for each item in the array, so we can find the total number of items in the cart by simply adding the quantity of each item to the 'total' accumulator.
  const reducerFunction = (total, item) => total + item.quantity;

  // The first argument to .reduce() is a reducer function, and the second arg is the starting value of the accumulator (i.e. a variable that keeps a running total).
  // The .reduce() function calls the reducerFunction above on each item in the cart array. On each iteration, the result of the reducer function (i.e. the returned value) is
  // passed along to the next reducerFunction call (via the accumulator variable, which keeps a running total). Once all items are processed, cart.reduce returns the final aggregated total
  const totalCartItems = cart.reduce(reducerFunction, 0);

  // Note. The reduce function above does the same thing as this basic for loop:
  // const totalCartItems = () => {
  //   let sum = 0;
  //   cart.forEach((item) => {
  //     sum += item.quantity;
  //   })
  //   return sum;
  // };
  // But once you're comfortable with Array.reduce(), you can do this with a single line of code by writing the reducer function inline:
  // const totalCartItems = cart.reduce((total, item) => total + item.quantity));

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
        totalCartItems > 0 ? <h1>Cart ({totalCartItems} items)</h1> : <h1>Your Cart is empty</h1>
      }

      <ul>{cart.map(renderItem)}</ul>
    </section>
  );
}
