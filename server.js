// Require the Express Module
const express = require('express');
// Create an Express App
const app = express();
// Require body-parser (to receive post data from clients)
const bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
const path = require('path');

const session = require('express-session');

app.use(session({
    secret: 'codingmojo',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

const flash = require('express-flash');
app.use(flash());
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// Require Mongoose
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/dojo_quotes');


// DATABASE SCHEMA
var QuoteSchema = new mongoose.Schema({
 // name: String,
 // message: String
 name: { type: String, required: true, minlength: 2 },
 quote: { type: String, required: true, minlength: 2 },
 date: { type: Date, default: Date.now}
 // timestamps: { createdAt: 'created_at' }
}, {timestamps: true })

// Use native promises
mongoose.Promise = global.Promise;

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

// ------- ROUTES  ---------
// app.get('/', function(req, res) {
//   res.send("Hello User");
// })

// Root Request
app.get('/', function(req, res) {
    res.render('index', {} );
})

app.get('/quotes', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Quote.find({}, function(err, quotes) {
     // Retrieve an array of users
     if(err) {
       console.log("Error: ", err);
       return redirect('/');
     } else {
       return res.render('quotes', {quotes});
     }

   });
    // res.render('index', {users});
});


app.post('/quotes', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var quote = new Quote(req.body);
  // var quote = new Quote({name: req.body.name, message: req.body.message}, {timestamps: true});
  quote.save(function(err) {
    // if there is an error console.log that something went wrong!
    if(err) {
      console.log('something went wrong', err);
      // throw a flash error messsage
      for(var key in err.errors){
          req.flash('fail', err.errors[key].message);
      }
      res.redirect('/');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a quote!');
      res.redirect('/quotes');
    }
  });
});

app.listen(8000, function() {
  console.log("Listening on PORT:8000");
});
