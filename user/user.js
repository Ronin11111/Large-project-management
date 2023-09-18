// 注意：尽量将函数都写在立即执行函数体内
$(function () {
    // 定义导入form(表单),layer(提示框)
    var form = layui.form
    var layer = layui.layer

    // 一.表单规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    getUser()

    // 二.获取用户的基本信息
    function getUser() {
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            success: function (res) {
                if (res.status === 1) {
                    // 用户请求失败
                    return layer.msg('用户请求失败')
                }
                // 用户请求成功,将值渲染在页面中
                // console.log(res);
                // 使用layui中的form.val('filter',object)为表单赋值
                // 注意：使用该属性时，需要为表单添加lay-filter属性值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 三.为表单绑定重置事件
    $('#resetBt').click(function (e) {
        e.preventDefault()
        // 阻止表单的重置默认行为，并调用getUser()函数
        getUser()
    })

    // 四.发起请求更新用户页面
    $('.layui-form').submit(function(e){
        // 阻止表单对默认行为
        e.preventDefault()
        // 发起ajax行为
        $.ajax({
            url:'/my/userinfo',
            method:'post',
            date:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('用户信息更新失败！')
                }
                layer.mag('用户信息更新成功！')
                // ！！！用户信息更成功后，需要重新渲染用户信息
                // 在iframe中，相当于index.html的子页面
                // 在子页面中调用父页面中的方法
                window.parent.getUser()
            }
        })
    })
})

