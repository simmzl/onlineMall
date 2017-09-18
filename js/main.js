
//支持低版本IE
if(!document.getElementsByClassName){
    document.getElementsByClassName = function (cls){
        var ret = [];
        var all = document.getElementsByTagName('*');
        for(var i=0;i<all.length;i++){
            if(all[i].className === cls
                || all[i].className.indexOf(cls+" ")===0
                || all[i].className.indexOf(" "+cls+" ")>-1
                || all[i].className.indexOf(cls+" ")===(all[i].className.length - cls.length - 1)){
                ret.push(all[i]);
            }
        }
        return ret;
    }
}

var table = document.getElementById('cartTable');
//rows
var tr =table.children[1].rows;
var checkAll = document.getElementsByClassName('checkAll');
var check = document.getElementsByClassName('check');
var selectedTotal = document.getElementById("selectedTotal");
var priceTotal = document.getElementById("priceTotal");
var deleteAll = document.getElementById("deleteAll");
var img = document.getElementsByTagName('img');

// 禁止图片拖动
for( i=0;i<img.length;i++){
    img[i].onmousedown = function(e){
        e.preventDefault();
    };
}

function getTotal(){
    var selected = 0;
    var price = 0;
    for(var i=0;i<tr.length;i++){
        if(tr[i].getElementsByTagName("input")[0].checked){
            selected += parseInt(tr[i].getElementsByTagName("input")[1].value);
            price += parseInt(tr[i].cells[4].innerHTML);
            console.log(price);
        }
    }
    selectedTotal.innerHTML = selected;
    priceTotal.innerHTML = price;
}

function getSum(tr) {
    var unit = parseInt(tr.cells[2].innerHTML);
    tr.cells[4].innerHTML = (unit * parseInt(tr.getElementsByTagName('input')[1].value));
    if(tr.getElementsByTagName('input')[0].checked ===true){
        getTotal();
    }
}
for(var i=0;i<check.length;i++){
   check[i].onclick = function () {
       //判断是否为全选
       if(this.className === "check checkAll"){
           for(var i=0;i<check.length;i++){
               check[i].checked = this.checked;
           }
       }
       if(this.checked === false){
           for(i=0;i<checkAll.length;i++){
               checkAll[i].checked = false;
           }
       }
       getTotal();
   } 
}

for( i=0;i<tr.length;i++){
    tr[i].onclick = function(e){
        e = e || window.event;
        var el = e.srcElement;
        var cls = el.className;
        var val = this.getElementsByTagName('input')[1].value;
        var reduce = this.getElementsByTagName('span')[1];
        switch(cls) {
            case "add fl":
                this.getElementsByTagName('input')[1].value = parseInt(val) + 1;
                // reduce.innerHTML = "-";
                reduce.style.opacity=1;
                getSum(this);
                break;
            case "reduce fl":
                if (val > 1) {
                    this.getElementsByTagName('input')[1].value = parseInt(val) - 1;
                    reduce.style.opacity=1;
                    getSum(this);
                }
                if(this.getElementsByTagName('input')[1].value<=1){
                // reduce.innerHTML="";
                    reduce.style.opacity=0.1;
            }
                break;
            case "delete":
                var conf = confirm("确认删除？");
                if(conf){
                    this.parentNode.removeChild(this);
                }
                break;
                default:
                break;
        }
    };
    tr[i].getElementsByTagName('input')[1].onkeyup = function(){
        var val = parseInt(this.value);
        var tr = this.parentNode.parentNode.parentNode;
        var reduce = tr.getElementsByTagName('span')[1];
        if(val<=0||isNaN(val)){
            val=1;
        }
        this.value=val;
        if(val<=1){
            reduce.style.opacity=0.1;
        }
        if(val>1){
            reduce.style.opacity=1;
        }
        getSum(tr);
    };
}

deleteAll.onclick = function () {
    if(selectedTotal.innerHTML==="0") return;
    var conf = confirm("确认删除？");
    if(conf){
        for(var i=0;i<tr.length;i++){
            var input = tr[i].getElementsByTagName("input")[0];
            if(input.checked){
            tr[i].parentNode.removeChild(tr[i]);
            }
            i--;
        }
    }
};

checkAll[0].checked = true;
checkAll[0].onclick();

