requirejs.config({
    baseUrl: 'js',
    paths: {
        "jqurey": "jquery.min",
        "Vue": "vue.min",
        "ko": "knockout-min"
    },
});

require(["jqurey", "Vue", "ko"], function ($, Vue, ko) {
    alert($)
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
    ko.applyBindings(myViewModel1, document.getElementById("sample1"))
    // 监控（observable）
    var myViewModel2 = {
        name: ko.observable('tom'),
        age: ko.observable('12')
    }
    ko.applyBindings(myViewModel2, document.getElementById("sample2"))

    // // 可读写监控属性（可以替代原先的值）
    // myViewModel2.name('tttt').age('23')
    // console.log(myViewModel2.name())

    // 监控属性数组
    var SimpleListModel = function (items) {
        this.items = ko.observableArray(items);
        this.itemToAdd = ko.observable("");
        this.addItem = function () {
            if (this.itemToAdd() != "") {
                this.items.push(this.itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update. 
                this.itemToAdd(""); // Clears the text box, because it's bound to the "itemToAdd" observable 
            }
        }.bind(this); // Ensure that "this" is always this view model 
    };
    ko.applyBindings(new SimpleListModel(["Alpha", "Beta", "Gamma"]), document.getElementById("sapmle3"));

    var appData = function () {
        this.firstName = ko.observable('John');
        this.lastName = ko.observable('Burns');
        this.prefix = ko.observable('Dr.');
        this.computedLog = ko.observable('Log: ');
        this.fullName = ko.pureComputed(function () {
            var value = this.prefix() + " " + this.firstName() + " " + this.lastName();
            console.log(this.computedLog.peek(), value)
            // Normally, you should avoid writing to observables within a pure computed 
            // observable (avoiding side effects). But this example is meant to demonstrate 
            // its internal workings, and writing a log is a good way to do so.
            this.computedLog(this.computedLog.peek() + value + '; ');
            return value;
        }, this);

        this.step = ko.observable('0');
        this.next = function () {
            console.log(this.setp())
            this.step(this.step() === 2 ? 0 : this.step() + 1);
        };
    }
    ko.applyBindings(new appData(), document.getElementById('sample4'))
});