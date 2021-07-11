# Capstone: Restaurant Reservation System

This app is a reservation system for fine dining restaurants.
The software is used only by restaurant personnel when a customer calls to request a reservation.
At this point, the customers will not access the system online.

[Live Demo](https://front-end-topaz-one.vercel.app/dashboard)


### Tech Stack

This web app was developed using JavaScript, React, Express, Node, PostgreSQL, KnexJS, HTML, CSS, and BootStrap.

### Screenshots and User Stories

#### US-01 Create and list reservations

As a restaurant manager<br/>
I want to create a new reservation when a customer calls<br/>
so that I know how many customers will arrive at the restaurant on a given day.

Create reservation:

![Alt text](/screenshots/Create-reservation.png?raw=true)

list reservations:

![Alt text](/screenshots/list-reservation.png?raw=true)

#### US-02 Create reservation on a future, working date

As a restaurant manager<br/>
I only want to allow reservations to be created on a day when we are open<br/>
so that users do not accidentally create a reservation for days when we are closed.<br/>

Not in the past:

![Alt text](/screenshots/in-future.png?raw=true)

Not in a Tuesday:

![Alt text](/screenshots/not-in-tuesday.png?raw=true)

#### US-03 Create reservation within eligible timeframe

As a restaurant manager<br/>
I only want to allow reservations to be created during business hours, up to 60 minutes before closing<br/>
so that users do not accidentally create a reservation for a time we cannot accommodate.

![Alt text](/screenshots/during-hours.png?raw=true)

#### US-04 Seat reservation

As a restaurant manager, <br/>
When a customer with an existing reservation arrives at the restaurant<br/>
I want to seat (assign) their reservation to a specific table<br/>
so that I know which tables are occupied and free.

![Alt text](/screenshots/seat.png?raw=true)

#### US-05 Finish an occupied table

As a restaurant manager<br/>
I want to free up an occupied table when the guests leave<br/>
so that I can seat new guests at that table.<br/>

![Alt text](/screenshots/finished.png?raw=true)

#### US-06 Reservation Status

As a restaurant manager<br/>
I want a reservation to have a status of either booked, seated, or finished<br/>
so that I can see which reservation parties are seated, and finished reservations are hidden from the dashboard.

![Alt text](/screenshots/list-reservation.png?raw=true)

#### US-07 Search for a reservation by phone number

As a restaurant manager<br/>
I want to search for a reservation by phone number (partial or complete)<br/>
so that I can quickly access a customer's reservation when they call about their reservation.<br/>

Before:

![Alt text](/screenshots/search-before.png?raw=true)

After:

![Alt text](/screenshots/search-after.png?raw=true)

#### US-08 Change an existing reservation

As a restaurant manager<br/>
I want to be able to modify a reservation if a customer calls to change or cancel their reservation<br/>
so that reservations are accurate and current.


Before:

![Alt text](/screenshots/cancel-before.png?raw=true)

After:

![Alt text](/screenshots/cancel-after.png?raw=true)



### API Documentation

| Route                                                               | Method | Status Code | Description                                                         |
| ------------------------------------------------------------------- | ------ | ----------- | ------------------------------------------------------------------- |
| /reservations                                                       | GET    | 200         | Returns a list of reservations for the current date                 |
| /reservations?date=YYYY-MM-DD                                       | GET    | 200         | Returns a list of reservations for the given date                   |
| /reservations                                                       | POST   | 201         | Creates a new reservation                                           |
| /reservations/:reservation_id                                       | GET    | 200         | Returns the reservation for the given ID                            |
| /reservations/:reservation_id                                       | PUT    | 200         | Updates the status of the reservation for the given ID              |
| Changes the occupied status to be unoccupied for the given table_id | PUT    | 200         | Updates the status of the reservation for the given ID              |
| /tables                                                             | GET    | 200         | Returns a list of tables                                            |
| /tables                                                             | POST   | 201         | Creates a new table                                                 |
| /tables/:table_id                                                   | PUT    | 200         | Seats a reservation at the given table_id                           |
| /tables/:table_id/seat                                              | PUT    | 200         | Seats a reservation at the given table_id                           |
| /tables/:table_id/seat                                              | DELETE | 200         | Changes the occupied status to be unoccupied for the given table_id |


#### /reservations

GET "/reservations" response example:

```js
    {
        "reservation_id": 1,
        "first_name": "Marouane",
        "last_name": "Khabbaz",
        "mobile_number": 1234567890,
        "reservation_date": "YYYY-MM-DD",
        "reservation_time": "HH:MM",
        "people": 6,
        "status": "booked",
        "created_at": "2021-07-10 03:30:32"
        "updated_at": "2021-07-10 03:40:32"
    }
```

 POST `/reservations` 

```js

 The request should look like this:

    {
       "first_name": "Marouane",
        "last_name": "Khabbaz",
        "mobile_number": 1234567890,
        "reservation_date": "YYYY-MM-DD",
        "reservation_time": "HH:MM",
        "people": 6,
    }
```


PUT `/reservations/:reservation_id` 


```js

 The request should look like this:
 
    {
       "first_name": "Marouane",
        "last_name": "Khabbaz",
        "mobile_number": 1234567890,
        "reservation_date": "YYYY-MM-DD",
        "reservation_time": "HH:MM",
        "people": 6,
    }

```

PUT `/reservations/:reservation_id/status`


```js
  
 The request should look like this:
  
    {
        "status": "seated"
    }

```
#### /tables

GET `/tables` response exemple:

```js
    {
        "table_id": 4,
        "table_name": "#4",
        "capacity": 6,
        "reservation_id": 3,
        "created_at": "2021-07-10 03:30:32"
        "updated_at": "2021-07-10 03:30:32"
    }
```

 POST `/tables`

 

```js

Request should look like:
    
    {
        "table_name": "#4",
        "capacity": 2,
    }

```

 PUT `/tables/:table_id/seat`



```js

 Request should look like:

    {
        "reservation_id": 2
    }
```

## Installation

1. Download this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.
