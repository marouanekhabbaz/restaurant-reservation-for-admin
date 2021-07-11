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

    let history = useHistory();
    const [theTable , setTheTables] = useState('')


    useEffect(loadTable, [API_BASE_URL]);

    function loadTable(){
      axios
      .get(`${API_BASE_URL}/tables`)
      .then((response) => setTables(response.data.data) )
      .catch((err) => {
        console.clear()
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
                            <select className ="form-select mt-3"  name="table_id"
                             onChange={({target})=> setTheTables(target.value)}
                             value={theTable}
                            >
                            <option selected disabled value="">Table Number</option>
                                 {list}
                            </select>   
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
    </div>
   
)
}

export default Seat;

