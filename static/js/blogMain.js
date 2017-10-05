var log = console.log.bind(console, '*** ')

var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

var blogTemplate = function(blog) {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
    <div class="jimmy-blog-cell">
        <div class="">
            <a class="blog-title" href="#" data-id="${id}">
                ${title}
            </a>
        </div>
        <div class="">
            <span>${author}</span> @ <time>${time}</time>
        </div>
        <div class="blog-comments">
            <div class='new-comment jimmy-auto-form'>
                <input class='comment-blog-id jimmy-auto-input' data-key="blog_id" type=hidden value="${id}">
                <input class='comment-author jimmy-auto-input' data-key="author" value="">
                <input class='comment-content jimmy-auto-input' data-key="content" value="">
                <button class='comment-add jimmy-auto-submit'
                        data-method="POST"
                        data-path="/api/comment/add"
                >添加评论</button>
            </div>
        </div>
    </div>
    `
    return t
}

var insertBlogAll = function(blogs) {
    var html = ''
    for (var i = 0; i < blogs.length; i++) {
        var b = blogs[i]
        var t = blogTemplate(b)
        html += t
    }
    // 把数据写入 .jimmy-blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.jimmy-blogs')
    div.innerHTML = html
}

var blogAll = function() {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            console.log('响应', response)
            var blogs = JSON.parse(response)
            window.blogs = blogs
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

var blogNew = function(form) {
    // var form = {
    //     title: "测试标题",
    //     author: "jimmy",
    //     content: "测试内容",
    // }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

var commentNew = function(form, callback) {
    // var form = {
    //     title: "测试标题",
    //     author: "jimmy",
    //     content: "测试内容",
    // }
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/comment/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
            callback(res)
        }
    }
    ajax(request)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var bindEventBlogAdd = function () {
    var button = e('#id-button-submit')
    button.addEventListener('click', function(event){
        console.log('click new')
        // 得到用户填写的数据
        var form = {
            title: e('#id-input-title').value,
            author: e('#id-input-author').value,
            content: e('#id-input-content').value,
        }
        if(form.author == '') {
            swal(
                '提示',
                '作者不能为空',
                'error'
            )
        } else {
            // 用这个数据调用 blogNew 来创建一篇新博客
            blogNew(form)
            swal(
                '恭喜',
                '博客发表成功',
                'success'
            )
        }
    })
}

var bindEventCommentAdd = function () {
    log('bind 评论 add')
    var container = e('.jimmy-blogs')
    container.addEventListener('click', function (event) {
        var self = event.target
        if(self.classList.contains('comment-add')) {
            // 发表评论
            log('发表评论 click')
            var form = {}
            var inputs = self.closest('.new-comment').querySelectorAll('input')
            // log('inputs', inputs)
            for(var i = 0; i < inputs.length; i++) {
                var input = inputs[i]
                form[input.dataset.key] = input.value
            }
            // log('debug', form)
            commentNew(form, function (comment) {
                log('comment, ', comment)
            })
        }
    })
}

var blogAddBlock = function (response) {
    swal(
        '恭喜',
        '博客发表成功',
        'success'
    )
    log('blog add block 回调')
}

var bindJimmyAuto =function () {
    var body = e('body')
    body.addEventListener('click', function (event) {
        var self = event.target
        if(self.classList.contains('jimmy-auto-submit')) {
            var dx = self.closest('.jimmy-auto-form')
            var form = {}
            var inputs = dx.querySelectorAll('.jimmy-auto-input')
            for(var i = 0; i < inputs.length; i++) {
                var input = inputs[i]
                form[input.dataset.key] = input.value
            }
            // 找到 method 和 path
            var method = self.dataset.method
            var path = self.dataset.path
            var callback = self.dataset.response
            var data = JSON.stringify(form)
            var request = {
                method: method,
                url: path,
                data: data,
                contentType: 'application/json',
                callback: function(response) {
                    log('自动表单 响应', response)
                    window[callback](response)
                }
            }
            ajax(request)
        }
    })
}

var bindEvents = function() {
    // 绑定发表新博客事件
    // bindEventBlogAdd()
    // 绑定发表评论事件
    // bindEventCommentAdd()

    bindJimmyAuto()
}

var __main = function() {
    // 载入博客列表
    blogAll()
    // 绑定事件
    bindEvents()
}

__main()
