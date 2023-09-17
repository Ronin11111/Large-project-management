// 调用ajaxPrefilter()函数
// 该函数在每次$.post(),$.get(),$.ajax()函数之前，jquery都会自动提前调用该函数
// 在该函数之前，我们可以获取ajax的配置对象
$.ajaxPrefilter(function(options){
    // 在该函数中，我们可以实现路径的拼接
    options.url='http://ajax.frontend.itheima.net'+options.url 
})