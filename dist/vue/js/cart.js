'use strict';

new Vue({
    el: '#app',
    data: {
        totalMoney: 0,
        totalQuantity: 0,
        productList: [],
        checkedAll: true
    },
    filters: {
        formatMoney: function formatMoney(value) {
            return '￥' + value.toFixed(2);
        }
    },
    mounted: function mounted() {
        this.$nextTick(function () {
            this.cartView();
        });
    },
    methods: {
        cartView: function cartView() {
            var _this = this;

            this.$http.get('../vue/data/cartData.json').then(function (res) {
                _this.productList = res.body.result.list;
                _this.productList.forEach(function (item) {
                    typeof item.checked === 'undefined' && _this.$set(item, "checked", true);
                });
                _this.getTotal();
            });
        },
        trClick: function trClick(e, item) {
            var _this2 = this;

            e = e || window.event;
            var el = e.srcElement || e.target;
            var cls = el.className;
            var checkedQuantity = 0;
            switch (cls) {
                case "check":
                    // typeof item.checked === 'undefined' && this.$set(item, "checked", false);
                    el.checked === true ? item.checked = true : item.checked = false;

                    if (item.checked) {
                        this.productList.forEach(function (i) {
                            !i.checked ? _this2.checkedAll = false : checkedQuantity++;
                        });
                        if (checkedQuantity === this.productList.length) {
                            this.checkedAll = true;
                        }
                    } else {
                        this.checkedAll = false;
                    }
                    this.getTotal();
                    break;
                case "add fl":
                    item.productQuantity++;
                    var reduce = el.parentNode.childNodes[0];
                    reduce.style.opacity = 1;
                    this.getTotal();
                    break;
                case "reduce fl":
                    if (item.productQuantity > 2) {
                        item.productQuantity--;
                    } else if (item.productQuantity = 2) {
                        item.productQuantity--;
                        el.style.opacity = 0.1;
                    }
                    this.getTotal();
                    break;
                case "delete":
                    var conf = confirm("确认删除？");
                    if (!!conf) {
                        var index = this.productList.indexOf(item);
                        this.productList.splice(index, 1);
                        this.getTotal();
                    }
                    break;
            }
        },
        inputQuantity: function inputQuantity(e, item) {
            if (item.productQuantity <= 0 || isNaN(item.productQuantity)) {
                item.productQuantity = 1;
                e.target.parentNode.firstElementChild.style.opacity = 0.1;
            } else if (item.productQuantity > 1) {
                e.target.parentNode.firstElementChild.style.opacity = 1;
            } else {
                e.target.parentNode.firstElementChild.style.opacity = 0.1;
            }
        },
        getTotal: function getTotal() {
            var _this3 = this;

            this.totalMoney = 0;
            this.totalQuantity = 0;
            this.productList.forEach(function (item) {
                if (item.checked) {
                    _this3.totalQuantity += item.productQuantity;
                    _this3.totalMoney += item.productPrice * item.productQuantity;
                }
            });
        },
        checkALL: function checkALL() {
            if (this.checkedAll === true) {
                this.productList.forEach(function (item) {
                    item.checked = true;
                });
                this.getTotal();
            } else {
                this.productList.forEach(function (item) {
                    item.checked = false;
                });
                this.totalMoney = 0;
                this.totalQuantity = 0;
            }
        },
        deleteAll: function deleteAll() {
            var _this4 = this;

            var checkedQuantity = 0;
            this.productList.forEach(function (i) {
                !i.checked ? _this4.checkedAll = false : checkedQuantity++;
            });
            if (checkedQuantity === 0) {
                alert('请选择商品！');
                return;
            }
            var conf = confirm("确认删除？");
            if (!!conf) {
                this.checkedAll = false;
                this.totalQuantity = 0;
                this.totalMoney = 0;
                for (var i = 0; i < this.productList.length; i++) {
                    if (this.productList[i].checked === true) {
                        this.productList.splice(i, 1);
                        i--;
                    }
                }
            }
        },
        addProduct: function addProduct() {
            var _this5 = this;

            this.$http.get('../vue/data/addData.json').then(function (res) {
                var result = res.body.result.list;
                result.forEach(function (item) {
                    typeof item.checked === 'undefined' && _this5.$set(item, "checked", true);
                    _this5.productList.push(item);
                    _this5.getTotal();
                });
            });
        }
    }
});
//# sourceMappingURL=cart.js.map