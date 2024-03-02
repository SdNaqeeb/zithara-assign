const express = require("express");
const pool = require("./db");
const cors = require("cors");
const { faker } = require("@faker-js/faker");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/seed", async (req, res) => {
  try {
    for (let i = 1; i <= 50; i++) {
      const name = faker.person.fullName();
      const age = faker.number.int(10);
      const phone = faker.number.int(1000000000);
      const location = faker.location.city();
      await pool.query(
        "INSERT INTO data (name, age, phone, location) VALUES ($1, $2, $3, $4)",
        [name, age, phone, location]
      );
    }
    res.json({ message: "Data generation complete" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating data" });
  }
});

app.get("/data", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || "";
    const order = req.query.order || "asc";
    let sortBy = "";
    if (sort === "date") {
      sortBy = `created_at ${order}`;
    } else if (sort === "time") {
      sortBy = `created_at ${order}`;
    }

    const offset = (page - 1) * limit;

    let query = `SELECT sno, name, age, phone, location, TO_CHAR(created_at, 'YYYY-MM-DD') AS date, TO_CHAR(created_at, 'HH24:MI') AS time FROM data`;

    if (searchTerm) {
      query += ` WHERE name ILIKE '%${searchTerm}%' OR location ILIKE '%${searchTerm}%'`;
    }

    if (sortBy) {
      query += ` ORDER BY ${sortBy}`;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const results = await pool.query(query);
    const total = await pool.query("SELECT COUNT(*) FROM data");

    res.json({
      data: results.rows,
      total: await pool.query("SELECT COUNT(*) FROM data"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.q || "";

    const query = `SELECT sno, name, age, phone, location, TO_CHAR(created_at, 'YYYY-MM-DD') AS date, TO_CHAR(created_at, 'HH24:MI') AS time FROM data WHERE name ILIKE '%${searchTerm}%' OR location ILIKE '%${searchTerm}%'`;

    const results = await pool.query(query);

    res.json({ data: results.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
