let vm = new Vue({
    el:'#app',
    data:{
        totalMoney:0,
        totalQuantity:0,
        productList:[],
        checkAll:true
    },
    filters:{
        formatMoney:function (value) {
            return '￥'+ value.toFixed(2);
        }
    },
    mounted:function () {
        this.$nextTick(function () {
            this.cartView();
        });
    },
    methods:{
        cartView : function () {
            this.$http.get('../vue/data/cartData.json').then( res => {
                this.productList = res.body.result.list;
            });
        },
        trClick : function (e,item) {
            e = e || window.event;
            let el = e.srcElement||e.target;
            let cls = el.className;


            switch (cls) {
                case "check":
                    if(item.checked === undefined){
                        this.$set(item, "checked", false);
                    }
                    if(el.checked === true){
                        item.checked = true;//true
                    }else {
                        item.checked = false;
                    }
                    // this.$set(item, "checked", true);
                    // console.log(item.checked);
                    this.getTotal();
                    break;
                case "add fl":
                    item.productQuantity ++;
                    let reduce = el.parentNode.childNodes[0];
                    reduce.style.opacity = 1;
                    this.getTotal();
                    break;
                case "reduce fl":
                    if (item.productQuantity > 1) {
                        item.productQuantity --;
                        el.style.opacity = 1;
                    }
                    if (item.productQuantity  <= 1) {
                        el.style.opacity = 0.1;
                    }
                    this.getTotal();
                    break;
                case "delete":
                    let conf = confirm("确认删除？");
                    item.checked = false;
                    this.getTotal();
                    conf && el.parentNode.parentNode.parentNode.removeChild(el.parentNode.parentNode);
                    break;
            }
        },
        getTotal : function () {
            this.totalMoney = 0;
            this.totalQuantity = 0;
            this.productList.forEach((item) =>{
                if (item.checked) {
                    this.totalQuantity +=item.productQuantity;
                    this.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        }
    }
});