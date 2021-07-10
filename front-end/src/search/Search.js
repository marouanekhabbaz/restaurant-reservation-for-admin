import { useEffect, useState } from "react"
import ReservationList from "../resevations/ReservationList"
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import axios from "axios";
import { listReservations } from "../utils/api";
function Search(){
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    const [ phoneNumber , setPhoneNumber ] =useState("");
    const [reservationForNumber , setReservationForNumber] = useState([]);
    const [searchError , setSearchError] = useState(null);
    const [clickedSearch , setClickedSearch] = useState(false);
    const [newSearch , setNewSearch] = useState(false);

    const changeHandler =({target})=>{
        setPhoneNumber(target.value)
    }
   


    function loadReservations() {
        axios
        .get(`${API_BASE_URL}/reservations?mobile_number=${phoneNumber}`)
        .then((response) => {
           return  setReservationForNumber(response.data.data) })
        .catch((err) => {
            setSearchError(err.response.data.error)
        });

        console.log("called")
    }


    const sumbitHundler =(event) => {
        
        event.preventDefault();
        loadReservations();
        setClickedSearch(true);
        setNewSearch(!newSearch);
        console.log(phoneNumber)
        console.log(reservationForNumber, "response")
        setPhoneNumber('')
    
    } 



    return (
      <div>  
        <ErrorAlert error={searchError}/> 
        <div>           
             <div className="form-body">
               <div className="row">
                   <div className="form-holder">
                       <div className="form-content">
                           <div className="form-items">
                           <div className="heading" > 
                               <h3>Search by phone number</h3>
                               <p>Fill in the data below.</p>
                           </div>

                               <form className="requires-validation" 
                               onSubmit={
                                   sumbitHundler
                               }
                                >
                                   <div className="col-md-12">
                                      <input className="form-control" type="text" 
                                      name="mobile_number"  placeholder="Enter a customer's phone number" 
                                      onChange={changeHandler}
                                      value={phoneNumber}
                                      />
                                   </div>

                                   <div className="form-button mt-3">
                                       <button id="submit" type="submit" class="btn btn-primary">Find</button>
                                   </div>
                               </form>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
      {  clickedSearch &&  <ReservationList thisDayReservations={reservationForNumber} /> }
    </div>   
           )
}


export default Search



