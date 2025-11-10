const express = require('express');
const app = express();

app.use(express.json());
const userRoutes = require('./Routes/routes')
app.use('/', userRoutes)

app.listen(3000, () => {
  console.log('Server running on port 3000');
});