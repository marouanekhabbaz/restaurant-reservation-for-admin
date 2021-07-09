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

module.exports = {
  list,
  create1,
  readData,
};



