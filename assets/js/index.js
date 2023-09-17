$(function () {
    var layer=layui.layer
    getUser()

    // 三.实现页面的退出功能
    // 为退出链接绑定点击事件
    $('#btnLogout').click(function () {
        // 3.1.弹出询问框
        layer.confrim('确定退出登录？',{icon:3,title:'提示'},function(index){
            // 3.2.将本地token清除
            localStorage.removeItem('token')
            // 3.3.退出页面，跳转至登录页面
            location.href='../../login.html'
            // 3.4.关闭弹出框
            layer.close(index)
        })
      })
  })

// 一.使用ajax访问用户信息，单独进行函数的封装
function getUser(){
    $.ajax({
        url:'/my/userinfo',
        method:'get',
        // 添加headers请求头配置对象
        // 在该对象中携带authorization属性，携带token进行用户认证
        success:function(res){
            // console.log(res);
            if(res.status !== 1){
                return layer.msg('获取用户信息失败！')
            }
            renderAvatar(res)
        }
    })
}

// 二.渲染用户信息模块
function renderAvatar(user){
    // 2.1.获取用户名
    // 在API接口中有两个属性，优先取值为nickname
    var usrname=user.nickname||user.nickname
    // 2.2将用户名渲染在页面中
    // 注意：html（）为方法，不是属性
    $('#welcome').html(`欢迎&nbsp&nbsp${usrname}`)
    // 2.3.获取用户头像
    // 判断是否有用户头像
    // 有则显示用户头像图片
    if(user.user_pic  !== null){
        // 操作对象属性，并显示
        $('.layui-nav-img').attr('src',user.user_pic).show()
        // 隐藏文字头像
        $('.text-avatar').hide()
    }
    else{
        // 显示文字头像，并转成大写
        $('.text-avatar').html(usrname[0].toUpperCase()).show()
        // 隐藏图片
        $('.layui-nav-img').hide()
    }
}