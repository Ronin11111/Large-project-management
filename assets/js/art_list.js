
$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1.定义查询对象,根据API文档定义相关参数
    // 查询对象，可以将参数对象传递给服务器
    // 服务器依据参数对象的值，返回相应数据
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
        // 定义的值，即为实现功能时的默认值
    }
    initTable()
    initSelect()

    // 3.定义美化时间的过滤器
    // 定义过滤器：template.dafaults.imports.自定义名=function(形参){}
    // 形参中包含数据
    // 调用：{{value|fifterName}}
    template.defaults.import.dateFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = zero(dt.getMonth() + 1)
        var d = zero(dt.getDate())

        var hh = zero(dt.getHours())
        var mm = zero(dt.getMinutes())
        var ss = zero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 3.2.定义补零的函数
    function zero(dt) {
        return dt > 9 ? dt : '0' + dt
    }

    // 2.定义文章列表的查询方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 获取数据成功，使用模板引擎渲染页面
                var htmlStr = template('tpl-list', res)
                $('tbody').html(htmlStr)

                // 调用分页渲染函数,将数据总值传递
                renderPage(res.total)
            }
        })
    }

    // 4.渲染选择列表中的行数据
    //选择下拉列表中的数据是动态获取的，需要根据ajax请求获取
    function initSelect() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('数据获取失败！')
                }
                // 数据获取成功，使用模板引擎进行渲染
                var htmlStr = template('tpl-options', res)
                $('.cate_id').html(htmlStr)
                // 注意：依据layui的渲染机制，在layui的结构中未监听到option中的其他页面元素
                //      在js的动态添加之后，也不会监听和显示该元素
                // 解决方法:调用form.rendar(),重新进行页面渲染 
                form.render()
            }
        })
    }

    // 5.实现筛选功能
    // 注意：按钮为提交按钮,事件为表单的submit事件
    // 注意：submit事件要阻止表单默认行为
    $('#form-search').on('submit',function (e) {
        e.preventDefault()
        // 5.1.获取选择框的值
        var cate_id = $('.cate_id').val()
        var state = $('state').val()
        //  5.2.将选择框中的值赋给查询对象
        q.cate_id = cate_id
        q.state = state
        // 5.3.调用initTable()，重新渲染列表
        initTable()
    })

    // 6.渲染分页的结构
    // 注意：渲染分页的结构，要在渲染列表结构后，在根据分页信息，再进行分页的渲染
    function renderPage(total){
        // 渲染分页结构，先指定分页容器，再调用laypage.rendar()
        laypage.render({
            elem:'pageBox', //elm指定分页区渲染区域
            count:total, //数据总数
            limit:q.pagesize, //limit每页显示条数
            curr:q.pagenum ,//起始页，设置默认被选中的分页
            layout:['count','limit','prev','page','next'], // 6.3.设置分页栏的分页效果，数组中的参数顺序决定页面效果
            limits:[2,3,5,10], // 6.4.开启limit后，为条目选项区指定条数选项
            jump:function(obj,first){ //jump切换分页的回调函数，当分页被触发时，函数返回参数
                // obj:返回当前分页的信息，first：判断是否首次加载
                // obj.curr可获取当前分页的最新页码值
                // 将页码值赋值给q,并同时调用列表渲染函数
                pageNew.pagenum=obj.curr

                // 6.5.为limits条目选项框实现列表效果
                // 使用obj.limit获取当前选项栏值
                q.pagesize=obj.limit
                // bug:更新了页码值后，渲染页面效果，调用initTable()
                // 需进行判断，触发jump(),有两种方式：①点击分页切换栏；
                //                                 ②调用laypage.render()函数
                // 所以需在①情况下，才可调用，可以使用first参数
                // 当①情况下，first值为true;当②情况下，first值为undifined
                if(!first){
                    initTable()
                }
            }
        })
    }

    // 7.删除文章的功能
    // 动态元素，使用事件委托
    $('tbody').on('click','#del-art',function(){
        // 获取删除按钮的个数
        var numBt=$('#del-art').length
        layer.confirm('确认删除',{icons:3,title:'提示'},function(index){
            var id=$(this).attr('data-id')
            $.ajax({
                method:'get',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除失败！')
                    }
                    // 问题：若删除完成，直接渲染页面，若该页面中不存在内容，保持原来的值，页码值不会更新，且页面无文章条目
                    //7.1.主要原理：渲染操作之前需要对该页面的内容进行判断，
                    //             若页面中存在剩余内容，则页码值不变；若无，则页码值-1，再渲染页面
                    // 解决方法：获取页面中删除按钮的个数，若个数为1，则页面值需要-1
                    if(numBt ===1 ){
                        // 注意：页码值最小为1
                        q.pagenum=q.pagenum===1?1:--q.pagenum
                    }
                    initTable()
                    layer.msg('删除成功！')
                }
            })
            close(index)
        })
    })
})