$(function () {
    var form = layui.form
    var layer = layui.layer

    // 三.表单校验规则
    form.verify({
        // 注意为\S为非空字符
        psw: [/^[\S]{6,12}$/, '请输入6-12位密码，且不包含空字符'],

        // 六.新密码与旧密码不能保持一致
        samepsw:function(values){
            if(values === $('.oldPsw').val())
            return '新密码与原密码相同'
        },

        // 四.原密码与确认密码保持一致
        renpsw: function (valus) {
            if (valus !== $('[name=newPsw]').val()) {
                return '两次密码不相同，请重新输入'
                // 清空密码框
                $('.renpsw').val('')
                $('.newPsw').val('')
            }
        }
        // 注意：在校验规则中可以直接编写需返回显示的提示消息，会自动弹出信息框
    })

    // 一.表单提交模块
    $('.layui-form').submit(function (e) {
        // 1.阻止表单的默认行为
        e.preventDefault()
        // 五.校验原密码是否正确
        $.get('/my/', function (res) {
            if (res.status !== 1) {
                return '获取原密码失败'
            }
            var relPsw = res.date.password
            if (relPsw !== $('.oldPsw').val()) { return layer.msg('密码错误') }

            $.ajax({
                method: post,
                url: '/my/updatepwd',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return '修改密码失败'
                    }
                    layer.msg('修改密码成功！')
                    // 重置表单
                    // reset（）为DOM方法，需将jquery元素转为DOM元素
                    $('layui-form')[0].reset()
                }
            })
        })
    })

    // 二.表单的重置功能
    $('#resetBt').click()
})
