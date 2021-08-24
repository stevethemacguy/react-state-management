import React, {useState} from 'react';
import {saveShippingAddress} from './services/shippingService';
import Spinner from './Spinner';

const STATUS = {
  IDLE: 'IDLE',
  SUBMITTING: 'SUBMITTING',
  INVALID: 'INVALID', // The status is INVALID when the user attempts to submit, but the AJAX request failed or did not complete
  COMPLETED: 'COMPLETED'
}

// Declared outside component to avoid recreation on each render
const emptyAddress = {
  city: '',
  country: '',
};

export default function Checkout({emptyCart}) {
  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE); // Form submission status. We check for errors before submitting the form
  const [saveError, setSaveError] = useState(null); // AJAX error

  // Tracks form inputs that have been touched. Each property in the object will be an ID of an input that's been touched.
  const [touched, setTouched] = useState({});

  // FormErrors is an object that holds all the address errors in the form. The object uses the <input> IDs as keys (i.e. property names)
  // and the error messages as values. For example, if the 'city' input has an error, then formErrors['city'] will return 'City is required'.
  // FormErrors is used to show all the errors at the top of the page.
  const formErrors = getFormErrors(address);
  // If the errors object is empty (i.e. has no keys), then there are no errors.
  const isValid = Object.keys(formErrors).length === 0;

  function handleChange(e) {
    e.persist(); // Note: No longer required as of React 17
    setAddress((curAddress) => {
      return {
        ...curAddress, // Copy the current object, but also update whatever was changed (see below)
        // Change the specified property. The input's ID is used to (dynamically) determine which object property to set.
        [e.target.id]: e.target.value // Ex. [city]: 'Irvine' => address.city: 'Irvine'
      };
    })
  }

  function handleBlur(event) {
    event.persist(); // Note: No longer required as of React 17
    setTouched((curTouched) => {
    	return {
    	  ...curTouched,  // Copy the current object.
        // Mark the specified input as touched. The input's ID is used to (dynamically) determine which object property to set.
        [event.target.id]: true // Ex. [city]: true => address.city: true
      }
    })
  }

  // Returns an empty object if there are no errors. Otherwise, returns an object containing all the errors
  function getFormErrors(address) {
    const errors = {};
    // If the city input doesn't have a value, push the error message string onto the errors object using 'city' as the property name/key
    if (!address.city) {
      errors.city = 'City is required';
    }
    if (!address.country) {
      errors.country = 'Country is required';
    }
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault(); // Perform our own validation instead of submitting.
    setStatus(STATUS.SUBMITTING);
    // Only make the request if form is valid.
    if (isValid) {
      try {
        await saveShippingAddress(address);
        emptyCart();
        setStatus(STATUS.COMPLETED);
      } catch (e) {
        setSaveError(e);
      }
    }
    // The form is not valid, so change the status
    else {
      setStatus(STATUS.INVALID);
    }
  }

  if (saveError) throw saveError;
  if (status === STATUS.SUBMITTING) return <Spinner />;
  if (status === STATUS.COMPLETED) {
    return <h1>Checkout Complete!</h1>
  }

  return (
    <>
      {
        // If the form is invalid AND the user tried to submit it, display a list of errors above the form
        (!isValid && status === STATUS.INVALID) && (
          <div className="alert">
            <p className="alert">Please fix the following errors</p>
            <ul>
              {
                // The formErrors object uses the actual property name as a key (e.g. city, country)
                // so Object.keys() is used to return an array containing each property (i.e. error) in the formErrors object.
                // We then map that array to create an <li> for each error, using the error key name to access the error message.
                Object.keys(formErrors).map((errorKey) => {
                  return <li key={errorKey}>{formErrors[errorKey]}</li>
                })
              }
            </ul>
          </div>
        )
      }
      <h1>Shipping Info</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br/>
          <input id="city" type="text" value={address.city} onBlur={handleBlur} onChange={handleChange}/>
          <p className="alert">
            {(touched.city || status === STATUS.INVALID) && formErrors.city}
          </p>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <br/>
          {/*Note: The ID is used to update the value on change (i.e. it identifies which object property to change)*/}
          <select id="country" value={address.country} onBlur={handleBlur} onChange={handleChange}>
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="USA">USA</option>
          </select>
          <p className="alert">
            {(touched.country || status === STATUS.INVALID) && formErrors.country}
          </p>
        </div>
        <div>
          <input disabled={status === STATUS.SUBMITTING} type="submit" className="btn btn-primary" value="Save Shipping Info"/>
        </div>
      </form>
    </>
  );
}
