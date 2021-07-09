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
  "people"
];

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
const hasRequiredProperties = hasProperties(...VALID_PROPERTIES );

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
      message: `reservation_date and reservation_time must be valid`,
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
          message:"Reservation cannot be found."
      });
  }
}

async function read(req, res , next){
res.json({ data : req.reservation});
}


async function list(req, res) {
  const  {date} = req.query;
  let data = await reservations.list(date)
  res.json({
    data
  });
}


async function create(req, res) {
  let data = await reservations.create1(req.body.data) 
  res.status(201).json({ data })
  }


module.exports = {
  list,
create: [hasOnlyValidProperties, hasRequiredProperties, validValues , notInThePast ,notTuesday, inOpeningHours ,asyncErrorBoundary(create)],
read:[reservationExist , read]
};

/*
async function movieExist(req , res , next){
  const {movieId} = req.params;
  let movie = await movies.readData(movieId);
  if(movie){
      next();
  } else{
      next({
          status:404,
          message:"Movie cannot be found."
      });
  }
}

async function read(req, res , next){
  try{
  const {movieId} = req.params;
let data = await movies.readData(movieId);
res.json({ data });
  }
  catch(err){
      console.log(err);
  }
}
*/