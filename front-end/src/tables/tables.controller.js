const service = require("./tables.service")
const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");



const VALID_PROPERTIES = [
    'table_id',
    "table_name",
    "capacity",
    "reservation_id"
  ];
  

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_PROPERTIES.includes(field)
    );
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}, only capacity and table_name allowed`,
      });
    }
    next();
  }


  const hasRequiredProperties = hasProperties("table_name", "capacity" );

  // const  hasRequiredPropertiesForPut = hasProperties( "reservation_id");
 

  function hasRequiredPropertiesForPut(req, res , next){
    const { data = {} } = req.body;
    if(data.reservation_id === undefined ||data.reservation_id === 0 ){
      next({
        status: 400,
        message: `A reservation_id property is required.`,
      })
    }
    else{
      next()
    }
  }

  function capacityIsNumber(req ,res , next){
    const { data : {capacity} = {} } = req.body;
   
    if (typeof capacity !== 'number'){
      return next({
        status: 400,
        message: `capacity: must be a Number`,
      });
    } 
    else {
      next()
    }
  }
  
function verifyLengthOfTableName(req , res , next){
    const { data : {table_name} = {} } = req.body;
    if (table_name.length < 2){
        return next({
          status: 400,
          message: `table_name is too short`,
        });
      } 
      else {
        next()
      }
}

async function tableExist(req , res , next){
    const {tableId} = req.params;
    let table = await service.readData(tableId);
    if(table){
        req.table = table
        next();
    } else{
        next({
            status:404,
            message:`Table with id ${tableId} cannot be found.`
        });
    }
  }

  async function read(req, res , next){

  res.json({ data : req.table});

  }

  async function isOccupied(req, res , next){

    const { data : {reservation_id} = {} } = req.body;

    const {tableId} = req.params;

    if(req.table.reservation_id && reservation_id !== null){ 

      next({
        status:400,
        message:`Table with id ${tableId} is occupied.`
    });  

    }
    else{
      next()
    }

  }

  async function setStatusToSeated (req, res , next) {
    const { data : {reservation_id} = {} } = req.body;
    let reservation = await reservationService.readData(reservation_id);

    if(!reservation){
      next({
        status:400,
        message:`reservation with if ${reservation_id} doesnt exist`
      })
    } else if(reservation.status === "seated"){

      next({
        status:400,
        message:`reservation already seated`
      })

    } else {
      reservation = {
        ...reservation,
        status: "seated"
      }
  
    const  seatedStatus = await  reservationService.update(reservation);
    
    next()
    }  
  }

async function hasSufficientCapacity(req, res , next){

  const {tableId} = req.params;

  const { data : {reservation_id} = {} } = req.body;

  if(reservation_id){

    let reservation = await reservationService.readData(reservation_id);

    const {people} = reservation;

    const {capacity} = req.table;

    if(people> capacity){

      next({
      status:400,
      message:`Table with id ${tableId} doesnt have enough capacity`

       })  }
    else{
      next()
    }
  }
  else{
    next()
  }

}
async function isNotOccupied(req , res , next){

  if(req.table.reservation_id === null){

    next({
      status:400,
      message:`Table is not occupied`
     }) 

  }else{
    next()
  }

}
async function setStatusToFinish(req, res , next){
  let reservation = await reservationService.readData(req.table.reservation_id);

  

  if(reservation){
    reservation = {
      ...reservation,
      status: "finished"
    }

  const  finishStatus = await  reservationService.update(reservation);
  
  }

  next()

}


async function destroy(req , res , next){

  const {tableId} = req.params;

  const table = {
      ...req.table,
      reservation_id :null
  };

  let updated = await  service.update(table);

  res.json({data: updated });

}



  async function update(req , res , next) {

    const {tableId} = req.params;

    const table = {
        ...req.body.data,
        table_id: tableId
    };

    let updated = await  service.update(table);

    res.json({data: updated });

}

  async function create(req, res) {

    let data = await service.create1(req.body.data) ;
    
    res.status(201).json({ data });

    }
  

    async function list(req, res) {

        let data = await service.list()

       res.json({ data });

     }
  
  module.exports = {

    list,

    create: [hasOnlyValidProperties, hasRequiredProperties ,
      capacityIsNumber ,verifyLengthOfTableName,
      asyncErrorBoundary(create)],

    read:[tableExist , asyncErrorBoundary(read)], 

    update:[tableExist, hasOnlyValidProperties,
       hasRequiredPropertiesForPut, isOccupied , 
       setStatusToSeated,
       hasSufficientCapacity,asyncErrorBoundary(update) ],

    delete: [tableExist, isNotOccupied ,
      setStatusToFinish,
      asyncErrorBoundary(destroy) ]

  };
  
