requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        "Vue": "vue.min",
        "ko": "knockout-min"
    },
});

require(["Vue", "ko"], function (Vue, ko) {
    var app = new Vue({
        el: "#app",
        data: {
            message: 'Hello Vue!'
        }
    });
    // sample1
    // 激活绑定关系
    var myViewModel1 = {
        person: 'antonio'
    }
    ko.applyBindings(myViewModel1, document.getElementById("sample1"))
    // sample2
    // 监控（observable）
    var myViewModel2 = {
        name: ko.observable('tom'),
        age: ko.observable('12')
    }
    ko.applyBindings(myViewModel2, document.getElementById("sample2"))
    // sample3
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
    // sample4
    var appData = function () {
        this.firstName = ko.observable('John');
        this.lastName = ko.observable('Burns');
        this.prefix = ko.observable('Dr.');
        this.computedLog = ko.observable('Log: ');
        this.fullName = ko.pureComputed(function () {
            var value = this.prefix() + " " + this.firstName() + " " + this.lastName();
            console.log(this.computedLog(), value)
            // Normally, you should avoid writing to observables within a pure computed 
            // observable (avoiding side effects). But this example is meant to demonstrate 
            // its internal workings, and writing a log is a good way to do so.
            this.computedLog(this.computedLog.peek() + value + '; ');
            return value;
        }, this);

        this.step = ko.observable(0);
        this.next = function () {
            console.log(this.setp())
            this.step(this.step() === 2 ? 0 : this.step() + 1);
        };
    }
    ko.applyBindings(new appData(), document.getElementById('sample4'))
    // sample5
    var viewModel5 = {
        url: ko.observable("year-end.html"),
        details: ko.observable("Report including final year-end statistics")
    }
    ko.applyBindings(viewModel5, document.getElementById('sample5'))

    // sample6
    var sample6 = {
        people: [
            { firstName: 'Bert', lastName: 'Bertington' },
            { firstName: 'Charles', lastName: 'Charlesforth' },
            { firstName: 'Denise', lastName: 'Dentiste' }
        ]
    }
    ko.applyBindings(sample6, document.getElementById('sample6'));
    // sample7
    function sample7() {
        var self = this;
        self.persons = ko.observableArray([
            {name:'Anto'},
            {name:'Tom'},
            {name:'Jojn'}
        ]);
        self.addPerson = function() {
            self.persons.push({name: "new at"+ new Date()})
        };
        self.removePerson = function() {
            self.persons.remove(this);
        }
    }
    ko.applyBindings(new sample7(), document.getElementById("sample7"));
});