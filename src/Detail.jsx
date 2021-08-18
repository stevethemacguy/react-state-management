import React from "react";
import {useParams} from 'react-router-dom';
import useFetch from './services/useFetch';
import Spinner from './Spinner';

export default function Detail() {
  const {id} = useParams(); // Note: 'id' is the name we used when setting up the route param (e.g. shoes/id)

  // Destructure the object returned by useFetch, which includes the data (i.e. product), a T/F loading value, and (possibly) an error
  // The 'data: product' syntax renames the data to product. It removes the need for an extra variable (i.e. const product = data).
  const {data: product, loading, error} = useFetch(`products/${id}`);

  if (error) throw error;
  if (loading) return <Spinner />;

  // TODO: Display these products details
  return (
    <div id="detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p id="price">${product.price}</p>
      <img src={`/images/${product.image}`} alt={product.category} />
    </div>
  );

}
