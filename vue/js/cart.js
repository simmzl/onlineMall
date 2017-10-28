new Vue({
    el:'#app',
    data:{
        totalMoney:0,
        totalQuantity:0,
        productList:[],
        checkedAll:true
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
                this.productList.forEach( (item) => {
                    typeof item.checked === 'undefined' && this.$set(item, "checked", true);
                });
                this.getTotal();
            });
        },
        trClick : function (e,item) {
            e = e || window.event;
            let el = e.srcElement||e.target;
            let cls = el.className;
            let checkedQuantity = 0;
            switch (cls) {
                case "check":
                    // typeof item.checked === 'undefined' && this.$set(item, "checked", false);
                    el.checked === true ? item.checked = true : item.checked = false;

                    if(item.checked){
                        this.productList.forEach((i) =>{
                            !i.checked ? this.checkedAll = false : checkedQuantity++;
                        });
                        if(checkedQuantity === this.productList.length){
                            this.checkedAll = true;
                        }
                    }else {
                        this.checkedAll = false;
                    }
                    this.getTotal();
                    break;
                case "add fl":
                    item.productQuantity ++;
                    let reduce = el.parentNode.childNodes[0];
                    reduce.style.opacity = 1;
                    this.getTotal();
                    break;
                case "reduce fl":
                    if(item.productQuantity > 2){
                        item.productQuantity -- ;
                    }else if(item.productQuantity = 2){
                        item.productQuantity -- ;
                        el.style.opacity = 0.1;
                    }
                    this.getTotal();
                    break;
                case "delete":
                    let conf = confirm("确认删除？");
                    if(!!conf){
                        let index = this.productList.indexOf(item);
                        this.productList.splice(index,1);
                        this.getTotal();
                    }
                    break;
            }
        },
        inputQuantity:function (e,item) {
            if(item.productQuantity <= 0 || isNaN(item.productQuantity)){
                item.productQuantity = 1;
                e.target.parentNode.firstElementChild.style.opacity = 0.1;
            }else if (item.productQuantity > 1){
                e.target.parentNode.firstElementChild.style.opacity = 1;
            }else {
                e.target.parentNode.firstElementChild.style.opacity = 0.1;
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
        },
        checkALL : function () {
            if (this.checkedAll === true){
                this.productList.forEach((item) =>{
                    item.checked  = true;
                });
                this.getTotal();
            }else {
                this.productList.forEach((item) =>{
                    item.checked  = false;
                });
                this.totalMoney = 0;
                this.totalQuantity = 0;
            }
        },
        deleteAll :function () {
            let checkedQuantity = 0;
            this.productList.forEach((i) =>{
                !i.checked ? this.checkedAll = false : checkedQuantity++;
            });
            if(checkedQuantity === 0){
                alert('请选择商品！');
                return;
            }
            let conf = confirm("确认删除？");
            if(!!conf){
                this.checkedAll = false;
                this.totalQuantity = 0;
                this.totalMoney = 0;
                for(let i=0;i<this.productList.length;i++){
                    if(this.productList[i].checked  === true){
                        this.productList.splice(i,1);
                        i--;
                    }
                }
            }
        },
        addProduct :function () {
            this.$http.get('../vue/data/addData.json').then( res => {
                let result = res.body.result.list;
                result.forEach( (item) => {
                    typeof item.checked === 'undefined' && this.$set(item, "checked", true);
                    this.productList.push(item);
                    this.getTotal();
                });
            })
        }
    }
});