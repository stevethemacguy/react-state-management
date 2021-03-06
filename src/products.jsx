import React, {useState} from 'react';
import Spinner from './Spinner';
import useFetch from './services/useFetch';
import {Link, useParams} from 'react-router-dom';
import PageNotFound from './PageNotFound';

export default function Products() {
  const [shoeSize, setShoeSize] = useState('');
  // Get the category param from the URL. UseParams() returns an object with a property for each param, so we destructure the object, keeping only the category param.
  const {category} = useParams();
  // Destructure the object returned by useFetch, which includes the data, a T/F loading value, and (possibly) an error
  // The 'data: products' syntax renames data to products. It removes the need for an extra variable (i.e. const products = data).
  const {data: products, loading, error} = useFetch(`products?category=${category}`);

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
        <Link to={`/${category}/${product.id}`}>
          <img src={`/images/${product.image}`} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </Link>
      </div>
    );
  }

  if (error) throw error;
  if (loading) return <Spinner />;

  if (!products || products.length === 0) {
    return <PageNotFound />
  }

  return (
    <>
      <section id="filters">
        <label htmlFor="size">Filter by Size:</label>{' '}
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
    </>
  );
}
