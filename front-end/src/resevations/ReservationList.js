import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/*

Clicking the "Cancel" button will display the following confirmation: "Do you want to cancel this reservation? This cannot be undone."
Clicking "Ok" on the confirmation dialog, sets the reservation status to cancelled, and the results on the page are refreshed.
set the status of the reservation to cancelled using a PUT to /reservations/:reservation_id/status with a body of {data: { status: "cancelled" } }.
Clicking "Cancel" on the confirmation dialog makes no changes.

*/

function ReservationList({thisDayReservations }){

    const [list , setList] = useState([])
    const [canceled , setCanceled ] = useState(false)
   
    const cancelHandler = (res)=>{
      window.confirm( "Do you want to cancel this reservation? This cannot be undone.") &&
      axios
      .put(`${API_BASE_URL}/reservations/${res.reservation_id}/status` ,  {data: { status: "cancelled" } } )
      .then((response) => response.status === 200 && window.location.reload()  )
      .catch((err) => {
        console.log(err.response.data.error)
      });
    }

    console.log(canceled)

    function renderReservation(){
      thisDayReservations = thisDayReservations.filter((res)=> res.status !== "cancelled")
     let theList = thisDayReservations.map((res, i)=> {
        return(
          <tr key={i}>
            <th scope="row">{res.last_name} </th>
                <td>{res.first_name}</td>
                <td>{res.mobile_number}</td>
                 <td>{res.reservation_time}</td>
                <td>{res.people}</td>
                <td> { res.status === "booked" &&
                     <button href={`/reservations/${res.reservation_id}/seat`}>  
                        <Link to={`/reservations/${res.reservation_id}/seat`} > seat </Link> 
                     </button>} 
                </td>
                <td> <p data-reservation-id-status={res.reservation_id}> {res.status}  </p> </td>
                <td> 
                     <button href={`/reservations/${res.reservation_id}/edit`}>  
                        <Link to={`/reservations/${res.reservation_id}/edit`}> Edit </Link> 
                     </button> 
                     
                     <button data-reservation-id-cancel={res.reservation_id} onClick={()=>cancelHandler(res) }>  
                      Cancel
                     </button> 
                     
                      
                </td>
          </tr>
        )
      })

      setList(theList)
    }


useEffect(renderReservation, [thisDayReservations , canceled])
   
return(   

<div>  
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
                <th scope="col">Action</th>
                </tr>
        </thead>

        <tbody>  
            {list}
        </tbody>
</table>
  {thisDayReservations.length === 0 &&  <h3> No reservations found </h3> }
</div>
      )

}

export default ReservationList

