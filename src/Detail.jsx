import React from "react";
import {useNavigate, useParams} from 'react-router-dom';
import useFetch from './services/useFetch';
import Spinner from './Spinner';
import PageNotFound from './PageNotFound';

export default function Detail() {
  const {id} = useParams(); // Note: 'id' is the name we used when setting up the route param (e.g. shoes/id)
  const navigate = useNavigate(); // Used to tell the router to navigate to a different route.

  // Destructure the object returned by useFetch, which includes the data (i.e. product), a T/F loading value, and (possibly) an error
  // The 'data: product' syntax renames the data to product. It removes the need for an extra variable (i.e. const product = data).
  const {data: product, loading, error} = useFetch(`products/${id}`);

  if (loading) return <Spinner />;
  // CAUTION: This line must come *before* the error line below. If it comes after, then the error will be thrown instead of showing the 404 page.
  if (!product) return <PageNotFound/>;
  if (error) throw error;

  return (
    <div id="detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p id="price">${product.price}</p>
      <div>
        <button className="btn btn-primary" onClick={() => {navigate('/cart')}}>Add to Cart</button>
      </div>
      <img src={`/images/${product.image}`} alt={product.category} />
    </div>
  );
}
