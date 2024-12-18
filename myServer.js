var express = require("express");
var mysql2 = require("mysql2");
var bodyParser = require("body-parser");

require("dotenv").config(); // Load .env file into process.env

var app = express(); // Express framework
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Start the Server
const port = 3000;
app.listen(port, function () {
  console.log(`Server Started on Port ${port}`);
});

// MySQL connection configuration
const mysqlServer = mysql2.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// Connect to MySQL database
mysqlServer.connect(function (err) {
  if (err == null) {
    console.log("Connected to AIVen Database Server Successfully");
  } else {
    console.log(err.message);
  }
});

// Serve static files (e.g., SignInPage.html) enabling access to HTML, CSS, and JavaScript files.
app.use(express.static("public"));

const fileUpload = require("express-fileupload");
app.use(fileUpload());

// Serve the SignInPage.html
app.get("/", function (req, resp) {
  let path = __dirname + "/index.html";
  resp.sendFile(path);
});

// ===============================================================================
// UPLOADING TO Cloudinary
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
//================================================================================

app.post("/profileOrganizer", async function (req, resp) {
  let filename = "";
  if (req.files == null) {
    // If no picture is uploaded, set a default image
    filename = "nopic.jpg";
  } else {
    filename = req.files.profilepic.name;
    let path = __dirname + "/public/uploads/" + filename;
    console.log(path);
    req.files.profilepic.mv(path);

    // Saving the file/picture on the Cloudinary server
    await cloudinary.uploader.upload(path).then(function (result) {
      filename = result.url; // Get the URL of the image from Cloudinary
      console.log(filename);
    });
  }
  req.body.ppic = filename;

  // Save data according to the column sequence in 'organizations' table
  mysqlServer.query(
    "insert into organizations values(?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.emailid,
      req.body.organization,
      req.body.contact,
      req.body.address,
      req.body.city,
      req.body.proof,
      req.body.ppic,
      req.body.sports,
      req.body.picprev,
      req.body.website,
      req.body.socialhandle,
    ],
    function (err) {
      if (err == null) {
        resp.send("Record Saved Successfully");
        window.location.replace(window.location.href);
      }
      else resp.send(err.message);
    }
  );
});

// SEARCH FOR AN EMAIL
app.get("/search-org", (req, res) => {
  const emailid = req.query.emailid; // Get the email ID from the request

  const query = "SELECT * FROM users WHERE emailid = ?"; // Query to find the organization

  mysqlServer.query(query, [emailid], (err, result) => {
    if (err) {
      return res.send({ message: "Server error: " + err.message });
    }

    console.log(result);
    if (result.length > 0) {
      // If the organization is found, send the details back
      res.send({
        found: true,
      });
    } else {
      // If no organization is found with the given email
      res.send({ found: false });
    }
  });
});

app.post("/signupModal", (req, res) => {
  const { emailid, pwd, utype } = req.body;

  // Check if the email already exists
  mysqlServer.query(
    "SELECT * FROM users WHERE emailid = ?",
    [emailid],
    (err, result) => {
      if (err) {
        return res.send("Server error: " + err.message);
      }
      console.log(emailid);
      if (result.length > 0) {
        return res.send("This Email already exists");
      }

      // Insert new user into the users table, with current date set automatically
      const query =
        "INSERT INTO users (emailid, pwd, utype, status, dos) VALUES (?, ?, ?, ?, CURDATE())";
      const status = 1; // Assuming status 1 means active

      mysqlServer.query(query, [emailid, pwd, utype, status], (err, result) => {
        if (err) {
          console.log(emailid);
          return res.send("Error inserting data: " + err.message);
        }
        res.send("Signup successful");
      });
    }
  );
});

app.post("/loginModal", (req, res) => {
  const { emailid, pwd } = req.body;

  // Query to find the user based on email and password
  const query = "SELECT * FROM users WHERE emailid = ? AND pwd = ?";

  mysqlServer.query(query, [emailid, pwd], (err, result) => {
    if (err) {
      return res.send({ message: "Server error: " + err.message });
    }

    // If login is successful, send back the user type and a success message
    if (result.length > 0) {
      // If login is successful, send back the user type
      const user = result[0];
      res.send({ utype: user.utype });
    } else {
      // If no match found, send an invalid message
      res.send({ utype: "Invalid" });
    }
  });
});

app.get("/dashOrganizer", function (req, res) {
  let path3 = __dirname + "/dashOrganizer.html";
  res.sendFile(path3);
});

app.get("/profileOrganizer", function (req, res) {
  let path4 = __dirname + "/profileOrganizer.html";
  res.sendFile(path4);
});
// PUBLISH TOURNAMENTS
app.get("/publishTournaments", function (req, res) {
  let path5 = __dirname + "/publish-tournaments.html";
  res.sendFile(path5);
});
app.post("/publish-tournament", async function (req, res) {
  let filename = "";

  try {
    // Check if no picture is uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      filename = "nopic.jpg"; // Default image if no file is uploaded
    } else {
      // Get the uploaded file
      const poster = req.files.poster;
      filename = poster.name;

      // Define the path to save the image locally
      let path = __dirname + "/public/uploads/" + filename;

      // Move the uploaded file to the server's directory
      poster.mv(path, async function (err) {
        if (err) {
          return res.send("File upload failed: " + err.message);
        }

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(path);
        filename = result.url; // Get the URL of the uploaded image on Cloudinary
        console.log(filename);

        // Update the req.body with the Cloudinary URL
        req.body.poster = filename;

        console.log(req.body);
        // Save data in the 'tournaments' table
        mysqlServer.query(
          "INSERT INTO tournaments (emailid, game, title, fee, dot, city, location, prizes, poster, info) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            req.body.emailid,
            req.body.game,
            req.body.title,
            req.body.fee,
            req.body.dot,
            req.body.city,
            req.body.location,
            req.body.prizes,
            req.body.poster,
            req.body.info,
          ],
          function (err) {
            if (err == null) {
              res.send("Tournament published successfully!");
            } else {
              res.send(err.message);
            }
          }
        );
      });
    }
  } catch (err) {
    res.send("Server Error: " + err.message);
  }
});

