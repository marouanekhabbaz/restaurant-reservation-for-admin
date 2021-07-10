import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ReservationList({thisDayReservations}){
    const [list , setList] = useState([])
    console.log(thisDayReservations, 'list')
    function renderReservation(){
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
          </tr>
        )
      })

      setList(theList)
    }
useEffect(renderReservation, [thisDayReservations])
   
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
                </tr>
        </thead>

        <tbody>  
            {list}
        </tbody>
</table>
{thisDayReservations.length === 0 && 
    <p> No reservations found </p> }
</div>
      )

}

export default ReservationList