const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));

// const corsOption = { origin: ["http://localhost:3001"] };

app.use(cors());

var connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "Cheerful@2323",
  database: "mydb",
  // MultipleStatments: true,
});


app.listen(3001, (err) => {
  if (err) console.log(err);
  else console.log("running successfully");
});

connection.connect((err) => {
  if (err) console.log(err);
  else console.log("connected to mysql");
});

app.get("/install", (req, res) => {
  let Products = `CREATE TABLE if not exists Products (
    Product_id int auto_increment,
    product_url VARCHAR(255) ,
    product_name VARCHAR(255) ,
    PRIMARY KEY (Product_id)
    )`;

  let Description = `CREATE TABLE if not exists ProductDescription(
    Description_id int auto_increment,
    Product_id int ,
    Product_brief_description VARCHAR(255) ,
    Product_description VARCHAR(1000) ,
    Product_img VARCHAR(255) ,
    Product_link VARCHAR(255) ,
    PRIMARY KEY (Description_id),
    FOREIGN KEY (Product_id) REFERENCES Products(Product_id)
    )`;

  let price = `CREATE TABLE if not exists ProductPrice(
    Price_id int auto_increment,
    Product_id int ,
    Starting_price VARCHAR(255) ,
    Price_range VARCHAR(255) ,
    PRIMARY KEY (Price_id),
    FOREIGN KEY (Product_id) REFERENCES Products(Product_id)
    )`;

  // let orders = `CREATE TABLE if not exists Orders (
  //   order_id int auto_increment,
  //   Product_id int ,
  //   PRIMARY KEY (order_id),
  //   FOREIGN KEY (user_id) REFERENCES Products(Product_id)
  //   )`;

  // let users = `CREATE TABLE if not exists Users (
  //   user_id int auto_increment,
  //   Product_id int ,
  //   User_name VARCHAR(255) ,
  //   User_password VARCHAR(255) ,
  //   PRIMARY KEY (user_id),
  //   FOREIGN KEY (Product_id) REFERENCES Products (Product_id)
  //   )`;

  connection.query(Products, (err, results, fields) => {
    if (err) console.log(err.message);
  });

  connection.query(Description, (err, results, fields) => {
    if (err) console.log(err.message);
  });

  connection.query(price, (err, results, fields) => {
    if (err) console.log(err.message);
  });

  // connection.query(orders, (err, results, fields) => {
  //   if (err) console.log(err.message);
  // });

  // connection.query(users, (err, results, fields) => {
  //   if (err) console.log(err.message);
  // });

  res.end("Tables created");
  console.log("Tables created");
});

app.post("/insert", (req, res) => {
    console.table(req.body);

  const { url, name, bDescription, description, img, link, price, priceRange } =
    req.body;

  let insertProduct =
    "INSERT INTO Products (product_url, product_name) VALUES (?, ?)";

  let insertDescription =
    "INSERT INTO ProductDescription (Product_id, Product_brief_description, Product_description, Product_img, Product_link) VALUES (?, ?, ?, ?, ?)";

  let insertPrice =
    "INSERT INTO ProductPrice (Product_id, Starting_price, Price_range) VALUES (?, ?, ?)";

  // let insertOrder = "INSERT INTO Orders (Product_id) VALUES (?)";

  // let insertUser =
  //   "INSERT INTO Users (Product_id, User_name, User_password) VALUES (?, ?, ?)";

  connection.query(insertProduct, [url, name], (err, results, fields) => {
    if (err) console.log(err.message);

    const id = results.insertId;

    connection.query(
      insertDescription,
      [id, bDescription, description, img, link],
      (err, results, fields) => {
        if (err) console.log(err.message);
      }
    );

    connection.query(
      insertPrice,
      [id, price, priceRange],
      (err, results, fields) => {
        if (err) console.log(err.message);
      }
    );

    // connection.query(insertOrder, [id], (err, results, fields) => {
    //   if (err) console.log(err.message);
    // });

    // connection.query(
    //   insertUser,
    //   [id, userName, userPassword],
    //   (err, results, fields) => {
    //     if (err) console.log(err.message);
    //   }
    // );
  });

  res.end("inserted successfully");
  console.log("inserted successfully");
});


app.get("/iphones", (req, res) => {
  connection.query(
    "SELECT * FROM Products JOIN ProductDescription JOIN ProductPrice ON Products.Product_id=ProductDescription.Product_id AND Products.Product_id=ProductPrice.Product_id",
    (err, rows, fields) => {
      let iphones = { products: [] };
      iphones.products = rows;
      var stringIphones = JSON.stringify(iphones);
      if (!err) res.end(stringIphones);
      else console.log(err);
    }
  );
});

app.get("/ipads", (req, res) => {
  connection.query(
    "SELECT * FROM Products JOIN ProductDescription JOIN ProductPrice ON Products.Product_id=ProductDescription.Product_id AND Products.Product_id=ProductPrice.Product_id",
    (err, rows, fields) => {
      let ipads = { products: [] };
      ipads.products = rows;
      var stringIphones = JSON.stringify(ipads);
      if (!err) res.end(stringIpads);
      else console.log(err);
    }
  );
});

// app.get("/iphones", (req, res) => { // Define a GET route for "/iphones"
  
//   connection.query( // Start a database query
//     `SELECT *
//     FROM Product p  
//     INNER JOIN ProductDescription pd ON  p.product_id = pd.product_id 
//     INNER JOIN ProductPrice pp ON  p.product_id = pp.product_id 
//     `,
//     (err, results, fields) => { // Callback function to handle the query results
      
//       let iphones = { products: [] }; // Initialize an object to hold the products array
//       iphones.products = results; // Assign the query results to the products array in the iphones object
      
//       var stringIphones = JSON.stringify(iphones); // Convert the iphones object to a JSON string
      
//       if (!err) res.end(stringIphones); // If no error, send the JSON string as the response
//       else console.log(err); // If there's an error, log it to the console
//     }
//   );
// });
