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

var app = express();

//  主页输出 "Hello World"
app.get('/', function (req, res) {
   console.log(" 主页 GET 请求 ");
   res.send('Hello GET');
})


//增加文章
app.post('/post/:postId', function (req, res) {
    res.send('增加文章' + req.body);
    let post = new postModel(req.body)
    post.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        } else {
            res.send(post);
            // res.json(post)
        }
    })
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
