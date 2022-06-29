const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{

    console.log('MongoDB Successfully Connected!');
}).catch(()=>{
    console.log('Some error occured!');
});

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', async (req, res)=>{

    const shortUrls = await shortUrl.find();

    res.status(200).render('index', {shortUrls: shortUrls});
    
});

app.post('/shortUrls', async (req, res)=>{

    await shortUrl.create({full: req.body.fullURL});

    res.redirect('/');
});

app.get('/:shortURL', async (req, res)=>{

    const shorturl = await shortUrl.findOne({short: req.params.shortURL});

    if(!shorturl) return res.status(404).send("404 Not Found!");

    shorturl.clicks++;
    await shorturl.save();

    res.redirect(shorturl.full);
});

app.post('/:shortURL', async (req, res)=>{

    try {
        
        await shortUrl.findOneAndDelete({short: req.params.shortURL});

        res.redirect('/');

    } catch (error) {
        
        res.status(404).send('404 Not Found!');
    }
});

app.listen(port, ()=>{

    console.log(`The Server is running at port: ${port}`);
});