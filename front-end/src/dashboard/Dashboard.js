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

  useEffect(loadDashboard, [date]);

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

let listOfSeats = tables.map((table, i)=> {
  return(

<div class="card bg-primary" key={i}>
<div class="card-body text-center">
  <h3 class="card-text">  {table.table_name}</h3>
  <h5> capacity: {table.capacity}</h5>
  <p data-table-id-status={table.table_id}> {table.reservation_id === null ? "Free" : "Occupied"} </p>
</div>
</div>
  )
})
 
let thisDayReservations = reservations.filter((res)=> res.reservation_date === date) ;

// thisDayReservations = thisDayReservations.sort((a,b)=>  Date.parse(`${a.reservation_date} ${a.reservation_time}`) - Date.parse( `${b.reservation_date} ${b.reservation_time}` ) );


let list = thisDayReservations.map((res, i)=> {
  return(
  
    <tr key={i}>
      <th scope="row">{res.last_name} </th>
      <td>{res.first_name}</td>
      <td>{res.mobile_number}</td>
      <td>{res.reservation_time}</td>
      <td>{res.people}</td>
      <td> <button href={`/reservations/${res.reservation_id}/seat`}>  <Link to={`/reservations/${res.reservation_id}/seat`} > seat </Link>  </button> </td>
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