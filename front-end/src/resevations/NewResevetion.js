
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";


function NewReservation(){
    const history = useHistory();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const [reservationsError, setReservationsError] = useState(null);
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number:"",
        reservation_date: Date.now(),
        reservation_time:"10:00",
        people: 1
      };

      const [formData, setFormData] = useState({ ...initialFormState });

      const handleChange = ({ target }) => {

        if(target.name === "people"){
          setFormData({
            ...formData,
            [target.name]: Number(target.value),
          });
        }else {
          setFormData({
            ...formData,
            [target.name]: target.value,
          });
        }
      };


      const handleSubmit = (event) => {
        event.preventDefault();
        axios
        .post(`${API_BASE_URL}/reservations`, { data: formData })
        .then((response) => response.status === 201 && history.push(`/dashboard?date=${formData.reservation_date}`) )
        .catch((err) => {
            console.log(err.response.data.error, "here");
            setReservationsError(err.response.data.error)
        });
        setFormData({
            ...initialFormState
        });
      };

    return (
      <div>
 <ErrorAlert error={reservationsError} />
      
  <form onSubmit={handleSubmit}> 
     <div className="form-row">
      <div className="form-group col-md-6">
        <label htmlFor="first_name">First Name:</label>
        <input id="first_name" type="text" 
        className="form-control"  
         name="first_name"
         placeholder="First Name"
          onChange={handleChange}
          value={formData.first_name}/>
       </div>
       <div className="form-group col-md-6">
        <label htmlFor="inputPassword4">Last Name: </label>
        <input id="last_name" type="text"
           name="last_name"
           className="form-control"  
           placeholder="Last Name"
           onChange={handleChange}
           value={formData.last_name}/>
        </div>
     </div>

  <div className="form-group">
      <label htmlFor="mobile_number">Mobile Number</label>
      <input type="tel" id="mobile_number" name="mobile_number"
       onChange={handleChange}
       value={formData.mobile_number}
       placeholder="Format: 123-456-7890"
       className="form-control" 
       required />
    </div>

     <div className="form-row">
      <label htmlFor="people"> Number of guests: 
          <input id="people"  type="number"
            name="people" 
            placeholder="Number of guests"
           onChange={handleChange}
           className="form-control" 
           value={Number(formData.people)}/>
        </label>
        
  </div>

  
  <div className="form-row">
    <div className="form-group col-md-6">
      <label htmlFor="reservation_time">Reservation Time</label>
      <input type="time" id="reservation_time"  name="reservation_time" 
      placeholder="Hours are 10:30am to 10:30pm"
        onChange={handleChange}
        value={formData.reservation_time}
        className="form-control" 
        required/>
    </div>
    <div className="form-group col-md-6">
      <label htmlFor="reservation_date">Reservation Date</label>
      <input type="date" id="reservation_date" name="reservation_date"
       min="2018-01-01"   onChange={handleChange}
       className="form-control" 
       value={formData.reservation_date} ></input> 
    </div>
   
  </div>   
<button type="submit" className="btn btn-outline-dark btn-lg">submit</button> 
<button type="button"  className="btn btn-outline-warning btn-lg" onClick={() => history.goBack()} >cancel</button>
   </form>
   </div>
    )
}
export default NewReservation


