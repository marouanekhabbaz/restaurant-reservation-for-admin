import { useState } from "react"
import ReservationList from "../resevations/ReservationList"
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";



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
            console.clear()
            setSearchError(err.response.data.error)
        });


    }


    const sumbitHundler =(event) => {
        
        event.preventDefault();
        loadReservations();
        setClickedSearch(true);
        setNewSearch(!newSearch);
        setPhoneNumber('')
    
    } 



    return (
    
     <section className="ftco-section">

         <ErrorAlert error={searchError}/> 
        <div className="container">   
       
         <div className="row">
		    <div className="col-md-12">
			    <div className="table-wrap">
                      <div className="search-form">
                         <div className="row">
                             <div className="form-holder-search">
                              <div className="form-content">
                                <div className="form-items">

                                 <div className="heading" > 
                                  <h3>Search by phone number</h3> 
                                 </div>


                               <form className="requires-validation" 
                               onSubmit={ sumbitHundler} >

                                   <div className="col-md-12">
                                      <input className="form-control" type="text" 
                                      name="mobile_number"  placeholder="Enter a customer's phone number" 
                                      onChange={changeHandler}
                                      value={phoneNumber}
                                      />
                                   </div>

                                   <div className="form-button mt-3">
                                       <button id="submit" type="submit" className="btn btn-primary">Find</button>
                                   </div>
                               </form>


                                 </div>
                                 </div>
                                 </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                               
         <div className="row">
		      <div className="col-md-12">
			    <div className="table-wrap">
                    {  clickedSearch &&  <ReservationList thisDayReservations={reservationForNumber} /> }
                  </div>
               </div>
         </div>

       </div>
    </section>  
     
           )
}


export default Search



