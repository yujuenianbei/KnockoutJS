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

    // sample19 with1
    var sample19 = {
        city: "London",
        coords:{
            latitude:  51.5001524,
            longitude: -0.1262362
        }
    }
    ko.applyBindings(sample19, document.getElementById('sample19'))

    // sample20 with2
    function sample20() {
        var self = this;
        self.twitterName = ko.observable("@example");
        self.resultData = ko.observable();
        self.getTweets = function() {
            var name = self.twitterName();
            simulatedResults = [
                { text: name + 'what a nice day.'},
                { text: name + 'Building some cool apps.'},
                { text: name + 'Just saw a famous celebrity eating lard. Yum.'}
            ]
            self.resultData({retrievalDate: new Date(), topTweets: simulatedResults})
        }
        self.cleanResults = function() {
            // 这里的this指向的是resultData　由html决定this 指向
            console.log(this);
            self.resultData(undefined)
        }
    }
    ko.applyBindings(new sample20(), document.getElementById('sample20'))

    // sample20 component
    ko.components.register('message-editor', {
        viewModel: function(params) {
            this.text = ko.observable(params && params.initialText || '');
        },
        template: 'Message: <input data-bind="value: text" /> '
                + '(length: <span data-bind="text: text().length"></span>)'
    });
    ko.applyBindings(null, document.getElementById('sample21'));

    // sample22 click
    var sample22 = {
        numberOfClicks : ko.observable(0),
        incrementClickCounter : function() {
            var previousCount = this.numberOfClicks();
            this.numberOfClicks(previousCount + 1);
        }
    };
    ko.applyBindings(sample22, document.getElementById('sample22'));
    // samle23 click params
    var samle23 = {
        myFunction: function(data, event) {
            if (event.shiftKey) {
                console.log(1,event);
                //do something different when user has shift key down
            } else {
                //do normal action
                console.log(2,event);
            }
        }
    };
    ko.applyBindings(samle23,document.getElementById("sample23"));
});