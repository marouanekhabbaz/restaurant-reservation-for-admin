const knex = require("../db/connection");

function list(query) {
  if(query){
    return knex("reservations ")
    .select("*")
    .where({"reservation_date":query})
    .orderBy("reservation_time", 'asc')

  }else{
    return knex("reservations").select("*").orderBy("reservation_time", 'asc');
  }

}

function create1(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function readData(id){
  return knex("reservations")
  .select("*")
  .where({"reservation_id":id})
  .first()
}

// .whereNot('status', "finished")


function update(reservation) {
  return knex("reservations")
    .select("*")
    .where({ "reservation_id" : reservation.reservation_id })
    .update(reservation, "*")
  .then((updatedRecords) => updatedRecords[0]);
};

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  create1,
  readData,
  update,
  search
};


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
