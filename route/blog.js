const blog = require('../model/blog')


var all = {
    path: '/api/blog/all',
    method: 'get',
    func: function(request, response) {
        var blogs = blog.all()
        var r = JSON.stringify(blogs)
        response.send(r)
    }
}

var add = {
    path: '/api/blog/add',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        // 插入新数据并返回
        var b = blog.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var deleteBlog = {
    path: '/api/blog/delete',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        // 删除数据并返回结果
        var success = blog.delete(form.id)
        var result = {
            // success: success,
            success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}

var routes = [
    all,
    add,
    deleteBlog,
]

module.exports.routes = routes
