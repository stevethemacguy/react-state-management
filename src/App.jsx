import React, {useState} from 'react';
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";

const products = [
  {
    "id": 1,
    "category": "shoes",
    "image": "shoe1.jpg",
    "name": "Hiker",
    "price": 94.95,
    "skus": [
      { "sku": "17", "size": 7 },
      { "sku": "18", "size": 8 }
    ],
    "description": "This rugged boot will get you up the mountain safely."
  },
  {
    "id": 2,
    "category": "shoes",
    "image": "shoe2.jpg",
    "name": "Climber",
    "price": 78.99,
    "skus": [
      { "sku": "28", "size": 8 },
      { "sku": "29", "size": 9 }
    ],
    "description": "Sure-footed traction in slippery conditions."
  },
  {
    "id": 3,
    "category": "shoes",
    "image": "shoe3.jpg",
    "name": "Explorer",
    "price": 145.95,
    "skus": [
      { "sku": "37", "size": 7 },
      { "sku": "38", "size": 8 },
      { "sku": "39", "size": 9 }
    ],
    "description": "Look stylish while stomping in the mud."
  }
];

export default function App() {
  const [shoeSize, setShoeSize] = useState('');

  // FilteredProducts is an array containing only products whose size matches the selected value. The ternary operator is used because the shoeSize
  // will be an empty string when the app first starts. In this case, the user hasn't selected to filter anything yet, so we just return all of the products.
  // Note: Since the sku is a nested property, find() is used to find a matching element in the product's skus array. WARNING: find() is not supported in IE.
  // CAUTION: Since the select options are strings, parseInt is required to convert the selected value into a number when filtering the products (since the objects use a number).
  // To use parseInt from the HTML instead. shoeSize just needs to be initialize to null instead of an empty string (e.g. useState(null)).
  // Using parseInt here (instead of the HTML) allows the shoeSize to remain a string, while using the number only for filtering the list.
  const filteredProducts = shoeSize ? products.filter((product) => product.skus.find(sku => sku.size === parseInt(shoeSize))) : products;

  function renderProduct(product) {
    return (
      <div key={product.id} className="product">
        <a href="/">
          <img src={`/images/${product.image}`} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <section id="filters">
            <label htmlFor="size">Filter by Size:</label>{" "}
            <select id="size" value={shoeSize} onChange={(event) => setShoeSize(event.target.value)}>
              <option value="">All sizes</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
          </section>
          {
            shoeSize && <h2>Found {filteredProducts.length} items.</h2>
          }
          <section id="products">
            {
              // Equivalent to filteredProducts.map(product => renderProduct(product)). This is an example of 'point free' syntax
              filteredProducts.map(renderProduct)
            }
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
