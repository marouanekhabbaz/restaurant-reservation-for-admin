import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

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
 
let thisDayReservations = reservations.filter((res)=> res.reservation_date === date) ;

// thisDayReservations = thisDayReservations.sort((a,b)=>  Date.parse(`${a.reservation_date} ${a.reservation_time}`) - Date.parse( `${b.reservation_date} ${b.reservation_time}` ) );

let table = thisDayReservations.map((res, i)=> {
  return(
  
    <tr key={i}>
      <th scope="row">{res.last_name} </th>
      <td>{res.first_name}</td>
      <td>{res.mobile_number}</td>
      <td>{res.reservation_time}</td>
      <td>{res.people}</td>
    </tr>
  )
})
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {(queryDate)? date: "today" }</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <table className="table">
  <thead className="thead-dark">
    <tr>
      <th scope="col">Last Name</th>
      <th scope="col">First Name</th>
      <th scope="col">Phone Number</th>
      <th scope="col">Time</th>
      <th scope="col">Number of guests</th>
    </tr>
  </thead>
  <tbody>  
    {table}
  </tbody>
  </table>
    </main>
  );
}

export default Dashboard;

