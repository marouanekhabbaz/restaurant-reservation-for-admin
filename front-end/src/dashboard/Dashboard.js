import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  let [tables , setTables] = useState([])
console.log(API_BASE_URL)
  useEffect(loadDashboard, [date, tables]);

  useEffect(loadTable, []);

  function loadTable(){
    axios
    .get(`${API_BASE_URL}/tables`)
    .then((response) => setTables(response.data.data) )
    .catch((err) => {
        setReservationsError(err.response.data.error)
    });
  
  }

  console.log(tables)

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
    setReservationsError(err.response.data.error)
  });
 }


let listOfSeats = tables.map((table, i)=> {
  return(

<div class="card bg-primary" key={i}>
<div class="card-body text-center">
  <h3 class="card-text">  {table.table_name}</h3>
  <h5> capacity: {table.capacity}</h5>
  <p data-table-id-status={table.table_id}> {table.reservation_id === null ? "Free" : "Occupied"} </p>
  { table.reservation_id && <button data-table-id-finish={table.table_id} onClick={()=>freeTable(table.table_id)}>Finish</button> } 
</div>
</div>
  )
})
 
let thisDayReservations = reservations.filter((res)=> res.reservation_date === date) ;

// thisDayReservations = thisDayReservations.sort((a,b)=>  Date.parse(`${a.reservation_date} ${a.reservation_time}`) - Date.parse( `${b.reservation_date} ${b.reservation_time}` ) );
/*

The /dashboard page will
display the status of the reservation. The default status is "booked"
the status text must have a data-reservation-id-status={reservation.reservation_id} attribute, so it can be found by the tests.
display the Seat button only when the reservation status is "booked".
clicking the Seat button changes the status to "seated" and hides the Seat button.
clicking the Finish button associated with the table changes the reservation status to "finished" and removes the reservation from the dashboard.
to set the status, PUT to /reservations/:reservation_id/status with a body of {data: { status: "<new-status>" } } where <new-status> is one of booked, seated, or finished


*/


let list = thisDayReservations.map((res, i)=> {
  return(
  
    <tr key={i}>
      <th scope="row">{res.last_name} </th>
      <td>{res.first_name}</td>
      <td>{res.mobile_number}</td>
      <td>{res.reservation_time}</td>
      <td>{res.people}</td>
      <td> { res.status === "booked" && <button href={`/reservations/${res.reservation_id}/seat`}>  <Link to={`/reservations/${res.reservation_id}/seat`} > seat </Link>  </button>} </td>
      <td> <p data-reservation-id-status={res.reservation_id}> {res.status}  </p> </td>
    </tr>
  )
})

  return (
    <main>
        <ErrorAlert error={reservationsError} />
      <section className="ftco-section">
        <div class="container">
          <h1>Dashboard</h1>
          <div className="row justify-content-center">
				    <div className="col-md-6 text-center mb-5">
                <h4 className="mb-0">Reservations for {(queryDate)? date: "today" }</h4>
				    </div>
		    	</div>


      <div class="card-columns">
        {listOfSeats}
        </div>
        
      <div class="row">
				<div class="col-md-12">
					<div class="table-wrap">
      <table className="table table-bordered table-dark table-hover">
  <thead className="thead-dark">
    <tr>
      <th scope="col">Last Name</th>
      <th scope="col">First Name</th>
      <th scope="col">Phone Number</th>
      <th scope="col">Time</th>
      <th scope="col">Number of guests</th>
      <th scope="col">Seat</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>  
    {list}
  </tbody>
  </table>
  </div>
				</div>
			</div>
      </div>    
  </section>
    </main>
  );
}

export default Dashboard;
/*
<Link to={`/reservations/${res.reservation_id}/seat`} > seat </Link>  
*/