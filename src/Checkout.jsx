import React, {useState} from 'react';

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  city: '',
  country: '',
};

export default function Checkout({cart}) {
  const [address, setAddress] = useState(emptyAddress);

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
    // TODO
  }

  async function handleSubmit(event) {
    // TODO
  }

  return (
    <>
      <h1>Shipping Info</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br/>
          <input id="city" type="text" value={address.city} onBlur={handleBlur} onChange={handleChange}/>
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
        </div>

        <div>
          <input type="submit" className="btn btn-primary" value="Save Shipping Info"/>
        </div>
      </form>
    </>
  );
}
