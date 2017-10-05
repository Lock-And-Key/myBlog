var express = require('express')
var app = express()
var bodyParser = require('body-parser')


app.use(bodyParser.json())

app.use(express.static('static'))


const registerRoutes = function(app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        app[route.method](route.path, route.func)
    }
}

// app['get'](路径, 路由函数)
// app.get('/', function (request, response) {
// })

// const routeModules = [
//     './route/index',
//     './route/blog',
//     './route/comment',
// ]


// 导入 route/index.js 的所有路由数据
const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

// 导入 route/blog 的所有路由数据
const routeBlog = require('./route/blog')
registerRoutes(app, routeBlog.routes)

// 导入 route/comment 的所有路由数据
const routeComment = require('./route/comment')
registerRoutes(app, routeComment.routes)

// const routeFiles = [
//     './route/index',
//     './route/blog',
//     './route/comment',
// ]
// var registerAll = function (routeFiles) {
//     for(var i = 0; i < routeFiles.length; i++){
//         var file = routeFiles[i]
//         var r = require(file)
//         registerRoutes(app, r.routes)
//     }
// }


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
