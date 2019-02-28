requirejs.config({
    baseUrl: 'js',
    paths: {
        "Vue": "vue.min",
        "ko" : "knockout-min"
    },
});

require(["Vue","ko"], function(Vue,ko){
    var app = new Vue({
        el: "#app",
        data: {
            message: 'Hello Vue!'
          }
    });
    // 激活绑定关系
    var myViewModel1 = {
        person: 'antonio'
    }
    ko.applyBindings(myViewModel1,document.getElementById("sample1"))
    // 监控（observable）
    var myViewModel2 = {
        name: ko.observable('tom'),
        age: ko.observable('12')
    }
    ko.applyBindings(myViewModel2,document.getElementById("sample2"))
    
    // // 可读写监控属性（可以替代原先的值）
    // myViewModel2.name('tttt').age('23')
    // console.log(myViewModel2.name())

    // 监控属性数组
    var SimpleListModel = function(items) { 
        this.items = ko.observableArray(items); 
        this.itemToAdd = ko.observable(""); 
        this.addItem = function() { 
            if (this.itemToAdd() != "") { 
                this.items.push(this.itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update. 
                this.itemToAdd(""); // Clears the text box, because it's bound to the "itemToAdd" observable 
                } 
            }.bind(this); // Ensure that "this" is always this view model 
        }; 
    ko.applyBindings(new SimpleListModel(["Alpha", "Beta", "Gamma"]),document.getElementById("sapmle3"));

});