import { useState } from "react"

function Search(){

    const [ phoneNumber , setPhoneNumber ] =useState("")

    const changeHandler =({target})=>{
        setPhoneNumber(target.value)
    }
    console.log(phoneNumber)
    return (
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
           )
}


export default Search




/*
The /search page will
Display a search box <input name="mobile_number" /> that displays the placeholder text: "Enter a customer's phone number"
Display a "Find" button next to the search box.
Clicking on the "Find" button will submit a request to the server (e.g. GET /reservations?mobile_phone=555-1212).
then the system will look for the reservation(s) in the database and display all matched records on the /search page using the same reservations list component as the /dashboard page.
the search page will display all reservations matching the phone number, regardless of status.
display No reservations found if there are no records found after clicking the Find button.
Hint To search for a partial or complete phone number, you should ignore all formatting and search only for the digits. You will need to remove any non-numeric characters from the submitted mobile number and also use the PostgreSQL translate function.

The following function will perform the correct search.

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}
*/