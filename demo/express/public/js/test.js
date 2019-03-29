requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        "jquery": "jquery.min",
        "Vue": "vue.min",
    },
});

require(["jquery", "Vue"], function ($, Vue) {
    var app = new Vue({
        el: "#app",
        data: {
            message: 'test Vue!'
        }
    });
})