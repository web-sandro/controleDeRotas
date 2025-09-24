require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const gridController = require('./controllers/gridController');
const selectionRoutes = require('./routes/selectionRoutes');


const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// rotas
app.use('/api/selections', selectionRoutes);

// rotas MVC -> controller
app.get('/', gridController.index);
app.get('/api/events', gridController.listEvents);
app.post('/api/events', gridController.createOrUpdateEvents);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));