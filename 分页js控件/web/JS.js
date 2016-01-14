/*
参数说明
使用前创建DataTableObj()对象
调用初始化函数SelectDataTable("属性参数的json字符",
"删除后所回调的函数（state）返回删除的状态true成功false失败"  有此函数则显示删除按钮没有则影藏
,"修改按钮的回调函数（key）返回绑定的key") 有此函数则显示修改按钮没有则影藏
,"全选多选触发事件（keyList）如果全选则返回选中的key列表" 有此函数则显示多选按钮没有则影藏
,"每一项数据的多选按钮触发的事件(checkobj)返回点中的check标签"
*/



//创建类
function DataTableObj() {
    this.PosrUrlTxt = "";
    this.GetDataTableByWhere = "";
    this.DataTableDivId = "";
    this.PageIndexToDeleteStateIsYes = 0;
    var DataPageCount = 0;
    this.PageShowButCount = 7;
    //定义的属性
    this.DeleteButName = "删除";
    this.UpdateButName = "修改";
    this.CheckIsTrueTxt = "反选";
    this.CheckIsFalseTxt = "全选";
    this.CheckItemTxt = "";
    this.DeleteOrUpdateTitle = "操作";
    this.LoginDivClassName = "";
    this.LoginDivTxt = "正在请求..."; //提示行文字
    this.DeleteShowTxt = "你确定要删除该项数据吗？";
    this.PageIndexTool = false;
    //定义的函数
    this.UpdateButClick;
    this.DeleteItemState;
    this.PostStart;
    this.PostStop;
    this.CheckAllChange;
    this.CheckItemChange;
    //回调
    this.Callback;
    var PostRequest = function (PostUrl, FormString) {
        //开始请求
        PostStart();
        var xmlHttp;
        if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        xmlHttp.open("Post", PostUrl, true);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                PostStop();
                //返回值的判断
                var JsonModelDataTable = eval("(" + xmlHttp.responseText + ")");
                //取得返回值的属性
                if (JsonModelDataTable != null && JsonModelDataTable.State != undefined && JsonModelDataTable.State != null && JsonModelDataTable.State == "404") {
                    CZShowTxtDiv("请求失败！");
                    //执行回调函数(请求失败！)
                    if (Callback != undefined && Callback != null) {
                        Callback("1", false, JsonModelDataTable.Mag);
                    }
                    return;
                } else if (JsonModelDataTable != null && JsonModelDataTable.State != undefined && JsonModelDataTable.State != null && JsonModelDataTable.State == "211") {
                    //执行回调函数(删除成功！)
                    if (Callback != undefined && Callback != null) {
                        Callback("2", true, JsonModelDataTable.Mag);
                    }
                    //删除成功刷新
                    if (DeleteItemState != null) {
                        DeleteItemState(true);
                    }
                    ///CZShowTxtDiv("正在刷新...");
                    //判断数据有多少条
                    if (document.getElementById(DataTableDivId).getElementsByTagName("tr").length == 1) {
                        //表示没有数据了
                        if ((parseInt(PageIndexToDeleteStateIsYes) - 1) > -1) {
                            //刷新函数比较特殊
                            PostRequest(PosrUrlTxt, GetPostParametersToRefresh(parseInt(PageIndexToDeleteStateIsYes) - 1, GetDataTableByWhere));
                        }
                    } else {
                        //刷新数据
                        PostRequest(PosrUrlTxt, GetPostParametersToRefresh(PageIndexToDeleteStateIsYes, GetDataTableByWhere));
                    }
                    return;
                } else if (JsonModelDataTable != null && JsonModelDataTable.State != undefined && JsonModelDataTable.State != null && JsonModelDataTable.State == "112") {
                    //执行回调函数(删除失败！)
                    if (Callback != undefined && Callback != null) {
                        Callback("2", false, JsonModelDataTable.Mag);
                    }
                    //删除失败！
                    if (DeleteItemState != null) {
                        DeleteItemState(false);
                    }
                    ShowTxtDiv(LoginDivTxt);
                    //刷新数据
                    PostRequest(PosrUrlTxt, GetPostParametersToRefresh(PageIndexToDeleteStateIsYes, GetDataTableByWhere));
                    return;
                } else if (JsonModelDataTable != null && JsonModelDataTable.State != undefined && JsonModelDataTable.State != null && JsonModelDataTable.State == "222") {
                    //读取数据成功！

                    //总页数
                    var dataCount = JsonModelDataTable.dataCount;
                    //每页显示的条数
                    var PageSize = JsonModelDataTable.PageSize;
                    //当前页的索引
                    var PageIndex = JsonModelDataTable.PageIndex;
                    PageIndexToDeleteStateIsYes = PageIndex;
                    //获取删除的key方式
                    var WhereKey = JsonModelDataTable.WhereKey;
                    //列头键的集合
                    var TableTitle = new Array();
                    //存放列的显示状态
                    var ShowHidList = new Array();
                    //表数据集合
                    var DataTableObj = new Array();
                    //创建第一行存放表头
                    DataTableObj[0] = new Array();
                    for (var item in JsonModelDataTable) {
                        if (typeof JsonModelDataTable[item] === 'string') {
                            //返回值的属性包含数据有多少
                            //alert("键" + item + "的值=" + JsonModelDataTable[item]);
                        } else if (typeof JsonModelDataTable[item] === 'object') {
                            var DataList = JsonModelDataTable[item];
                            if (item == "title") {
                                //将唯一键放到0列
                                TableTitle[0] = WhereKey;
                                //创建表头
                                var TitleKeyIndex = 1;
                                for (var TitleObj in DataList) {
                                    if (typeof DataList[TitleObj] === 'string') {
                                        //将列头所绑定的值放到数组，方便取数据
                                        TableTitle[TitleKeyIndex] = DataList[TitleObj];
                                        //初始化整个表结构（列）
                                        DataTableObj[0][TitleKeyIndex] = TitleObj;
                                        TitleKeyIndex = TitleKeyIndex + 1;
                                    }
                                }
                            } else if (item == "ShowState") {
                                //存放显示状态的数组
                                ShowHidList = DataList;
                            } else if (item == "data") {
                                for (var i = 0; i < DataList.length; i++) {
                                    var ItemData = DataList[i];
                                    //创建行i为行的索引索引从1开始因为0为表头
                                    DataTableObj[i + 1] = new Array();
                                    for (var ItemDataObj in ItemData) {
                                        //列
                                        if (typeof ItemData[ItemDataObj] === 'string') {
                                            if (TableTitle[0] != null) {
                                                if (ItemDataObj == TableTitle[0]) {
                                                    DataTableObj[i + 1][0] = ItemData[ItemDataObj];
                                                }
                                            }
                                            for (var t = 1; t < TableTitle.length; t++) {
                                                if (ItemDataObj == TableTitle[t]) {
                                                    //alert(ItemData[ItemDataObj] + " ==" + TableTitle[t]);
                                                    //向表中添加数据[行][列]
                                                    DataTableObj[i + 1][t] = ItemData[ItemDataObj];
                                                }
                                            }
                                        }
                                    }
                                }

                                //创建表结构
                                CreateTableHtml(DataTableObj, WhereKey, ShowHidList);
                                //创建分页菜单
                                CreateTablePageHtml(PageSize, dataCount, PageIndex);
                            }
                        }
                    }
                    //执行回调函数(读取成功！)
                    if (Callback != undefined && Callback != null) {
                        Callback("1", true, JsonModelDataTable.Mag);
                    }
                } else {
                    //判断的结尾
                }
            }
        };
        xmlHttp.send(FormString);
    }
    //创建表结构  取值为[行][列]     该项数据的唯一标识
    var CreateTableHtml = function (DataList, key, ShowHidList) {
        var TableHtml = "<table class='TablePagingBody' border='0' cellspacing='0' cellpadding='0'>";
        for (var y = 0; y < DataList.length; y++) {
            //行开始创建
            if (y == 1) {
                TableHtml += "<tbody><tr class='TablePagingTR TR_" + y + "'>";

            } else if (y == 0) {
                TableHtml += "<thead><tr class='TablePagingTR TR_" + y + "'>";
            } else {
                TableHtml += "<tr class='TablePagingTR TR_" + y + "'>";
            }
            var Key;
            for (var x = 1; x < DataList[y].length; x++) {
                //取得Key的实际值
                Key = DataList[y][0];
                //列
                //开始创建列
                if (y == 0) {
                    if (CheckAllChange != null && x == 1) {
                        TableHtml += "<th class='TablePagingCheck' ><input onchange='new DataTableObj().CheckAllChangeObjToDataTable(this)' type=\"checkbox\" /><span>" + CheckIsFalseTxt + "</span></th><th class='TablePagingTH TH_" + x + "'>" + DataList[y][x] + "</th>";
                    } else {
                        //alert(x+"|"+ShowHidList[x-1]);
                        //列头
                        if (ShowHidList[x - 1] == "Show") {
                            TableHtml += "<th class='TablePagingTH TH_" + x + "'>" + DataList[y][x] + "</th>";
                        } else {
                            TableHtml += "<th class='TablePagingTH TH_" + x + "' style='display:none;'>" + DataList[y][x] + "</th>";
                        }
                    }
                } else {
                    if (CheckAllChange != null && x == 1) {
                        if (CheckItemChange != null) {
                            TableHtml += "<td class='TablePagingCheck'><input name='DataTableItemCheck' value='" + Key + "' onchange=\"new DataTableObj().CheckItemChangeObjToDataTable(this)\" type=\"checkbox\" />" + CheckItemTxt + "</td><td class='TablePagingTD TD_" + x + "'>" + DataList[y][x] + "</td>";
                        } else {
                            TableHtml += "<td class='TablePagingCheck'><input name='DataTableItemCheck' value='" + Key + "' type=\"checkbox\" /></td><td class='TablePagingTD TD_" + x + "'>" + DataList[y][x] + "</td>";
                        }
                    } else {
                        if (ShowHidList[x - 1] == "Show") {
                            TableHtml += "<td class='TablePagingTD TD_" + x + "'>" + DataList[y][x] + "</td>";
                        } else {
                            TableHtml += "<td class='TablePagingTD TD_" + x + "' style='display:none;'>" + DataList[y][x] + "</td>";
                        }
                    }
                }
                //结束创建
            }
            if (y != 0) {

                //从数据开始获取key
                //取得Key的实际值
                Key = DataList[y][0];
                if (DeleteItemState != null || UpdateButClick != null) {
                    TableHtml += "<td class='TablePagingTD Tool' id='DataTablePage_User_LanSQ_" + Key + "' >";
                    if (DeleteItemState != null) {
                        TableHtml += "<a class='TablePagingTD Tool Delete' href=\"javascript:new DataTableObj().DataTableDeleteByKey('" + Key + "')\">" + DeleteButName + "</a>";
                    }
                    if (UpdateButClick != null) {
                        TableHtml += "<a class='TablePagingTD Tool Update' href=\"javascript:UpdateButClick('" + Key + "',ChuLiTrObjArrtDataTablePage('DataTablePage_User_LanSQ_" + Key + "'))\">" + UpdateButName + "</a>";
                    }
                    TableHtml += "</td>";
                }
            } else {
                //创建删除列头或修改列头
                if (DeleteItemState != null || UpdateButClick != null) {
                    TableHtml += "<th class='TablePagingTH Tool'>" + DeleteOrUpdateTitle + "</th>";
                }
            }
            //行开始创建结束

            if (y == 0) {
                TableHtml += "</tr></thead>";
            } else {
                TableHtml += "</tr>";
            }
        }

        TableHtml += "</tbody></table>";
        document.getElementById(DataTableDivId).innerHTML = TableHtml;
    }
    //创建分页菜单
    var CreateTablePageHtml = function (PageSize, dataCount, PageIndex) {
        //显示分页按钮的个数
        var PageIndexButCount = PageShowButCount;
        //总页数
        var PageCount = 0;
        if ((dataCount % PageSize) == 0) {
            PageCount = parseInt(dataCount / PageSize);
        } else {
            PageCount = parseInt(dataCount / PageSize) + 1;
        }
        //存储全局变量总页数
        DataPageCount = PageCount;
        var ShowManagerTxt = PageCount;
        if (PageCount == 0) {
            ShowManagerTxt = "无数据";
        }
        var PageTxtHtml = "<div class='TablePagingPageDiv ShowManager'><span class='TablePagingPageDiv  PageTxt'>当前：" + (parseInt(PageIndex) + 1) + "/" + ShowManagerTxt + "</span>";
        var UpIndex = "<a class='TablePagingPageDiv Tool PageHome' href='javascript:new DataTableObj().PageIndexBut(0,0," + PageCount + ")' >首页</a>";
        var DowIndex = "<a class='TablePagingPageDiv Tool PageEnd' href='javascript:new DataTableObj().PageIndexBut(" + (parseInt(PageCount) - 1) + ",0," + PageCount + ")' >尾页</a>";
        var NextPageIndex = "<label class='PageJumpTxt'>跳转<select class='PageJump' onchange=\"new DataTableObj().PageIndexBut(this.value,0," + PageCount + ")\">";
        //判断是否开启
        if (!PageIndexTool) {
            UpIndex = "";
            DowIndex = "";
        }
        var PageButHtml = "<div class='TablePagingPageDiv ToolDiv'>" + UpIndex + "<a class='TablePagingPageDiv Tool Up' href='javascript:new DataTableObj().PageIndexBut(" + parseInt(PageIndex) + ",1," + PageCount + ")' >上一页</a>";
        var CountPageBut = 0;
        for (var i = 0; i < PageCount; i++) {
            //跳转页
            if (parseInt(PageIndex) == i) {
                NextPageIndex += "<option selected='selected' value=\"" + i + "\">" + (i + 1) + "</option>";
            } else {
                NextPageIndex += "<option value=\"" + i + "\">" + (i + 1) + "</option>";
            }
        }
        for (var i = 0; i < PageCount; i++) {
            //分页缩进算法页数小于7
            if (PageCount <= PageIndexButCount) {
                if (parseInt(PageIndex) == i) {
                    PageButHtml += " <em class='TablePagingPageDiv ToolTxt'>" + (i + 1) + "</em>";
                } else {
                    PageButHtml += " <a class='TablePagingPageDiv Tool ToolButton' href='javascript:new DataTableObj().PageIndexBut(" + i + ",0," + PageCount + ")' >" + (i + 1) + "</a>";
                }
            } else {
                //当页数大于7
                //if (i < PageIndexButCount) {
                var it = parseInt(parseInt(PageIndex) / PageIndexButCount);
                if (parseInt(PageIndex) > parseInt(PageIndexButCount / 2)) {
                    //当选择的页数超过一半的时候
                    if (i >= parseInt(PageIndex - (parseInt(PageIndexButCount / 2))) && (PageCount - parseInt(PageIndex)) > parseInt(PageIndexButCount / 2)) {
                        if (CountPageBut < PageIndexButCount) {
                            CountPageBut++;
                            if (parseInt(PageIndex) == i) {
                                PageButHtml += " <em class='TablePagingPageDiv ToolTxt'>" + (i + 1) + "</em>";
                            } else {
                                PageButHtml += " <a class='TablePagingPageDiv Tool ToolButton' href='javascript:new DataTableObj().PageIndexBut(" + i + ",0," + PageCount + ")' >" + (i + 1) + "</a>";
                            }
                        }
                    } else {
                        //如果是到最后一组
                        if ((PageCount - i) < PageIndexButCount) {
                            for (var i = (PageCount - PageIndexButCount) ; i < PageCount; i++) {
                                if (parseInt(PageIndex) == i) {
                                    PageButHtml += " <em class='TablePagingPageDiv ToolTxt'>" + (i + 1) + "</em>";
                                } else {
                                    PageButHtml += " <a class='TablePagingPageDiv Tool ToolButton' href='javascript:new DataTableObj().PageIndexBut(" + i + ",0," + PageCount + ")'  >" + (i + 1) + "</a>";
                                }
                            }
                        } else {
                            if (i >= (parseInt(PageIndex - (parseInt(PageIndexButCount / 2))))) {
                                if (CountPageBut < PageIndexButCount) {
                                    CountPageBut++;
                                    if (parseInt(PageIndex) == i) {
                                        PageButHtml += " <em class='TablePagingPageDiv ToolTxt'>" + (i + 1) + "</em>";
                                    } else {
                                        PageButHtml += " <a class='TablePagingPageDiv Tool ToolButton' href='javascript:new DataTableObj().PageIndexBut(" + i + ",0," + PageCount + ")' >" + (i + 1) + "</a>";
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (CountPageBut < PageIndexButCount) {
                        CountPageBut++;
                        if (parseInt(PageIndex) == i) {
                            PageButHtml += " <em class='TablePagingPageDiv ToolTxt'>" + (i + 1) + "</em>";
                        } else {
                            PageButHtml += " <a class='TablePagingPageDiv Tool ToolButton' href='javascript:new DataTableObj().PageIndexBut(" + i + ",0," + PageCount + ")' >" + (i + 1) + "</a>";
                        }
                    }
                }
                //}
            }
        }
        //跳转页结束
        NextPageIndex += "</select>页</label>";
        //判断是否开启
        if (!PageIndexTool) {
            NextPageIndex = "";
        }
        PageButHtml += "<a class='TablePagingPageDiv Tool Dow'  href='javascript:new DataTableObj().PageIndexBut(" + parseInt(PageIndex) + ",2," + PageCount + ")' >下一页</a>" + DowIndex + "" + NextPageIndex + "</div>";
        PageTxtHtml += PageButHtml + "";
        //alert(DataTableDivId);
        document.getElementById(DataTableDivId).innerHTML += PageTxtHtml;
    }
    this.PageIndexBut = function (PageIndex, PageIndexType, PageCount) {
        var index = 0;
        if (PageIndexType == 0) {
            index = parseInt(PageIndex);
        } else if (PageIndexType == 1) {
            //上一页
            if ((PageIndex - 1) >= 0) {
                index = (parseInt(PageIndex) - 1);
            } else {
                index = parseInt(PageIndex);
            }
        } else if (PageIndexType == 2) {
            //下一页
            if ((parseInt(PageIndex) + 1) < PageCount) {
                index = (parseInt(PageIndex) + 1);
            } else {
                index = parseInt(PageIndex);
            }
        }
        //保存当前也的索引
        PageIndexToDeleteStateIsYes = index;
        PostRequest(PosrUrlTxt, GetPostParametersToGetData(index, GetDataTableByWhere));
    }
    //查询参数生成
    var GetPostParametersToGetData = function (PageIndex, WhereTxt) {
        return "{\"PageIndex\":" + PageIndex + ",\"WhereTxt\":\"" + WhereTxt + "\",\"WhereKey\":\"\",\"PostTypeFun\":1}"; //读取数据
    }
    //删除参数生成
    var GetPostParametersToDeleteItem = function (WhereKey) {
        return "{\"PageIndex\":0,\"WhereTxt\":\"\",\"WhereKey\":\"" + WhereKey + "\",\"PostTypeFun\":0}"; //删除
    }
    //刷新当前页参数生成
    var GetPostParametersToRefresh = function (PageIndex, WhereTxt) {
        return "{\"PageIndex\":" + PageIndex + ",\"WhereTxt\":\"" + WhereTxt + "\",\"WhereKey\":\"\",\"PostTypeFun\":2}"; //刷新当前页
    }
    //删除函数
    this.DataTableDeleteByKey = function (Key) {
        if (Key == undefined) {
            alert("抱歉你没有绑定该项数据的唯一键，系统没有条件进行删除");
            return;
        }
        if (confirm(DeleteShowTxt)) {
            PostRequest(PosrUrlTxt, GetPostParametersToDeleteItem(Key));
        }
    }
    //键盘事件
    document.onkeyup = function () {
        var keycode = event.which || event.keyCode;
        if (keycode == 37) {
            //上一页
            new DataTableObj().PageIndexBut(PageIndexToDeleteStateIsYes, 1, DataPageCount);
        } else if (keycode == 39) {
            //下一页
            new DataTableObj().PageIndexBut(PageIndexToDeleteStateIsYes, 2, DataPageCount);
        }
    }


    this.CheckAllChangeObjToDataTable = function (objCheck) {
        var ValListKey = "";
        if (objCheck.checked) {
            //选择
            objCheck.parentNode.children[1].innerText = CheckIsTrueTxt;
            for (var i = 0; i < document.getElementsByName("DataTableItemCheck").length; i++) {
                document.getElementsByName("DataTableItemCheck")[i].checked = true;
                if (document.getElementsByName("DataTableItemCheck")[i].value != null && document.getElementsByName("DataTableItemCheck")[i].value != "" && document.getElementsByName("DataTableItemCheck")[i].value != "on") {
                    ValListKey += document.getElementsByName("DataTableItemCheck")[i].value + ",";
                }
            }
        } else {
            for (var i = 0; i < document.getElementsByName("DataTableItemCheck").length; i++) {
                document.getElementsByName("DataTableItemCheck")[i].checked = false;
                if (document.getElementsByName("DataTableItemCheck")[i].value != null && document.getElementsByName("DataTableItemCheck")[i].value != "" && document.getElementsByName("DataTableItemCheck")[i].value != "on") {
                    ValListKey += document.getElementsByName("DataTableItemCheck")[i].value + ",";
                }
            }
            objCheck.parentNode.children[1].innerText = CheckIsFalseTxt;
        }
        if (ValListKey.length > 0) {
            ValListKey = ValListKey.substring(0, ValListKey.length - 1);
        }
        objCheck.setAttribute("tag", "{\"checked\":\"" + objCheck.checked + "\",\"list\":\"" + ValListKey + "\"}");
        CheckAllChange("{\"checked\":\"" + objCheck.checked + "\",\"list\":\"" + ValListKey + "\"}");
    }
    this.CheckItemChangeObjToDataTable = function (objKey) {
        if (!objKey.checked) {
            objKey.parentNode.parentNode.parentNode.children[0].getElementsByTagName("input")[0].checked = false;
            objKey.parentNode.parentNode.parentNode.children[0].getElementsByTagName("span")[0].innerText = "全选";
        }
        CheckItemChange(objKey);
    }
    ///获取全选后所选择数据的唯一键值的列表
    this.GetCheckAllValueList = function () {
        var ListKey = "";
        var ListCheck = document.getElementsByName("DataTableItemCheck"); //DataTableItemCheck document.getElementById(DataTableDivId).getElementsByTagName("table")[0].getElementsByTagName("input");
        for (var i = 0; i < ListCheck.length; i++) {
            if (ListCheck[i].checked) {
                ListKey += ListCheck[i].value + ",";
            }
        }
        if (ListKey.length > 0) {
            ListKey = ListKey.substring(0, ListKey.length - 1);
        }
        return ListKey; // document.getElementById(DataTableDivId).getElementsByTagName("td")[0].getElementsByTagName("input")[0].getAttribute("tag");
    }

    var PostStart = function () {
        //alert("开始请求");
        ShowTxtDiv(LoginDivTxt);
    }
    var ShowTxtDiv = function (txt) {
        var lodingdivobj = document.getElementById("95e638fa2433e6802b6d28201e28b73d");
        if (lodingdivobj != undefined && lodingdivobj != null) {
            lodingdivobj.parentNode.removeChild(lodingdivobj);
        }
        if (LoginDivClassName != "") {
            document.getElementById(DataTableDivId).innerHTML = "<div id='95e638fa2433e6802b6d28201e28b73d' class='" + LoginDivClassName + "'>" + txt + "</div>" + document.getElementById(DataTableDivId).innerHTML;
        } else {
            document.getElementById(DataTableDivId).innerHTML = "<div id='95e638fa2433e6802b6d28201e28b73d' style='width:90px;height:30px;opacity:1.0;background-color:#999999;position:absolute;z-index:900;border:solid 1px #F0C36D;background-color:#F9EDBE;font-size:13px;color:#666;text-align:center;line-height:30px;margin-left:25%;'>" + txt + "</div>" + document.getElementById(DataTableDivId).innerHTML;
        }
    }
    var CZShowTxtDiv = function (txt) {
        var lodingdivobj = document.getElementById("95e638fa2433e6802b6d28201e28b73d");
        if (lodingdivobj != undefined && lodingdivobj != null) {
            lodingdivobj.parentNode.removeChild(lodingdivobj);
        }
        if (LoginDivClassName != "") {
            document.getElementById(DataTableDivId).innerHTML = "<div id='95e638fa2433e6802b6d28201e28b73d' class='" + LoginDivClassName + "'>" + txt + "</div>";
        } else {
            document.getElementById(DataTableDivId).innerHTML = "<div id='95e638fa2433e6802b6d28201e28b73d' style='width:90px;height:30px;opacity:1.0;background-color:#999999;position:absolute;z-index:900;border:solid 1px #F0C36D;background-color:#F9EDBE;font-size:13px;color:#666;text-align:center;line-height:30px;margin-left:25%;'>" + txt + "</div>";
        }
    }
    var PostStop = function () {
        //alert("请求完毕");
    }
    this.UpStateRefresh = function () {
        PostRequest(PosrUrlTxt, GetPostParametersToRefresh(PageIndexToDeleteStateIsYes, GetDataTableByWhere));
    }
    this.SelectDataTable = function (jsonModel, _DeleteItemState, _UpdateButClick, _CheckAllChange, _CheckItemChange, _Callback) {
        //ShowDataTableDivId, GetDataTableUrl, GetDataTableByWhereTxt, _UpdateButClick, _DeleteItemState, _CheckAllChange, _CheckItemChange

        DataTableDivId = jsonModel.ShowDataTableDivId;
        PosrUrlTxt = jsonModel.GetDataTableUrl;
        GetDataTableByWhere = jsonModel.GetDataTableByWhereTxt;
        PageIndexToDeleteStateIsYes = 0;
        //DataPageCount = 0;
        PageShowButCount = 7;
        //初始化参数
        DeleteButName = "删除";
        UpdateButName = "修改";
        CheckIsTrueTxt = "反选";
        CheckIsFalseTxt = "全选";
        CheckItemTxt = "";
        DeleteOrUpdateTitle = "操作";
        //加载时div的样式
        LoginDivClassName = "";
        //加载时div的文字
        LoginDivTxt = "正在请求..."; //提示行文字
        DeleteShowTxt = "你确定要删除该项数据吗？";
        PageIndexTool = false;
        if (jsonModel.PageIndexToolState != undefined) {
            PageIndexTool = jsonModel.PageIndexToolState;
        }
        if (jsonModel.DeleteShowTxt != undefined) {
            DeleteShowTxt = jsonModel.DeleteShowTxt;
        }
        if (jsonModel.ShowDataTableDivId == undefined) {
            //获取显示的divid
            DataTableDivId = "【DataTableDivId】";
            if (DataTableDivId == undefined || DataTableDivId == null) {
                alert("你必须提供显示数据的div的ID");
                return;
            }
        }
        if (jsonModel.GetDataTableUrl == undefined) {//getPostUrlByDataTable
            //请求的地址
            PosrUrlTxt = "【PosrUrlTxt】";
            if (PosrUrlTxt == undefined || PosrUrlTxt == null) {
                alert("你采用的是自选地址作为请求地址，但是可能因为兼容性问题无法获取请求地址，请将js引用代码放入页面最前方。");
                return;
            }
        }
        if (jsonModel.GetDataTableByWhereTxt == undefined) {
            GetDataTableByWhere = "";
        }
        if (jsonModel.PageIndexToDeleteStateIsYes != undefined) {
            PageIndexToDeleteStateIsYes = parseInt(jsonModel.PageIndexToDeleteStateIsYes);
        }
        if (jsonModel.PageShowButCount != undefined) {
            PageShowButCount = parseInt(jsonModel.PageShowButCount);
        }
        if (jsonModel.DeleteButHtml != undefined) {
            DeleteButName = jsonModel.DeleteButHtml;
        }
        if (jsonModel.UpdateButHtml != undefined) {
            UpdateButName = jsonModel.UpdateButHtml;
        }
        if (jsonModel.CheckIsTrueTxt != undefined) {
            CheckIsTrueTxt = jsonModel.CheckIsTrueTxt;
        }
        if (jsonModel.CheckIsFalseTxt != undefined) {
            CheckIsFalseTxt = jsonModel.CheckIsFalseTxt;
        }
        if (jsonModel.CheckItemTxt != undefined) {
            CheckItemTxt = jsonModel.CheckItemTxt;
        }
        if (jsonModel.DeleteOrUpdateTitle != undefined) {
            DeleteOrUpdateTitle = jsonModel.DeleteOrUpdateTitle;
        }
        if (jsonModel.LoginDivClassName != undefined) {
            LoginDivClassName = jsonModel.LoginDivClassName;
        }
        if (jsonModel.LoginDivHtml != undefined) {
            LoginDivTxt = jsonModel.LoginDivHtml;
        }
        //初始化参数  方法
        UpdateButClick = null;
        DeleteItemState = null;
        CheckAllChange = null;
        CheckItemChange = null;
        Callback = null;
        //使用json来初始化
        if (jsonModel.UpdateButClick != undefined && jsonModel.UpdateButClick != null) {
            UpdateButClick = jsonModel.UpdateButClick;
        }
        if (jsonModel.DeleteItemState != undefined && jsonModel.DeleteItemState != null) {
            DeleteItemState = jsonModel.DeleteItemState;
        }
        if (jsonModel.CheckAllChange != undefined && jsonModel.CheckAllChange != null) {
            CheckAllChange = jsonModel.CheckAllChange;
        }
        if (jsonModel.CheckItemChange != undefined && jsonModel.CheckItemChange != null) {
            CheckItemChange = jsonModel.CheckItemChange;
        }
        if (jsonModel.Callback != undefined && jsonModel.Callback != null) {
            Callback = jsonModel.Callback;
        }
        //判断初始化参数
        if (_UpdateButClick != undefined && _UpdateButClick != null) {
            UpdateButClick = _UpdateButClick;
        }
        if (_DeleteItemState != undefined && _DeleteItemState != null) {
            DeleteItemState = _DeleteItemState;
        }
        if (_CheckAllChange != undefined && _CheckAllChange != null) {
            CheckAllChange = _CheckAllChange;
        }
        if (_CheckItemChange != undefined && _CheckItemChange != null) {
            CheckItemChange = _CheckItemChange;
        }
        if (_Callback != undefined && _Callback != null) {
            Callback = _Callback;
        }
        //alert(CheckAllChange);
        PostRequest(PosrUrlTxt, GetPostParametersToGetData(0, GetDataTableByWhere));
    }
}
//获取url的参数
function getQueryStringByDataTable(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (url.indexOf('?') == -1) {
        return null;
    } else {
        url = url.substr(url.indexOf('?'), url.length);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
}
//获取请求url
function getPostUrlByDataTable(url) {
    if (url.indexOf('?') == -1) {
        return null;
    } else {
        url = url.substr(0, url.indexOf('?'));
        return url;
    }
}
//处理tr对象
function ChuLiTrObjArrtDataTablePage(id) {
    var trObj = document.getElementById(id).parentNode;
    var indexQZ = 0;
    var indexQZJ = trObj.getElementsByTagName("td").length;
    if (CheckAllChange == null) {
        //从0开始取
        indexQZ = 0;
    } else {
        //从1开始取
        indexQZ = 1;
    }
    if ((UpdateButClick == null || UpdateButClick == undefined) && (DeleteItemState == null || DeleteItemState == undefined)) {
        //取值到最后
    } else {
        //最后一列不取
        indexQZJ = indexQZJ - 1;
    }
    var ObjTxt = new Array();
    for (var i = indexQZ; i < indexQZJ; i++) {
        ObjTxt.push(trObj.getElementsByTagName("td")[i].innerHTML);
    }
    return ObjTxt;
}