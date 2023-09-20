$(function () {
    var layer = layui.layer
    var form = layer.form
    initCateList()

    // 功能一：发起请求获取数据，渲染页面内容
    function initCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                if (res.atatus === 0) {
                    // 获取数据成功，使用模板引擎渲染页面
                    // 语法：template('模板id',渲染数据)
                    var htmlList = template('tpl_list', res)
                    // 将模板中的数据渲染在页面中
                    $('tbody').html(htmlList)
                }
            }
        })
    }

    // 功能二：弹出层
    // 预先保存弹出层的索引值
    var addIndex = null
    $('#addList').click(function () {
        // layer.open():弹出层
        // 属性： ①type指定弹出层类型，默认为0，信息框；1为页面层
        //  ②area(['','']):指定弹出层的宽高
        addIndex = layer.open({
            type: 1,
            area: ['450px', '250px'],
            title: '添加文章分类',
            // 在html中指定页面结构，在js中引入
            // 语法：$('').html()
            content: $('#dilageList').html()
        })

        //功能三：实现添加文章功能分类
        // 知识点：弹出层为动态事件，该页面中未存在该元素
        //         需要通过事件代理的形式为该元素动态绑定事件
        // 格式：$('页面中已存在元素').on('事件'，'绑定事件的元素'，function(){})
        // 注意：为submit事件，阻止默认事件
        $('body').on('submit', '#form-add', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'post',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('添加文章失败！')
                    }
                    // 添加文章成功，重新渲染页面
                    initCateList()
                    // 注意：先渲染页面，再弹出信息
                    layer.msg('添加文章成功！')
                    // 自动关闭弹出层
                    // 语法：layer.close(index),index为弹出层的索引值
                    layer.close(addIndex)
                }
            })
        })
        // 重置按钮会自动实现重置功能

        // 功能四：实现编辑功能
        // 为动态元素绑定事件，使用事件委托
        var editIndex = null
        $('tbody').on('click', '#btEdit', function () {
            // 4.1.弹出层
            editIndex = layer.open({
                type: 1,
                area: ['450px', '250px'],
                title: '修改文章分类',
                // 在html中指定页面结构，在js中引入
                // 语法：$('').html()
                content: $('#editList').html()
            })
            // 4.2.为弹出层获取信息，并进行信息填充
            // 注意：需要给编辑按钮添加自定义属性，更好地获取对应列表中的图书信息、

            // 将对应的id值取出
            var id = $(this).attr('data-id')
            $.ajax({
                method: 'get',
                url: '/my/article/cates/' + id,
                success: function (res) {
                    if (res.status === 0) {
                        // 获取数据成功，填充表单的值
                        form.val('form-edit', res.data)
                    }
                }
            })

            // 功能五：修改文章分类
            $('tbody').on('submit', '#editArticle', function (e) {
                e.preventDefault()
                $.ajax({
                    method: 'post',
                    url: '/my/article/updatecate',
                    data: $(this).serialize(),
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('修改数据失败！')
                        }
                        // 数据上传成功，并渲染数据
                        //  注意：关闭弹出层
                        layer.close(editIndex)
                        layer.msg('修改数据成功！')
                        initCateList()
                    }
                })
            })

            // 功能六：删除文章分类
            $('tbody').on('click', '#btDelete', function () {
                var id = $(this).attr('data-id')
                // 弹出询问框，确认是否删除
                layer.confirm('确定删除', { icon: 3, title: '提示' }, function (index) {
                    //确认删除，执行的回调函数
                    $.ajax({
                        method: 'get',
                        url: '/my/article/deletecate/' + id,
                        success: function (res) {
                            if (res.status !== 0) {
                                return layer.msg('删除失败！')
                            }
                            initCateList()
                                // 注意：还需关闭询问框
                                close(index)
                                layer.msg('删除成功！')
                        }
                    })
                })
            })
        })
    })
})