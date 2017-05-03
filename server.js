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

app.use(bodyParser.urlencoded());
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
    post.save(function (err) {
        if (err) {
            return res.send(err)
        } else {
            console.log("id: "+req.params.postID)
            console.log("req.body", req.body)
            console.log("post ", post)
            res.end()
            // res.send(post);
            // res.json(post)
        }
    })
})

//读取具体文章
app.get('/post/:postID', function (req, res) {
    let postID = req.params.postID
    if(postID) {
        postModel.findOne({ID: postID}, function (err, returnPost) {
            if (!err){
                console.log("returnPost: ", returnPost)
            }{
                throw err;
            }
        });
    }
    res.send("end")
})

//读取全部文章
app.get('/posts', function (req, res) {
    postModel.find({}, function(err, returnPostbacks) {
        if (!err){
            console.log(returnPostbacks);
        } else {
            throw err;
        }
    });
    res.send("end")
})

//  /del_user 页面响应
 app.get('/del_user', function (req, res) {
   console.log("/del_user 响应 DELETE 请求 ");
   res.send('删除页面');
})

//  /list_user 页面 GET 请求
 app.get('/list_user', function (req, res) {
   console.log("/list_user GET 请求 ");
   res.send('用户列表页面');
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
 app.get('/ab*cd', function(req, res) {
   console.log("/ab*cd GET 请求 ");
   res.send('正则匹配');
})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log(" 应用实例，访问地址为 http://%s:%s", host, port)

})
