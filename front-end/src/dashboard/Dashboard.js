import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import axios from "axios";
import ReservationList from "../resevations/ReservationList"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  let [tables , setTables] = useState([])

  useEffect( loadDashboard , [date, tables]);

  useEffect(loadTable, [ API_BASE_URL ]);

  function loadTable(){
    axios
    .get(`${API_BASE_URL}/tables`)
    .then((response) => setTables(response.data.data) )
    .catch((err) => {
      console.clear()
        setReservationsError(err.response.data.error)
       
    });
  
  }



    const query = useQuery();
    const queryDate = query.get("date");
    date = (queryDate)? queryDate: date;

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

 
 const freeTable = (table_id) => {
  window.confirm( "Is this table ready to seat new guests? This cannot be undone.") &&
  axios
  .delete(`${API_BASE_URL}/tables/${table_id}/seat` )
  .then((response) => response.status === 200 && loadTable() )
  .catch((err) => {
    console.clear()
    setReservationsError(err.response.data.error)
  });
 }


const listOfSeats = tables.map((table, i)=> {
  return(
     <div className="card bg-primary" key={i}>
          <div className="card-body text-center">

              <h3 className="card-text">  {table.table_name}</h3>
              <h5> capacity: {table.capacity}</h5>

              <p data-table-id-status={table.table_id}> {table.reservation_id === null ? "Free" : "Occupied"} </p>

              { table.reservation_id && 
              <button data-table-id-finish={table.table_id} onClick={()=>freeTable(table.table_id)}>Finish</button> } 

          </div>
      </div>
  )
})
 
let thisDayReservations = reservations.filter((res)=> res.reservation_date === date) ;


  return (
 <main>

  <ErrorAlert error={reservationsError} />

   <section className="ftco-section">

       <div className="container">

          <h1>Dashboard</h1>

          <div className="row justify-content-center">
				    <div className="col-md-6 text-center mb-5">
                <h4 className="mb-0">Reservations for {(queryDate)? date: "today" }</h4>
				    </div>
		    	</div>

           <div className="card-columns"> {listOfSeats}  </div>
        
            <div className="row">
		      		<div className="col-md-12">
			      		<div className="table-wrap">
                  <ReservationList thisDayReservations={thisDayReservations} />
                 </div>
			        </div>
		      	</div>

        </div>    

    </section>

  </main>
  );
}

export default Dashboard;
