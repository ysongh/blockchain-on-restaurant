const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const db_key = require('./config/keys').mongoURI;

const app = express();

const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

const imageFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: imageFilter }).single('image'));

app.use(cors());

app.get('/', (req, res) => res.send('Server Work'));
app.use('/api/restaurant', require('./routes/restaurant'));
app.use('/api/restaurant', require('./routes/deal'));

const port = process.env.PORT || 1000;

mongoose.connect(db_key, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => console.log('Database Connected'));
    })
    .catch(err => {
        console.log(err);
    }); 