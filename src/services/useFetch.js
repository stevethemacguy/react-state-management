/**
 * Custom hook used to handle all AJAX (i.e. API) requests
 */
import {useEffect, useState} from 'react';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load, get the list of products from the API
  useEffect(() => {
    // Async Await version that does the exact same thing
    async function fetchData() {
      try {
        const response = await fetch(baseUrl + url);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          throw response;
        }
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url]) // Any time a different URL is passed to this hook, fetch data with the new URL

  return { data, error, loading};
}
