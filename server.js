var express = require('express');
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost/post_database';
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;
mongoose.Promise = global.Promise;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//Define a schema
var Schema = mongoose.Schema;

var postSchema = new Schema({
    ID   : String,
    title: String,
    contents: String,
    comments: [String],
});

const postModel = mongoose.model('postModel', postSchema);


// Server part
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  主页输出 "Hello World"
app.get('/', function (req, res) {
   console.log(" 主页 GET 请求 ");
   res.send('Hello GET');
})


//增加文章
app.post('/post/:postID', function (req, res) {
    let post = new postModel(req.body)

    post.ID = req.params.postID
    post.save()
        .then(returnPost => res.json(returnPost))
        .catch(err => console.log(err))
})

//读取具体文章
app.get('/post/:postID', function (req, res) {
    let postID = req.params.postID
    if(postID) {
        postModel.findOne({ID: postID})
            .then(returnPost => res.json(returnPost))
            .catch(err => console.log(err))
    }
    res.send("end")
})

//读取全部文章
app.get('/posts', function (req, res) {
    postModel.find({})
        .then(returnPost => res.json(returnPost))
        .catch(err => console.log(err))
    res.send("end")
})

//修改文章
app.put('/post/:postID', function (req, res) {
    let post = new postModel(req.body)
    let postID = req.params.postID
    if(postID) {
        postModel.findOneAndUpdate(
            {ID: postID},
            {title: post.title, contents: post.contents, comments: post.comments },
            {new: true})
            .then(returnPost => res.json(returnPost))
            .catch(err => console.log(err))
    }
    res.send("end")
})

// 删除具体文章
app.delete('/post/:postID', function (req, res) {
    let postID = req.params.postID
    if(postID) {
        postModel.find({ID: postID}).remove()
            .then(() => console.log("delete success: "))
            .catch(err => console.log(err))
    }
    res.send("end")
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log(" 应用实例，访问地址为 http://%s:%s", host, port)

})
