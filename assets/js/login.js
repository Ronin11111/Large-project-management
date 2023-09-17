// 入口函数
$(function(){
    // 1.登录链接切换
        $('#link_login').click(function () {
            $('.registBox').hide()
            $('.loginBox').show()
          })

    // 2.注册链接切换
          $('#link_regist').click(function () {
            $('.loginBox').hide()
            $('.registBox').show()
          })

    // 3.为表单添加自定义校验规则
    // 使用layui中的对象直接使用
    var form=layui.form
    var layer=layui.layer 
    form.verify({
      // 3.1.使用form.verify添加自定义属性
      // 添加配置对象，以键值对的形式
      // 值可为数组和函数
      // 数组：[正则匹配，匹配失败后的提示]
      psw:[/^[\S]{6,12}$/,'密码必须为6到12位，且不能为空白字符'],
      // 3.2.校验规则是否一致
      repsw:function(value){
        // 形参中的value值即为该input中所填写的值
        // 适用属性选择器，属性值中不需‘’，提取元素
        var psNum=$('#regReady [name=password]').val()
        // 判断是否一致
        if(value !==psNum)
        return '两次密码不一致'

        // 判断成功
        // 4.监听表单注册事件，发起post请求
        $('#regReady').submit(function (e) { 
          e.preventDefault();
          // 3.2.发起post请求
          var data={username:$('#regReady [name=username]').val(),password:$('#regReady [name=password]').val()}
          $.post('/api/reguser',data,function(res){
            //3.3判断post是否成功
            if(res.status!==1) 
            // 3.4.使用layiu的提示层,layer.msg('提示消息')
            {return layer.msg(res.message)}
            // 3.5.成功执行登录操作，调用click函数，实现页面的自动跳转
            layer.msg('注册成功，请登录！')
            $('#link_login').click()
          })
        });
        layer.msg('注册成功，请登录！')
        // 调用click事件，实现页面的自动跳转
        $('.link_login').click()

        // 5.监听表单登录事件
        var formOne
        $('#logReady').submit(function(e){
          e.preventDefault()
          // 5.2.发起ajax请求
          $.ajax({
            url:'/api/login',
            method:'post',
            // 5.3.使用serialize()获取表单中的所有数据
            data:$(this).serialize(),
            success:function (res) {
              if(res.status!==1){
                layer.msg('登录失败！')
              }
              layer.msg('登录成功！')
              // 5.4.登陆成功后，将token存储在本地
              localStorage.setItem('token',res.token)
              // 5.5.跳转到后台页面
              // 使用location对象的href属性
              location.href='../../index.html'
            }
          })
        })
      }
    })

})