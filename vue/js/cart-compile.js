'use strict';

var vm = new Vue({
    el: '#app',
    data: {
        title: 'hello'
    },
    filters: {},
    mounted: function mounted() {
        this.cartView();
    },
    methods: {
        cartView: function cartView() {
            undefined.$http.get('');
        }
    }
});

//# sourceMappingURL=cart-compile.js.map