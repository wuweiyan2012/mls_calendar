/**
 * Created by Administrator on 2017/1/10.
 */

$(function(){
    initPage();
    initArea();
    initialCld();
    getMatchs();
});

//初始化页面
function initPage()
{
    //初始化banner
    $(".banner").append('<img src="images/logo.jpg" alt=""/>');
    $(".banner img").load(function(){
        $(".banner").addClass("show");
    });

    //向左滑动，关闭左侧菜单栏
    $(".container").on("swipeLeft", function(){
        hideArea();
    });

    //向右滑动，关闭右侧菜单栏
    $(".container").on("swipeRight", function(){
        hideType();
    });

    //右侧菜单栏，类别选中css效果
    $(".type-list li").on("touchstart", function(){
        $(this).addClass("active");
        var that = this;
        setTimeout(function(){
            $(that).removeClass("active");
        }, 500);
    });

    //月份选择弹出框 click事件响应
    $(".month-wraper .month-area li").each(function(){
        $(this).click(function(){
            hideMonthSel();
            updateMonth( $(".year-area .year").attr("year"), $(this).attr("month"));
        });
    });

    var cDate= new Date();
    var cYear =  cDate.getFullYear();
    var cMonth = (cDate.getMonth() + 1) < 10 ? ("0" + (cDate.getMonth() + 1)) : (cDate.getMonth() + 1);
    $(".month-select .month").text( cYear+ "/" + cMonth);
}

//清楚类别查询条件
function clearType()
{
    $(".menu .items .item-type").addClass("hidden");
    $(".menu .items .item-type b").text("");
    (".menu .items .item-type b").attr("tid", "");
    $(".menu .items .item-type b").attr("type", "");
}

//[右侧菜单栏] 改变类型查询条件
function changeType(el, value, type)
{
    $(".menu .items .item-type").removeClass("hidden");
    $(".menu .items .item-type b").text($(el).find(".type-name").text());
    $(".menu .items .item-type b").attr("tid", value);
    $(".menu .items .item-type b").attr("type", type);
    hideType();
    getMatchs();
}

//清楚地区查询条件
function clearArea()
{
    $(".menu .items .item-area").addClass("hidden");
    $(".menu .items .item-area b").text("");
    $(".menu .items .item-area b").attr("pid", "");
}

//[右侧菜单栏] 改变地区查询条件
function changeArea(el)
{
    $(".menu .items .item-area").removeClass("hidden");
    $(".menu .items .item-area b").text($(el).text());
    $(".menu .items .item-area b").attr("pid", $(el).attr("id"));
    hideArea();
    getMatchs();
}

//初始化地区
function initArea()
{
    $.each(_AREA_LIST, function(){
        var $li = $("<li/>");
        $li.append('<div class="area-type">' + this.type + '</div>');
        var $areas = $('<div class="areas"/>');
        $.each(this.areas, function(){
            $areas.append('<span pid="'+ this.id + '" onclick="changeArea(this)">' + this.name + '</span>');
        });
        $li.append($areas);
        $(".area-list").append($li);
    });

    //地区选中css效果
    $(".area-list .areas span").on("touchstart", function(){
        $(this).addClass("active");
        var that = this;
        setTimeout(function(){
            $(that).removeClass("active");
        }, 500);
    });
}

//地区按钮点击
function selectArea()
{
    if($(".container").hasClass("left")){
        hideArea()
    } else{
        showArea();
    }
}

//展开左侧菜单栏
function showArea()
{
    $(".container").addClass("left");
    $(".page-shadow").addClass("show");
}

//关闭左侧菜单栏
function hideArea()
{
    $(".container").removeClass("left");
    $(".page-shadow").removeClass("show");
}

//类型按钮点击
function selectType()
{
    if($(".container").hasClass("right")){
        hideType();
    } else{
        showType();
    }
}

//展开右侧菜单栏
function showType()
{
    $(".container").addClass("right");
    $(".page-shadow").addClass("show");
}

//关闭右侧菜单栏
function hideType()
{
    $(".container").removeClass("right");
    $(".page-shadow").removeClass("show");
}

