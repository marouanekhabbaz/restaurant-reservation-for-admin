import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import axios from "axios";
import ReservationList from "../resevations/ReservationList"
import { previous, today, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const query = useQuery();
  const queryDate = query.get("date");
  const [date , setDate] = useState((queryDate)? queryDate: today())
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
     <div className="card bg-primary same-size" key={i}>
          <div className="card-body text-center">

              <h3 className="card-text">  {table.table_name}</h3>
              <h5> capacity: {table.capacity}</h5>

              <p data-table-id-status={table.table_id}> {table.reservation_id === null ? "Free" : "Occupied"} </p>

              { table.reservation_id && 
              <button data-table-id-finish={table.table_id}
              className="btn btn-light"
              onClick={()=>freeTable(table.table_id)}>Finish</button> } 

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
          
      

          <h1 className="mt-3">Dashboard</h1>

          <div className="card-columns mt-4"> {listOfSeats}  </div>

          <div className="row justify-content-center mt-4">

           <div  className=".btn-group-lg mr-4 mr-md-3">
               <button type="button"  className="btn btn-primary frmBtn"
              onClick={()=> setDate(previous(date))}
               >Previous</button>
             </div>

             <div  className=".btn-group-lg mr-4  mr-md-3">
                 <button type="button"  className="btn btn-warning frmBtn"
                 onClick={()=> setDate(today)}
                 >Today</button>
             </div>

              <div  className=".btn-group-lg  mr-4 mr-md-3"> 
                  <button type="button"  className="btn btn-primary frmBtn"
               onClick={()=> setDate(next(date))}
                  > Next </button>
            </div>

          </div>

          <div className="row justify-content-center m3 mr-2">
				    <div className="col-md-6 text-center mb-5">
                <h4 className="mt-4">Reservations for { (date=== today())? "today": date  }</h4>
				    </div>
		    	</div>

          
        
            <div className="row justify-content-center">
            <div class="card bg-dark text-white table-holder mb-5" >
                    <div className="table-responsive">
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
