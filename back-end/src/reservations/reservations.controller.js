/**
 * List handler for reservation resources
 */
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
 const reservations = require("./reservations.service");
const { min } = require("../db/connection");

 const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time", 
  "people",
  "status"
];

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time", 
  "people",
]

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}
const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES );

function validValues(req ,res , next){
  const { data : {reservation_date ,reservation_time, people} = {} } = req.body;
 
  let timestamps = Date.parse(`${reservation_date} ${reservation_time}`)
 
  if (typeof people !== 'number'){
    return next({
      status: 400,
      message: `people: must be a Number`,
    });
  } else if(!timestamps) {
    return next({
      status: 400,
      message: `reservation_date must be  YYYY/MM/DD and reservation_time must be HH:MM`,
    });
  }
  else {
    next()
  }

}

function notTuesday(req, res , next){
  const { data : { reservation_date , reservation_time } = {} } = req.body;
  const dateObj = new Date(`${reservation_date} ${reservation_time}`);
/*getDay() method return an integer number, between 0 and 6, corresponding to the day of the week for the given date, 
according to local time: 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on.
*/
const dayOfReservetion = dateObj.getDay();

if(dayOfReservetion == 2){
  return next({
    status: 400,
    message: `closed`,
  });
}else{
  next()
}
}

function notInThePast(req, res , next){
  const { data : { reservation_date , reservation_time } = {} } = req.body;
  const reservationDay = new Date(`${reservation_date} ${reservation_time}`);
  const today = new Date(Date.now());
  if(reservationDay < today ){
    return next({
      status: 400,
      message: `Reservations must be in the future`,
    });
  }else{
    next()
  }
}

function inOpeningHours(req, res, next){
  const { data : { reservation_date , reservation_time } = {} } = req.body;
  const reservationDay = new Date(`${reservation_date} ${reservation_time}`);
  console.log(reservation_time)
let hour = reservationDay.getHours()
let minute = reservationDay.getMinutes();
let time = Number(`${hour}.${minute}`)
if(time< 10.30 || time> 21.30){
  return next({
    status: 400,
    message: `Not in business hours`,
  });
}else{
  next();
}
}


async function reservationExist(req , res , next){
  const {reservationId} = req.params;
  let reservation = await reservations.readData(reservationId);
  
  if(reservation){
      req.reservation = reservation
      next();
  } else{
      next({
          status:404,
          message:`Reservation with id ${reservationId} cannot be found.`
      });
  }
}

async function isStatusBooked(req , res , next){

  const { data : { status } = {} } = req.body;

    if(status && status !== "booked"){
      next({
        status: 400,
        message: `${status} not valid, status must be booked`,
      });

    }
    else{
      next()
    }
}


async function hasValidValueOfStatus(req , res , next){
  const { data : { status } = {} } = req.body;

  const valid  = {"booked":1, "seated":2, "finished":3} ;
 
  if(!valid[status]){
    next({
      status: 400,
      message: `${status} not valid, status must be "booked", "seated" or  "finished"`,
    });
  }else{
    next()
  }
}

async function isDiffrentFromCurrentStatus(req , res , next){
  const { data : { status } = {} } = req.body;
  let currentStatus = req.reservation.status
  // const valid  = {"booked":1, "seated":2, "finished":3} ;
 /*
each status key is given a number to make sure that we go in one direction,
and dont assign a status to booked after is seated or finished.
|| valid[currentStatus] > valid[status]
currentStatus === status ||
 */
  if( currentStatus === "finished" ){
    next({
      status: 400,
      message: `status is already ${currentStatus}`,
    });
  }else{
    next();
  }

}

async function update(req , res , next){
  const {reservationId} = req.params;
  const { data : { status } = {} } = req.body;

  const reservation = {
    ...req.reservation,
    status
  }
const  updated = await  reservations.update(reservation);
res.json({data: updated });
}



async function read(req, res , next){
res.json({ data : req.reservation});
}


async function list(req, res) {
  const  {date , mobile_number} = req.query;
  let data 
 
  if(mobile_number){

   data = await reservations.search(mobile_number)
    
  }
  else{
    data = await reservations.list(date);
    data = data.filter((res)=> res.status !== "finished")
  } 



  res.json({ data });
}


async function create(req, res) {
  let data = await reservations.create1(req.body.data) 
  res.status(201).json({ data })
  }


module.exports = {
  list:[asyncErrorBoundary(list)],
create: [hasOnlyValidProperties, hasRequiredProperties,
   validValues , notInThePast ,notTuesday, 
   inOpeningHours, isStatusBooked
    ,asyncErrorBoundary(create)],
read:[reservationExist , asyncErrorBoundary(read)],
update:[reservationExist , hasValidValueOfStatus, isDiffrentFromCurrentStatus ,asyncErrorBoundary(update)],
};

