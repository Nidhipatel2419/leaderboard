const connection = require("../mysql");
const { faker } = require("@faker-js/faker");
const mysql = require('mysql2');

// Function to generate random dummy data
const generateUsers = (noofusers) => {
  let users = [];
  for (let i = 0; i < noofusers; i++) {
    users.push([faker.person.firstName()]);
  }
  return users;
};

const generateActivities = (userId) => {
  let activities = [];
  for (let i = 0; i < 1; i++) {
    const name = Math.random() > 0.5 ? "walking" : "running";
    activities.push([userId, faker.date.recent(), 20, name]);
  }
  return activities;
};

const addUsers = async (req, res) => {
  try {
    const users = generateUsers(req.body.noofusers);
    const query = "INSERT INTO users (name) VALUES ?";
    connection.query(query, [users], (err, result) => {
      if (err) throw err;
      const userIds = Array.from({ length: result.insertId }, (_, i) => i + 1);
      userIds.forEach((userId) => {
        const activities = generateActivities(userId);
        connection.query(
          "INSERT INTO activites (user_id, dateandtime, points,name) VALUES ?",
          [activities],
          (err, result) => {
            if (err) throw err;
            console.log("Data inserted");
          }
        );
      });
      res.send({ status: true, message: "Data inserted successfully." });
    });
  } catch (err) {
    console.error(err);
    res.send({ status: false, message: "Something went wrong #1." });
  }
  //   try {
  //     const dummyData = generateDummyData(req.body.noofusers); // Generate 100 dummy records
  //     insertDummyData(dummyData);

  //     res.send({ status: true, message: `${req.body.noofusers} rows inserted.` });
  //   } catch (error) {
  //     console.log("Error at addUser:", error);
  //     res.send({status:false,message:"Somthing went wrong"})
  //   }
};

const getUser = async (req, res) => {
  try {
    console.log("req.body",req.query)
    const  filter = req.query.filter;
    const userId =req.query.userId;
    let query = `
          SELECT u.id, u.name, SUM(a.points) AS total_points
          FROM users u
          JOIN activites a ON u.id = a.user_id
        `;

    if (filter === "day") {
      query += ` WHERE DATE(a.dateandtime) = CURDATE()`;
    } else if (filter === "month") {
      query += ` WHERE MONTH(a.dateandtime) = MONTH(CURDATE())`;
    } else if (filter === "year") {
      query += ` WHERE YEAR(a.dateandtime) = YEAR(CURDATE())`;
    }

    console.log("query--",userId)
    if (userId) {
      query += ` AND u.id = ${mysql.escape(userId)}`;
    }

    query += ` GROUP BY u.id ORDER BY total_points DESC`;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("error ---",err)
          res.send({status:false,message:"Internal server error.#3"})
        } else {
          res.send({status:true,data:results});
        }
      });
  } catch (error) {
    console.log("error ---",error)
    res.send({ status: false, message: "Something went wrong #2" });
  }
};

module.exports = { addUsers, getUser };
