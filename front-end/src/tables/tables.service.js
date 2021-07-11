const knex = require("../db/connection");

function list(query) {
    return knex("tables").select("*").orderBy("table_name");
  }


function create1(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}


function readData(id){
  return knex("tables")
  .select("*")
  .where({"table_id":id})
  .first()
}

function update(table) {
  return knex("tables")
    .select("*")
    .where({ "table_id" : table.table_id })
    .update(table, "*")
  .then((updatedRecords) => updatedRecords[0]);
};

module.exports = {
  list,
  create1,
  readData,
  update
};

/*
async function x(){
  let  barTableOne = await knex("tables").where("table_name", "Bar #1").first();
  let tableOne = await knex("tables").where("table_name", "#1").first();
  console.log(barTableOne);
  console.log(tableOne)
}

x()

*/
