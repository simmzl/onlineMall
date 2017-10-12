//支持低版本IE的className
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (cls) {
        var ret = [];
        var all = document.getElementsByTagName('*');
        for (var i = 0; i < all.length; i++) {
            if (all[i].className === cls
                || all[i].className.indexOf(cls + " ") === 0
                || all[i].className.indexOf(" " + cls + " ") > -1
                || all[i].className.indexOf(cls + " ") === (all[i].className.length - cls.length - 1)) {
                ret.push(all[i]);
            }
        }
        return ret;
    }
}

var table = document.getElementById('cartTable');
//rows
var tr = table.children[1].rows;
var checkAll = document.getElementsByClassName('checkAll');
var check = document.getElementsByClassName('check');
var selectedTotal = document.getElementById("selectedTotal");
var priceTotal = document.getElementById("priceTotal");
var deleteAll = document.getElementById("deleteAll");
var img = document.getElementsByTagName('img');
var addGood = document.getElementById('addGood');

// 禁止图片拖动
for (i = 0; i < img.length; i++) {
    img[i].onmousedown = function (e) {
        e.preventDefault();
    };
}

function getTotal() {
    var selected = 0;
    var price = 0;
    for (var i = 0; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("input")[0].checked) {
            selected += parseInt(tr[i].getElementsByTagName("input")[1].value);
            price += parseInt(tr[i].cells[4].innerHTML);
        }
    }
    selectedTotal.innerHTML = selected;
    priceTotal.innerHTML = price;
}

function getSum(tr) {
    var unit = parseInt(tr.cells[2].innerHTML);
    tr.cells[4].innerHTML = (unit * parseInt(tr.getElementsByTagName('input')[1].value));
    if (tr.getElementsByTagName('input')[0].checked === true) {
        getTotal();
    }
}

function addCheckClick() {
    for (var i = 0; i < check.length; i++) {
        check[i].onclick = function () {
            //判断是否为全选
            if (this.className === "check checkAll") {
                for (var i = 0; i < check.length; i++) {
                    check[i].checked = this.checked;
                }
            }
            //修复全选时取消某个之后再次选择，全选框不勾选的BUG
            if (this.checked === false) {
                for (i = 0; i < checkAll.length; i++) {
                    checkAll[i].checked = false;
                }
            } else {
                var secNum = 0;
                for (i = 0; i < check.length; i++) {
                    if (check[i].checked === true) {
                        secNum++;
                    }
                }
                if (secNum === check.length - 2) {
                    for (i = 0; i < checkAll.length; i++) {
                        checkAll[i].checked = true;
                    }
                }
            }
            getTotal();
        }
    }
}


function addTdEvent() {
    for (i = 0; i < tr.length; i++) {
        tr[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            var cls = el.className;
            var val = this.getElementsByTagName('input')[1].value;
            var reduce = this.getElementsByTagName('span')[1];
            switch (cls) {
                case "add fl":
                    this.getElementsByTagName('input')[1].value = parseInt(val) + 1;
                    // reduce.innerHTML = "-";
                    reduce.style.opacity = 1;
                    getSum(this);
                    break;
                case "reduce fl":
                    if (val > 1) {
                        this.getElementsByTagName('input')[1].value = parseInt(val) - 1;
                        reduce.style.opacity = 1;
                        getSum(this);
                    }
                    if (this.getElementsByTagName('input')[1].value <= 1) {
                        // reduce.innerHTML="";
                        reduce.style.opacity = 0.1;
                    }
                    break;
                case "delete":
                    var conf = confirm("确认删除？");
                    if (conf) {
                        this.parentNode.removeChild(this);
                        getTotal();
                    }
                    break;
                default:
                    break;
            }
        };
        tr[i].getElementsByTagName('input')[1].onkeyup = function () {
            var val = parseInt(this.value);
            var tr = this.parentNode.parentNode.parentNode;
            var reduce = tr.getElementsByTagName('span')[1];
            if (val <= 0 || isNaN(val)) {
                val = 1;
            }
            this.value = val;
            if (val <= 1) {
                reduce.style.opacity = 0.1;
            }
            if (val > 1) {
                reduce.style.opacity = 1;
            }
            getSum(tr);
        };
    }
}

deleteAll.onclick = function () {
    if (selectedTotal.innerHTML === "0") return;
    var conf = confirm("确认删除？");
    if (conf) {
        for (var i = 0; i < tr.length; i++) {
            var input = tr[i].getElementsByTagName("input")[0];
            if (input.checked) {
                tr[i].parentNode.removeChild(tr[i]);
            }
            getTotal();
            i--;
        }
    }
};

addGood.onclick = function () {
    // appendChild()
    var tr = document.createElement('tr');
    tr.innerHTML = "<td class=\"checkbox\"><input type=\"checkbox\" class=\"check checkAdd\" id=\"checkAdd\"></td>\n" +
        "            <td><img src=\"images/5.png\" alt=\"\"><span class=\"imgAlt\">埃及进口长绒棉毛巾</span></td>\n" +
        "            <td>159</td>\n" +
        "            <td class=\"num\">\n" +
        "                <div class=\"addRe\">\n" +
        "                    <span class=\"reduce fl\">-</span><input type=\"text\" value=\"1\" class=\"fl\"><span class=\"add fl\">+</span>\n" +
        "                    <div style=\"clear:both\"></div>\n" +
        "                </div>\n" +
        "            </td>\n" +
        "            <td class=\"sum\">159</td>\n" +
        "            <td class=\"deleteTd\"><span class=\"delete\">删除</span></td>";
    table.children[1].appendChild(tr);
    var checkAdd = document.getElementsByClassName('checkAdd');
    for (var i = 0; i < checkAdd.length; i++) {
        checkAdd[i].checked = true;
    }
    getTotal();
    addTdEvent();
    addCheckClick();
    document.getElementsByTagName('body')[0].scrollHeight = 671;
};
addTdEvent();
addCheckClick();
checkAll[0].checked = true;
checkAll[0].onclick();

