import {useState, useEffect} from 'react';

// This is the Author's code. I did not write it or touch it. It is similar to useFetch(), but
// useFetchAll() builds an array of requests, and  uses Promise.all to run all of the promises
// (i.e. make multiple HTTP requests) at the same time.
export default function useFetchAll(urls) {
  //const prevUrlsRef = useRef([]); // Holds an array of urls passed in from the previous useFetchAll call.
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only run if the array of URLs passed in changes. NOTE: As long as you pass an empty array to useEffect (see line 8),
    // useRef() is NOT needed. This is just an example of how you can use useRef to store a previous value between renders. In this case, it would hold the previous URLs
    // if(areEqual(prevUrlsRef.current, urls)) {
    //   setLoading(false);
    //   return;
    // }
    // Store the current urls so we can check them on the next run
    // prevUrlsRef.current = urls;

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
  }, []); // Use an empty array to ensure useEffect only runs once on the first render. The cart creates new urls on each render, so without this, useEffect would run forever.
  //}, [urls]); // You can either use an empty array (see above) OR use useRef to cache the previous URLs and only run the effect if the URLs (i.e. the array) change.


  return { data, loading, error };
}

// Returns true if two arrays have identical values.
// function areEqual(array1, array2) {
//   return (
//     (array1.length === array2.length) && array1.every((value, index) => value === array2[index])
//   );
// }