//显示详情弹出框
function showModal(info)
{

    $(".modal-bg").removeClass("hidden");
    $(".modal .modal-content .addr").text("地点：" + (undefined == info.f_province ? "" : info.f_province)  + " " + (undefined == info.f_address ? "" : info.f_address));
    $(".modal .modal-content .date").text("时间：" + (undefined == info.f_hold_date ? "" : info.f_hold_date));
    $(".modal .modal-content .event").text("项目：" + (undefined == info.f_project ? "" : info.f_project));
    $(".modal .modal-content .num").text("名额：" + (undefined == info.f_sum_scale ? "" : info.f_sum_scale));
    $(".modal .modal-content .website").html("官网：" + (undefined == info.f_weburl ? "" : "<a class='website' href='" + info.f_weburl +"'>"+ info.f_weburl +"</a>"));
    $(".modal .modal-body .name").text((undefined == info.f_name ? "" : info.f_name));
}

//隐藏详情弹出框
function hideModal()
{
    $(".modal .modal-content .addr").text("");
    $(".modal .modal-content .date").text("");
    $(".modal .modal-content .event").text("");
    $(".modal .modal-content .num").text("");
    $(".modal .modal-content .website").html("");
    $(".modal .modal-content .name").text("");
    $(".modal-bg").addClass("hidden");
}

//切换月份选择框
function selectMonth()
{
    if($(".month-wraper").hasClass("hidden"))
    {
        showMonthSel();
    }
    else
    {
        hideMonthSel();
    }
}

//显示月份选择框
function showMonthSel()
{
    if($(".month-wraper .year-area .year").text() == ""){
        $(".month-wraper .year-area .year").text( (new Date()).getFullYear() + "年");
        $(".month-wraper .year-area .year").attr("year", (new Date()).getFullYear());
        $(".month-wraper .year-area .year-prev").addClass("disabled");
    }

    $(".month-wraper").removeClass("hidden");
    $(".page-shadow").addClass("show");
}

//隐藏月份选择框
function hideMonthSel()
{
    $(".month-wraper").addClass("hidden");
    $(".page-shadow").removeClass("show");
}

//切换下一个月份
function nextMonth()
{
    if($(".month-select .month-next").hasClass("disabled")) return;

    var currentDate = new Date();
    var selectedYM = $(".month-select .month").text().split("/");
    var minYM = [ currentDate.getFullYear() ,1 ];
    var maxYM = [ currentDate.getFullYear() + 1 ,12 ];
    var nextYM = [];

    //转换成数字
    selectedYM = [ parseInt(selectedYM[0]), parseInt(selectedYM[1])];

    if(selectedYM[1] == 12)
    {
        nextYM = [ selectedYM[0] + 1, 1 ];
    }else{
        nextYM = [ selectedYM[0], selectedYM[1] + 1 ];
    }

    updateMonth(nextYM[0], nextYM[1]);
}

//切换上一个月
function prevMonth()
{
    if($(".month-select .month-prev").hasClass("disabled")) return;

    var currentDate = new Date();
    var selectedYM = $(".month-select .month").text().split("/");
    var minYM = [ currentDate.getFullYear() ,1 ];
    var maxYM = [ currentDate.getFullYear() + 1 ,12 ];
    var prevYM = [];

    selectedYM = [ parseInt(selectedYM[0]), parseInt(selectedYM[1])];

    if(selectedYM[1] == 1) {
        prevYM = [ selectedYM[0] - 1, 12 ];
    }else{
        prevYM = [ selectedYM[0], selectedYM[1] - 1 ];
    }

    updateMonth(prevYM[0], prevYM[1]);
}

//更新月份
function updateMonth(destYear, destMonth)
{
    var currentDate = new Date();
    var minYM = [ currentDate.getFullYear() ,1 ];
    var maxYM = [ currentDate.getFullYear() + 1 ,12 ];

    destYear = parseInt(destYear);
    destMonth = parseInt(destMonth);

    if(destYear == minYM[0] && destMonth == minYM[1]) {
        $(".month-select .month-prev").addClass("disabled");
    }else {
        $(".month-select .month-prev").removeClass("disabled");
    }

    if(destYear == maxYM[0] && destMonth == maxYM[1])
    {
        $(".month-select .month-next").addClass("disabled");
    }else {
        $(".month-select .month-next").removeClass("disabled");
    }

    if(destMonth < 10) {
        destMonth = "0" + destMonth;
    }

    $(".month-select .month").text(destYear + "/" + destMonth);

    drawCld(destYear,destMonth - 1);
    getMatchs(destYear ,destMonth);
}