app.get("/dashPlayer", function (req, resp) {
  let path6 = __dirname + "/dashPlayer.html";
  resp.sendFile(path6);
});

app.get("/index", function (req, resp) {
  let path7 = __dirname + "/index.html";
  resp.sendFile(path7);
});

app.get("/update-password", function (req, resp) {
  let email = req.query.txtEmail;
  let currpwd = req.query.txtCurrPass;
  let newpwd = req.query.txtNewPass;

  console.log(email);
  console.log(currpwd);
  console.log(newpwd);

  mysqlServer.query(
    "update users set pwd=? where emailid=? and pwd=?",
    [newpwd, email, currpwd],
    function (err, result) {
      console.log(result.affectedRows);
      if (err != null) {
        resp.send(err.message);
      } else if (resp.affectedRows == 1) {
        resp.send("Password Updated Successfully");
      } else {
        resp.send("Invalid Credentials");
      }
    }
  );
});

//======================================================================
app.get("/tournamentsFinder", function (req, resp) {
  let path8 = __dirname + "/public/tournaments-finder.html";
  resp.sendFile(path8);
});
// Endpoint to fetch all tournaments
app.get("/fetch-all-tournaments", (req, res) => {
  const query = "SELECT * FROM tournaments";
  mysqlServer.query(query, (err, results) => {
    if (err == null) {
      res.json(results);
    } else {
      return res.send(err);
    }
  });
});

// Endpoint to fetch all unique cities
app.get("/fetch-all-cities", (req, res) => {
  const query = "SELECT DISTINCT city FROM tournaments";
  mysqlServer.query(query, (err, results) => {
    if (err) {
      return res.send(err);
    }
    res.json(results);
  });
});

// Endpoint to fetch all unique game names
app.get("/fetch-all-games", (req, res) => {
  const query = "SELECT DISTINCT game FROM tournaments";
  mysqlServer.query(query, (err, results) => {
    if (err) {
      return res.send(err);
    }
    res.json(results);
  });
});

app.post("/profilePlayer", async function (req, resp) {
  let filename = "";

  if (req.files == null) {
    // If no picture is uploaded, use default image
    filename = "nopic.jpg";
  } else {
    filename = req.files.profilepic.name;
    let path = __dirname + "/public/uploads/" + filename;
    console.log(path);

    // Move file to uploads directory
    req.files.profilepic.mv(path);

    // Save the file on Cloudinary server
    await cloudinary.uploader
      .upload(path)
      .then(function (result) {
        filename = result.url; // Get Cloudinary URL
        console.log(filename);
      })
      .catch(function (error) {
        console.error("Cloudinary Upload Error:", error);
        return resp.send("Image upload failed.");
      });
  }

  console.log(req.body);
  req.body.ppic = filename; // Save image URL to the body object

  // Insert form data into MySQL database
  mysqlServer.query(
    "INSERT INTO playersprofile (emailid, fullname, contact, address, city, zip, proof, ppic, sports, previousachievements, website, socialhandle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.emailid,
      req.body.fullname,
      req.body.contact,
      req.body.address,
      req.body.city,
      req.body.zip,
      req.body.proof,
      req.body.ppic,
      req.body.sports,
      req.body.previousachievements,
      req.body.website,
      req.body.socialhandle,
    ],
    function (err) {
      if (err == null) 
      {
        resp.send("Record Saved Successfully");
        window.location.replace(window.location.href); 
      }
      else 
      resp.send(err.message);
    }
  );
});

const nodemailer = require('nodemailer');
require('dotenv').config();

// Route to send verification email
app.post("/send-verification-email", (req, res) => {
  const email = req.body.email;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // SMTP SERVICE
    auth: {
      user: process.env.EMAIL_USER, // From .env file
      pass: process.env.EMAIL_PASS, // From .env file
    },
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Welcome to Goal Sync! 🎉
We’re excited to have you join our community! Here, players and organizers come together to create amazing experiences.

    🌟 As a Player: Find events, showcase your skills, and connect with organizers who can take you to the next level.

    🌟 As an Organizer: Discover talented players, host events, and build lasting collaborations.

    Let’s get started and make some meaningful connections! If you need help, our support team is just a click away.`,
  });
});

// CHAT WITH US
app.post("/chatMessage", (req, resp) => {
  const { name, email, phone, message } = req.body;

  const query = "INSERT INTO CHAT (name, email, phone, message) VALUES (?,?,?,?)";
  mysqlServer.query(query, [name, email, phone, message], function (err, result) {
    if (err == null) {
      resp.send("Thank You...")
          } else {
      resp.send("Server Error"); 
    }
  });
});
