import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";


function ReservationList({thisDayReservations }){

    const [list , setList] = useState([]);
    const [listError , setListError] = useState(null)
   
    const cancelHandler = (res)=>{
      window.confirm( "Do you want to cancel this reservation? This cannot be undone.") &&
      axios
      .put(`${API_BASE_URL}/reservations/${res.reservation_id}/status` ,  {data: { status: "cancelled" } } )
      .then((response) => response.status === 200 && window.location.reload()  )
      .catch((err) => {
        setListError(err.response.data.error);
        console.clear()
      });
    }
  

    function renderReservation(){
     let  removeCanceled = thisDayReservations.filter((res)=> res.status !== "cancelled");
     let theList = removeCanceled.map((res, i)=> {
        return(
          <tr key={i}>
            <th scope="row">{res.last_name} </th>
                <td>{res.first_name}</td>
                <td>{res.mobile_number}</td>
                 <td>{res.reservation_time}</td>
                <td>{res.people}</td>
            
                <td> <p data-reservation-id-status={res.reservation_id}> {res.status}  </p> </td>
                <td> 
                { res.status === "booked" &&
                     <button href={`/reservations/${res.reservation_id}/seat`}>  
                        <Link to={`/reservations/${res.reservation_id}/seat`} > seat </Link> 
                     </button>} 

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


useEffect(renderReservation, [thisDayReservations ])
   
return(   

<div>  
<ErrorAlert error={listError} />
<table className="table table-bordered table-dark table-hover">
        <thead className="thead-dark">
            <tr>
                <th scope="col">Last Name</th>
                <th scope="col">First Name</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Time</th>
                <th scope="col">People</th>
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

