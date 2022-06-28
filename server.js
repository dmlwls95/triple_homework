const express = require('express');
const { sequelize } = require('./models');
const app = express();
const server = require('http').createServer(app);
//************************************** cors */
//************************************** init */


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.raw());

app.enable('trust proxy');
const port = process.env.PORT || 4000;
//************************************** DB */
sequelize.sync({ force: true })
    .then(()=>{
        console.log('db is connected');
    })
    .catch((err)=>{
        console.error(err);
    });

//************************************** routes */
const mileageRoutes = require('./routes/mileage.route.js');
app.use('/events', mileageRoutes);

server.listen(port, function(){
    console.log('Listening on port ' + port);
})

