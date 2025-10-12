
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require("./src/config/db");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const routes = require('./src/routes/api.routes');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());

// Connect DB
connectDB();

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send(`<h2>Welcome to Shopping Website</h2>`);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
