import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
import '../layout/Layout.css'
/*
The /tables/new page will

have the following required and not-nullable fields:
Table name: <input name="table_name" />, which must be at least 2 characters long.
Capacity: <input name="capacity" />, this is the number of people that can be seated at the table, which must be at least 1 person.
display a Submit button that, when clicked, saves the new table then displays the /dashboard page
display a Cancel button that, when clicked, returns the user to the previous page
*/

function NewTable(){

    const history = useHistory();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const [tableError, setTableError] = useState(null);

    const initialFormState = {
        table_name: "",
        capacity: ""
      };

      const [formData, setFormData] = useState({ ...initialFormState });

      const handleChange = ({ target }) => {

        if(target.name === "capacity"){
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
        .post(`${API_BASE_URL}/tables`, { data: formData })
        .then((response) => response.status === 201 && history.push(`/dashboard`) )
        .catch((err) => {
            setTableError(err.response.data.error)
        });
        console.log(formData)
        setFormData({
            ...initialFormState
        });
        
      };


    return (
 <div>
        <ErrorAlert error={tableError} />
    
        <div className="form-body">
        <div className="row">
            <div className="form-holder">
                <div className="form-content">
                    <div className="form-items">
                    <div className="heading" > 
                        <h3>Add a table</h3>
                        <p>Fill in the data below.</p>
                    </div>
                        <form className="requires-validation" 
                        onSubmit={handleSubmit} >
                            <div className="col-md-12">
                               <input className="form-control" type="text" 
                               name="table_name" placeholder="Table name" 
                               onChange={handleChange} 
                               value={formData.table_name}
                               />
                            </div>

                            <div className="col-md-12">
                                <input class="form-control" type="number" 
                                name="capacity" placeholder="capacity"
                                onChange={handleChange} 
                                value={formData.capacity}
                                />
                            </div>
                            <div className="form-button mt-3">
                                <button id="submit" type="submit" class="btn btn-primary">submit</button>
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
export default NewTable;
