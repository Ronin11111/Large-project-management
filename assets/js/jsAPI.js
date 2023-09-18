// 调用ajaxPrefilter()函数
// 该函数在每次$.post(),$.get(),$.ajax()函数之前，jquery都会自动提前调用该函数
// 在该函数之前，我们可以获取ajax的配置对象
$.ajaxPrefilter(function(options){
    // 1.在该函数中，我们可以实现路径的拼接
    options.url='http://ajax.frontend.itheima.net'+options.url 
   
    // 2.将header中的token在该函数中添加
    // 请求接口为有权限时，统一添加
    // 使用indexOf()进行判断，无则返回-1
    if(options.url.indexOf('/my/') !== -1){
        options.headers={
            Authorization:localStorage.getItem('token')||''       
        }
    }

    // 3.ajax请求失败，强制退回登录页面
        // 统一在API请求接口中，挂载挂载comple（）
        // 注意：在ajax请求中，①成功会调用success()函数；②失败则调用error()函数；③无论成功或者失败，都会执行complete()
        options.complete=function (res){
            // 4.1.判断请求是否成功
            // 在res.responseJSON属性中包含相应回来的数据对象
            if(res.responseJSON.status === 1 && res.responseJSON.message==='身份认证失败'){
                // 4.2.强制清空token（伪造token）
                localStorage.removeItem('token')
                // 4.3.强制切回登录压面
                location.href='../../login.html'
            }
        }
})