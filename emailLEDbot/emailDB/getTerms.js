require('dotenv/config');
let mongoose = require('mongoose');
var fs = require('fs');

//Connecting to Database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('connected to database!...pulling terms')
  });

let termSchema = new mongoose.Schema({
    term: String
})

var model = mongoose.model('term', termSchema)


model.find({}).lean().then(doc => {
    //console.log(doc)

    fs.writeFile( 'terms.json', JSON.stringify(doc), function(err) {
      if (err) {
          console.log(err);
      }

      process.exit()
  });
  })
  .catch(err => {
    console.error(err)
  })