//请求单个月份的所有赛事
function getMatchs(year, month)
{
    var param = {
        province: $(".menu .items .item-area").attr("pid"),
        certify_flag: $(".menu .items .item-type").attr("type") == "ab" ? $(".menu .items .item-type").attr("tid") : "",
        certifie_type: $(".menu .items .item-type").attr("type") == "caa" ? $(".menu .items .item-type").attr("tid") : "",
        year: (undefined != year ? year : $(".month-select .month").text().split("/")[0]) ,
        month: (undefined != month ? month : $(".month-select .month").text().split("/")[1])
    };
    $.ajax({
        type : "POST",
        url : "demo/ajax_match.txt",
        data : param,
        dataType : "json",
        timeout: 10000,
        success:function(rs){
            if(rs.matchs == undefined) return;
            clearMatchCld();
            dispMatchCld(rs.matchs);
            dispMatchList(rs.matchs);
        },
        error :	function(req, status){
            switch (status){
                case 408:
                    alert("连接超时");
                    break;

                default:
                    alert("请求失败");
                    break;
            }
        }
    });
}

//切换上一个年份
function prevYear()
{
    if($(".year-area .year-prev").hasClass("disabled")) return;

    var minYear = (new Date()).getFullYear();
    var maxYear = (new Date()).getFullYear() + 1;
    var selectYear = parseInt($(".year-area .year").attr("year"));
    var prevYear = selectYear - 1;

    if( prevYear == minYear )
    {
        $(".year-area .year-prev").addClass("disabled");
    }

    if( prevYear != maxYear )
    {
        $(".year-area .year-next").removeClass("disabled");
    }

    $(".year-area .year").attr("year", prevYear);
    $(".year-area .year").text( prevYear + "年");
}

//切换下一个年份
function nextYear()
{
    if($(".year-area .year-next").hasClass("disabled")) return;

    var minYear = (new Date()).getFullYear();
    var maxYear = (new Date()).getFullYear() + 1;
    var selectYear = parseInt($(".year-area .year").attr("year"));
    var nextYear = selectYear + 1;

    if( nextYear == maxYear )
    {
        $(".year-area .year-next").addClass("disabled");
    }

    if( nextYear != minYear )
    {
        $(".year-area .year-prev").removeClass("disabled");
    }

    $(".year-area .year").attr("year", nextYear);
    $(".year-area .year").text( nextYear + "年");
}

//显示当前月份赛事信息 到赛事日历中
function dispMatchCld(matchs)
{
    for ( var key in matchs) {
        if (parseInt(key) != undefined && matchs[key] != ""){
            $("#cldr-panel").find("[daynum='"+ parseInt(key)+"']").addClass("will");
            $("#cldr-panel").find("[daynum='"+ parseInt(key)+"']").on("tap", function(){
                //如果已经打开
                if($(this).hasClass("open")){
                    hideMatchItems($(this));
                }else {
                    //清除其他打开的赛事列表
                    $(this).closest(".cldr-panel").find(".sub-list").removeClass("show");
                    $(this).closest(".cldr-panel").find(".day").removeClass("open");

                    //显示当前的赛事列表
                    var index = parseInt($(this).text()) < 10 ? "0" + parseInt($(this).text()) : parseInt($(this).text());
                    showMatchItems($(this), matchs[index]);
                }
            });
        } else{
            //TODO
        }
    }
}

function clearMatchCld()
{
    $(".cldr-panel").find(".sub-list").removeClass("show");
    $(".cldr-panel").find(".day").removeClass("will");
    $(".cldr-panel").find(".day").removeClass("open");
}

function hideMatchItems(destEl)
{
    destEl.closest("ul").next(".sub-list").removeClass("show");
    destEl.removeClass("open");
}

function showMatchItems(destEl, matchItems)
{
    if(destEl.closest("ul").next(".sub-list").size() == 0){
        var $ul = $("<ul class='sub-list'/>");
        $ul.insertAfter(destEl.closest("ul"));
    }else{
        var $ul = destEl.closest("ul").next(".sub-list");
        $ul.children().remove();
    }
    $.each(matchItems, function(){
        var $li = $("<li class='clearfix'/>");
        var mInfo = this;
        $li.append("<span class='name text-omit'>"+ this.f_name + "</span>");
        $li.append("<span class='link'></span>");
        $li.on("tap", function(){
            showModal(mInfo);
        });
        $ul.append($li);
    });

    $ul.addClass("show");
    destEl.addClass("open");
}

//显示当前月份赛事信息 到赛事列表中
function dispMatchList(matchs)
{

}