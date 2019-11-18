let express = require("express");
let bodyparser = require("body-parser");
let morgan = require("morgan");
let uuidv4 = require('uuid/v4');
let mongoose = require('mongoose');
let {PostList} = require('./blog-post-model');
const {DATABASE_URL, PORT} = require('./config');

let app = express();
let jsonParser = bodyparser.json();
mongoose.Promise = global.Promise;  

app.use(express.static('webpage'));
app.use(morgan('combined'));

/*
app.listen("8080",() => {
	console.log("ya estoy corriendo perrillo enserio");
});*/

function findId(id) {
    let index = -1;
    posts.forEach((p, idx) => {
        if (p.id == id) {
            index = idx;
        }
    })
    return index;
}

let posts = [
{
		id: uuidv4(),
		title: "Nuevas ofertas del buen fin",
		content: "Juguetes navidenos a mitad de precio",
		author : "Gerardo Suarez",
		publishDate: new Date(2019, 8, 24)
}, 
{
		id: uuidv4(),
		title: "Tecnologico de Monterrey baja precios por el buen fin",
		content: "El Tecnologico baja precios a la mitad este fin de semana",
		author : "Gerardo Suarez",
		publishDate: new Date(2015, 7, 10)
}
]

//return all blogposts
app.get("/blog-posts", (req, res, next) => {
    PostList.getAllPosts()
        .then(posts => {
            res.statusMessage = "all posts showed succesfully";
			return res.status(200).json(posts);
        })
        .catch(() => {
            res.statusMessage = "Something went wrong with the Database. Please try again later";
            return res.status(500).json({
                message: res.statusMessage,
                status: 500
            });
        });
});

//return blogpost by author
app.get("/blog-post?author=value", (req, res, next) => {
	let authorName = req.body.author;
	if(!authorName){
	 	res.statusMessages = "Author name is missing";
	 	return res.status(406).json({
	 		message : "Author name is missing",
	 		status : 406
	 	})
	}
    PostList.getPostsByAuthor(author)
        .then(posts => {
            if(posts.length == 0) {
                res.statusMessage = "Author does not exist";
				return res.status(404).json({
					message : "Author does not exist",
					status : 404
				});
            }        	
            res.statusMessage = "Author was found";
			return res.status().json(posts);
        })
        .catch(err => {throw Error(err)});
});

//add a new post
app.post("/blog-posts", jsonParser, (req, res, next) => {
	let title = req.body.title;
	let content = req.body.content;
	let author = req.body.author;
	let publishDate = req.body.publishDate;

	if(!title || !content || !author || !publishDate){
		res.statusMessage = "one of the fields is missing";
		return res.status(406).json({
			message : "one of the fields is missing",
			status : 406
		});
	}

	let id = uuidv4();
	let returnedPost = {
		id: id,
		title: title,
		content: content,
		author : author,
		publishDate: publishDate
	};

    PostList.post(returnedPost)
            .then(post => 
				res.statusMessage = "post published succesfully",
            	res.status(201).json(returnedPost))
            .catch(err => { throw Error(err); })
});

//delete a post
app.delete("/blog-posts/:id", (req, res, next) => {
	let reqId = req.params.id;    
    PostList.delete(reqId)
        .then(deleted => {
            if(deleted) {
                return res.status(200).json({
                    message: "Post deleted succesfully",
                    status: 200
                });
            }
            res.statusMessage = "Id does not exist";
            return res.status(404).json({
                message: "Id does not exist",
                status: 404
            });
        })
        .catch(err => { throw Error(err) });
});

//edit a post
app.put("/blog-posts/:id", jsonParser, (req, res, next) => {
	let bodyId = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let date = req.body.publishDate;
    let paramsId = req.params.id;

    if (!bodyId) {
        res.statusMessage = "Missing id field in body";
        return res.status(406).json({message: "Missing id field in body", status: 406});
    }

    if (paramsId != bodyId) {
        res.statusMessage = "Body and params Id do not match";
        return res.status(409).json({message: "Body and params Id do not match", status: 409});
    }

    PostList.updatePost(req.body)
        .then(newPost => {
            if(!newPost) {
                res.statusMessage = "ID was not found";
                return res.status(404).json({
                    message: "ID was not found" u7,
                    status: 404
                });
            }
            return res.status(202).json({
                message: "Post was updated successfully",
                status: 202
            });
        })
        .catch(err => { throw Error(err) });
});

let server;

function runServer(port, databaseURL) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseURL, err => {
            if(err) {
                return reject(err);
            }
            else {
                server = app.listen(port, () => {
                    console.log(`App is running on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    return reject(err);
                });
            }
        });
    });
}

function closeServer(){
    return mongoose.disconnect()
                   .then(() => {
                       return new Promise((resolve, reject) => {
                           console.log('Closing the server');
                           server.close( err => {
                               if (err){
                                   return reject(err);
                               }
                               else{
                                   resolve();
                               }
                           });
                       });
                   });
}

runServer(PORT, DATABASE_URL)
    .catch(err => {
        console.log(err);
    });

module.exports = { app, runServer, closeServer };