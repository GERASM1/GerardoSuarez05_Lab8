exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/gerardo-blog-post";
exports.PORT = process.env.PORT || 8080;

//mongodb+srv://GERASM1:<password>@lab8cluster-m3qv2.mongodb.net/test?retryWrites=true&w=majority

/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://GERASM1:<password>@lab8cluster-m3qv2.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/
