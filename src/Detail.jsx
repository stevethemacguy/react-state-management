import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useFetch from './services/useFetch';
import Spinner from './Spinner';
import PageNotFound from './PageNotFound';

export default function Detail(props) {
  const {id} = useParams(); // Note: 'id' is the name we used when setting up the route param (e.g. shoes/id)
  const navigate = useNavigate(); // Used to tell the router to navigate to a different route.

  // Destructure the object returned by useFetch, which includes the data (i.e. product), a T/F loading value, and (possibly) an error
  // The 'data: product' syntax renames the data to product. It removes the need for an extra variable (i.e. const product = data).
  const {data: product, loading, error} = useFetch(`products/${id}`);

  const [sku, setSku] = useState('');

  if (loading) return <Spinner />;
  // CAUTION: This line must come *before* the error line below. If it comes after, then the error will be thrown instead of showing the 404 page.
  if (!product) return <PageNotFound/>;
  if (error) throw error;

  // This function doesn't need any arguments because...
  // 1. We already retrieved the product's id from the URL
  // 2. The sku of the selected product is set using setSku (i.e. it's the state variable)
  const addItemToCart = () => {
    // We only add the id and sku of the product object since the cart doesn't need the whole product
    props.addToCart(id, sku);
    navigate('/cart');
  };

  return (
    <div id="detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p id="price">${product.price}</p>
      <select className="shoe-size" value={sku} onChange={(event) => setSku(event.target.value)}>
        <option value="">What Size?</option>
        {
          // Each product has an array of skus, so we show them all. When an option is selected, sku state var is set to that single selected sku
          product.skus.map(s => <option key={s.sku} value={s.sku}>{s.size}</option>)
        }
      </select>
      <div>
        <button className="btn btn-primary" disabled={!sku} onClick={() => {addItemToCart()}}>Add to Cart</button>
      </div>
      <img src={`/images/${product.image}`} alt={product.category} />
    </div>
  );
}
