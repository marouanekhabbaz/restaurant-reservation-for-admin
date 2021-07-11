
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
        reservation_date: "", 
        reservation_time:"10:00",
        people: ""
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
          console.clear()
            setReservationsError(err.response.data.error)
        });
        setFormData({
            ...initialFormState
        });
      };

    return (
      <div>
 <ErrorAlert error={reservationsError} />

 <div className="form-body">
        <div className="row">
            <div className="form-holder">
                <div className="form-content">
                    <div className="form-items">
                      <div className="heading" > 
                        <h3>Make a reservation</h3>
                        <p>Fill in the data below.</p>
                      </div>  
                        <form className="requires-validation" onSubmit={handleSubmit} >
                        <div className="col-md-12">
                        <input id="first_name" type="text" 
                             className="form-control"  
                              name="first_name"
                             placeholder="First Name"
                            onChange={handleChange}
                               value={formData.first_name}/>
                            </div>
                            <div className="col-md-12">
                            <input id="last_name" type="text"
                              name="last_name"
                              className="form-control"  
                               placeholder="Last Name"
                             onChange={handleChange}
                             value={formData.last_name}/>
                            </div>


                            <div className="col-md-12">
                            <input type="tel" id="mobile_number" name="mobile_number"
                           onChange={handleChange}
                            value={formData.mobile_number}
                            placeholder="Mobile number"
                            className="form-control" 
                            required />
                            </div>


                            <div className="col-md-12">
                            <input id="people"  type="number"
                            min="0"
                              name="people" 
                             placeholder="Number of people"
                             onChange={handleChange}
                            className="form-control" 
                            value={formData.people}/>
                            </div>

                            <div className="col-md-12">
                            <input type="time" id="reservation_time"  name="reservation_time" 
                              placeholder="Hours are 10:30am to 10:30pm"
                              onChange={handleChange}
                               value={formData.reservation_time}
                             className="form-control" 
                               required/>
                           
                            </div>

                            <div className="col-md-12">
                            <input type="date" id="reservation_date" name="reservation_date"
                               onChange={handleChange}
                               className="form-control" 
                               value={formData.reservation_date} />
                            <div className="valid-feedback">Reservation Date:</div>
                            </div>
                            <div className="form-button mt-3">
                                <button id="submit" type="submit" className="btn btn-primary">submit</button>
                                <button type="button"  className="btn btn-warning ml-1" onClick={() => history.goBack()} >cancel</button>
                            </div>



                            </form>
                    </div>
                </div>
            </div>
        </div>
    </div>                          

   </div>
    )
}
export default NewReservation

