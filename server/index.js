const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');
const transactionsRoute = require('./routes/transactions');
require('dotenv').config();
const accountRoute = require('./routes/account');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.set('view engine', 'ejs');
app.use(cors());
app.use(authRoute);
app.use(profileRoute);
app.use(accountRoute.Router);
app.use(transactionsRoute);
app.use("*", (req,res) => {
  res.json("Page not found.");
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
