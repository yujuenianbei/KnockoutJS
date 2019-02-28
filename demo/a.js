// define(function(){
//     function fun1(){
//       alert("it works");
//     }

//     fun1();
// })

require(["https://cdn.bootcss.com/knockout/3.5.0-rc2/knockout-min.js"], function (ko) {
    function MyViewModel() {
        this.acceptedNumericValue = ko.observable(123);
        this.lastInputWasValid = ko.observable(true);
        this.attemptedValue = ko.pureComputed({
            read: this.acceptedNumericValue,
            write: function (value) {
                if (isNaN(value))
                    this.lastInputWasValid(false);
                else {
                    this.lastInputWasValid(true);
                    this.acceptedNumericValue(value); // Write to underlying storage
                }
            },
            owner: this
        });
    }
    ko.applyBindings(new MyViewModel());
});