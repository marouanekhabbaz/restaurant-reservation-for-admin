import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

function Seat(){
     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
     const [tables , setTables] = useState([]);
     const [tableError, setTableError]= useState(null)


    const {reservation_id} = useParams();
    console.log(reservation_id)
    let history = useHistory();
    const [theTable , setTheTables] = useState('')
    useEffect(loadTable, []);

    function loadTable(){
      axios
      .get(`${API_BASE_URL}/tables`)
      .then((response) => setTables(response.data.data) )
      .catch((err) => {
        setTableError(err.response.data.error)
      });
    
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
        .put(`${API_BASE_URL}/tables/${theTable}/seat`, { data: {reservation_id} })
        .then((response) => response.status === 200 && history.push(`/dashboard`) )
        .catch((err) => {
            setTableError(err.response.data.error)
        });
        setTheTables('')
      };

const list = tables.map((table, i)=> {
    return(
        <option key={i} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    )
})


return (
    <div>
<div>
        <ErrorAlert error={tableError} />
    
        <div className="form-body">
        <div className="row">
            <div className="form-holder">
                <div className="form-content">
                    <div className="form-items">
                    <div className="heading" > 
                        <h3>Reserve a table</h3>
                        <p>Fill in the data below.</p>
                    </div>
                        <form className="requires-validation" 
                        onSubmit={handleSubmit}
                         >
        
                            <div className="col-md-12">
                            <select class="form-select mt-3"  name="table_id"
                             onChange={({target})=> setTheTables(target.value)}
                             value={theTable}
                            >
                            <option selected disabled value="">Table Number</option>
                                 {list}
                            </select>   
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
    </div>
   
)
}

export default Seat;

/*
<label htmlFor="referral">
  How did you hear about us?
  <select
    id="referral"
    name="referral"
    onChange={handleChange}
    value={formData.referral}
  >
    <option value="">-- Select an Option --</option>
    <option value="twitter">Twitter</option>
    <option value="wom">Word of Mouth</option>
    <option value="youtube">YouTube</option>
  </select>
</label>
*/
/*
The /reservations/:reservation_id/seat page will

have the following required and not-nullable fields:
Table number: <select name="table_id" />. The text of each option must be {table.table_name} - {table.capacity} so the tests can find the options.
do not seat a reservation with more people than the capacity of the table
display a Submit button that, when clicked, assigns the table to the reservation then displays the /dashboard page
PUT to /tables/:table_id/seat/ in order to save the table assignment. The body of the request must be { data: { reservation_id: x } } where X is the reservation_id of the reservation being seated. The tests do not check the body returned by this request.
display a Cancel button that, when clicked, returns the user to the previous page

*/