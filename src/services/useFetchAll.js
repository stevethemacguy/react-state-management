import { useState, useEffect } from "react";

// This is the Author's code. I did not write it or touch it. It is similar to useFetch(), but
// useFetchAll() builds an array of requests, and  uses Promise.all to run all of the promises
// (i.e. make multiple HTTP requests) at the same time.
export default function useFetchAll(urls) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const promises = urls.map((url) =>
      fetch(process.env.REACT_APP_API_BASE_URL + url).then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
    );

    // We use this to request all of the products in the cart at the same time.
    Promise.all(promises)
      .then((json) => setData(json))
      .catch((e) => {
        console.error(e);
        setError(e);
      })
      .finally(() => setLoading(false));
     // eslint-disable-next-line
  }, []); // Use an empty array to ensure this only runs once on the first render.

  return { data, loading, error };
}
