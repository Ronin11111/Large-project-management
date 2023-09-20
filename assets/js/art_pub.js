$(function () {
    var layer = layui.layer
    var form = layui.form
    selectList()

    // 2.初始化富文本编辑器
    initEditor()

    // 3.图片裁剪区
    // 3.1. 初始化图片裁剪器
    var $image = $('#image')
    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 1.动态渲染下拉选择框
    function selectList() {
        $.ajax({
            method: 'get',
            url: '',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                var htmlStr = template('tpl-select', res)
                $('.cate_id').html(htmlStr)
                // 注意：一定要调用form.render()，重新渲染
                form.render()
            }
        })
    }

    // 4.实现头像文件上传
    $('#fileBt').click(function () {
        // 4.2.触发文件域的点击事件
        $('#fileUp').click()
    })

    // 4.2.为文件添加change事件
    $('#fileUp').on('change', function (e) {
        // 注意：在事件对象e上有选择文件的相关信息
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg('未选择文件！')
        }
        // 在e.target.files[0]中存放了选择文件的信息
        // 4.3将文件转换为路径
        var fileUrl = URL.createObjectURL(files[0])
        // 4.4.先将原图片进行销毁，在进行文件属性的指定和上传
        $image
            .cropper('destroy')
            .attr('src', fileUrl)
            .cropper(options)
    })

    // 5.实现发布文章
    // 根据API文档要求，传递的数据应为FormDeta格式
    // 5.1.为文章状态赋值
    var art_state = '已发布'
    // 当点击存为草稿按钮，修改状态值
    $('#resArt').click(function () {
        art_state = '草稿'
    })
    // 5.2.创建FormData对象，以键值对形式传递数据
    // 好处：可以快速获取表单中的值

    // 注意：！！！FormDate()对象在表单提交事件中创建
    $('#formArtInfo').on('submit', function (e) {
        // !!!阻止表单的默认行为
        e.preventDefault()
        var formDate = new FormData('#formArtInfo')
        // 5.3.向formdata对象中追加元素
        formDate.append('art_state', art_state)
        // 5.4.指定封面图片文件
        // toBlob():将数据转化为Blob格式（二进制）存储
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 注意：将转化好的数据进行追加，是在回调函数中进行
                formDate.append('cover_img', blob)
                // 发起请求
                artPublic(formDate)
            })

            // 6.发起发布文章的请求
            function artPublic(data){
                $.ajax({
                    method:'post',
                    url:'/my/article/add',
                    data:data,
                    // 注意！！！：当向服务器发送的为FormData格式数据时，需要添加以下两个参数才可发布成功
                    contentType:false,
                    processData:false,
                    success:function (res) {  
                        if(res.status !== 0){
                            return layer.msg('发布失败')
                        }
                        layer.msg('发布成功！')
                        // 发布文章成功，自动跳转至文章列表页面
                        location.href='../../article/art_list.html'
                    }
                })
            }
    })
})