$(function () {
    var layer = layui.layer
    // 1.1.获取图片
    var $image = $('#image')
    // 1.2.配置项
    const options = {
        // 纵横比,即剪裁框的大小
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域,调用cropper()
    $image.cropper(options)

    //   二.实现选择文件的功能
    $('#fileBt').click(function () {
        // 原理：隐藏文件选择input,点击按钮的同时调用input的点击事件
        $('#file').click()
    }
    )

    // 三.实现文件选择后上传的功能
    // 原理：为input事件绑定change事件
    $('#file').on('change', function (e) {
        // 在事件对象e中，有e.target.files属性，其中包含了文件所选择文件的信息
        // 选择文件在数组[0]中
        var files = e.target.files
        // 3.1.判断是否选择文件，未选择文件，数组为空
        if (files.length === 0) {
            return layer.msg('未选择文件')
        }
        // 3.2.选择文件，将文件转换为路径
        // 语法：url.createObjectURL()
        var fileURL = files[0]
        var fileImg = URL.createObjectURL(fileURL)
        // 3.3.更改图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', fileImg)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 四.上传头像功能
    fileUp.click(function () {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 4.1.发起ajax请求，将图片信息上传给API
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                // 根据参数内容，传递数据
                avatar:dataURL
            },
            success: function (res) {
                if (res !== 0) {
                    return layer.msg('头像上传失败！')
                }
                layer.msg('头像上传成功！')
                // 4.2.调用window.parent()，获取信息渲染页面中的图片
                window.parent.getUser()
            }
        })

    })
})