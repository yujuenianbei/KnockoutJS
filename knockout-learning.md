# knockout.js 使用教程

## mvvm
1. 模型：应用程序存储的数据
2. 视图抹型：ui上的数据呈现和操作后的数据暂存的表示
3. 视图：用户互动界面

使用ko是图是简单的声明绑定到其他视图模型的html文档。也可使用视图模型的数据生成html模板

### 激活绑定关系

    js：创建对象
    var myViewModel = { 
        personName: 'Bob', 
        personAge: 123 
    };

    html：视图中绑定此模型
    The name is <span data-bind="text: personName"></span>

data-bind 属性进行数据绑定当然浏览器在添加这个是时候病不知道意味着什么，所以还要激活KO的板顶关系使之生效。所以在script模块中添加一行代码

    ko.applyBindings(myViewModel)

    html中显示
    The name is <span>Bob</span>

ko.applyBindings的参数

第一个参数是要告诉KO，你要绑定的视图模型是那个。

你可以传递第二个参数是定义要搜索该文档的那一部分data-bind属性。例如，ko.applyBindings(myViewModel, document.getElementById('someElementId'))。这限制激活绑定视图模型的范围在HTML元素的ID元素为someElementId及其子元素，如果你想有多个视图模型的激活绑定或者每个页面的不同区域进行模型绑定的话这种方式是很有用的。


### 监控（observable）
相当与vue的watch 负责监控属性的变化从而进行视图的变化 observable为特殊的js对象，可将变更通知用户，并能自动检测依赖关系

    var myViewModel = { 
        personName: ko.observable('Bob'), 
        personAge: ko.observable(123) 
    };

视图模型属性值发生变化时会自动更新UI中的data-bind绑定的属性。同理UI中绑定属性发生变化时也会自动同步到视图模型中

### 读写监控属性

1. 读取监控属性的当前值，只需调用视图模型属性的无参数方法  
即：myViewModel.personName()返回'Bob'，myViewModel.personAge()返回123

2. 赋值一个新值到监控属性，只需调用视图模型属性的有参数方法，将值作为参数传递。  
即：调用myViewModel.personName('Mary')将更改名称值'Mary'

3. 将值写入多个监控属性的模型对象，你可以使用链式语法。例如，myViewModel.personName('Mary').personAge(50)将更改名称值和年龄值为'Mary' 50

KO将可以监控监控属性，当你写data-bind="text: personName"时，text结合自身注册时得到通知personName的变化。

当您更改名称值'Mary'调用myViewModel.personName('Mary')时，text绑定会自动更新相关的DOM元素的文本内容。


### 声明监控
使用订阅通知进行变化监控

### 强行监控属性实时通知用户
当赋值一个包含原始值（number，string,boolean,null）监控属性，使用内置的notified，以确保一个观测监控属性的用户总能得到通知，即使该值是相同的

    myViewModel.personName.extend({ notify: 'always' });

### 延缓或抑制更改通知
通常情况下，监控属性值改变会立即通知其用户。但是，如果一个监控属性频繁更新会带来高昂的数据传输代价，你可以通过限制或延迟变更通知获得更好的性能。这是通过使用rateLimit增量实现：

    // Ensure it notifies about changes no more than once per 50-millisecond period 

    myViewModel.personName.extend({ rateLimit: 50 });


## 监控属性数组
如果要对一个序列检测并监控变化，需要使用observableArray(监控属性数组)。这在你显示或编辑多个值，需要用户界面的部分反复出现和消失的项目并且具有添加和删除操作的情况下使用observableArray。  
声明和赋值：

    var myObservableArray = ko.observableArray(); // Initially an empty array 
    myObservableArray.push('Some value'); // Adds the value and notifies observers

使用方法：
视图代码：

    <form data-bind="submit: addItem"> 
        New item: 
        <input data-bind='value: itemToAdd, valueUpdate: "afterkeydown"' /> 
        <button type="submit" data-bind="enable: itemToAdd().length > 0">Add</button> 
        <p>Your items:</p> 
        <select multiple="multiple" width="50" data-bind="options: items"> </select> 
    </form>

视图模型代码：

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
    ko.applyBindings(new SimpleListModel(["Alpha", "Beta", "Gamma"]));

### 初始化observArray
可通过以下方法进行初始化

    // This observable array initially contains three objects 
    var anotherObservableArray = ko.observableArray([ 
        { name: "Bungle", type: "Bear" }, 
        { name: "George", type: "Hippo" }, 
        { name: "Zippy", type: "Unknown" } 
    ]);

### 从observableArray读取信息
在后台，一个observableArray实际上是一个监控属性，它的值是一个数组。
KO的observableArray有它自己的功能函数，而且用起来更加的方便：

1. 在目标浏览器。（例如，本地JavaScript indexOf函数不能在IE 8工作或较早，但KO的indexOf可以兼容任何版本的浏览器。）
2. 对于修改数组的内容，如函数push和splice，可以让所有注册的侦听器通知更改，你的用户界面会自动更新KO的依赖跟踪机制所定义的对象。
3. 语法是更方便。要调用KO的push方式，只需要写myObservableArray.push(...)。这比调用底层Javascript写方法myObservableArray().push(...)更加方便

### observableArray数组操作
1. 索引indexOf  
返回等于参数第一个数组元素的索引,比如myObservableArray.indexOf('Blah')将返回第一个数组条目等于从零开始的索引Blah，若没有则返回-1

2. 数组片段  
slice与js中的slice函数是等价的即调用myObservableArray.slice(...)与myObservableArray().slice(...)等效

3. 所有数组操作都等同于运行底层js数组函数
push（value） 增加了一个新的项目在数组末尾  
pop() 移除数组的最后一个值,并返回它  
unshift(value) 在数组开头插入一个熄灯呢项目  
shift() 移除数组的第一个值并返回  
reverse)() 反转数组的顺序并返回observableArray  
sort() 排序数组内容并返回observableArray  
    。默认的排序是按字母顺序，但你可以选择传递一个参数来控制阵列如何进行排序。你的函数应该接受来自数组的任意两个对象，如果第一个参数为较小返回一个负值，正值是第二较小，或为零它们视为相等。例如，排序按姓氏'人'对象的数组，你可以写myObservableArray.sort(function (left, right) { return left.lastName == right.lastName ? 0 : (left.lastName < right.lastName ? -1 : 1) })  
splice() 删除并返回从一个给定的索引起始原件的给定数目.例如,myObservableArray.splice(1, 3)将删除索引位置1（即第二，第三和第四个元素）开始三个元素，并返回它们作为一个数组。

有关observableArray函数可以参考js的数组函数

4. 删除和删除全部
observableArray的补充方法：  
remove(songitem) 移除等于someitem值的元素并返回他们作为一个数组  
remove(function(item){return item.dage<18}) 删除其所有的值小于18的元素，将他们作为一个数组  
removeAll(['chad',123,undefined]) 移除所有等于'chad'或123或undefined的元素，并返回他们作为一个数组
removeAll() 删除所有值并返回他们作为一个数组

5. 销毁destroyAll  ruby常用
destroy(someitem) 查找值等于someitem数组中的任何元素，并为特殊的属性_destroy赋值true
destroy( function (someItem) { return someItem.age < 18; } )-在数组中查找任何对象age小于18的元素，并为特殊的属性_destroy赋值true。  
destroyAll( ['Chad', 132, undefined] )-找到数组中所有等于'Chad'或123或undefined的元素，并为特殊的属性_destroy赋值true。  
destroyAll()-对数组中所有对象的特殊的属性_destroy赋值true。  

那么，这是什么_destroy东西一回事呢？Rails开发者。在Rails中的约定是，当你传递到一个动作或一个JSON对象，该框架可以自动将其转换为一个ActiveRecord对象，然后将其保存到数据库中。它知道它的对象都已经在你的数据库，并发出正确的INSERT或UPDATE语句。告诉框架删除一条记录，你只是将_destroy标记设置为true。

请注意，当KO呈现一个foreach具有约束性，它会自动隐藏标记用任何元素的_destroy。所以，你可以有某种"删除"按钮调用该destroy(someItem)方法在数组上，这将立即引起指定的项目，从UI消失。后来，当您提交Rails的JSON对象，该项目也将被从数据库中删除。

### 延缓和/或抑制更改通知
和对象的基本一致

    // Ensure it notifies about changes no more than once per 50-millisecond period 
    myViewModel.myObservableArray.extend({ rateLimit: 50 });


## 计算控制属性
如果有一个监控属性firstName和另一个lastName，要显示全名的话可以使用计算监控属性来实现。它依赖于一个或多个其他监控属性，每当这些依赖关系的监控属性改变时。将会自动更新计算监控属性。

    function AppViewModel() {
        this.firstName = ko.observable('Bob');
        this.lastName = ko.observable('Smith');
        this.fullName = ko.computed(function() {
            return this.firstName() + " " + this.lastName();
        }, this);
    }

    然后将计算监控属性绑定到UI上
    The name is <span data-bind="text: fullName"></span>

    此处的fullname会根据firstname和lastname的改变而改变

### 管理 this 关键字
ko.computed通过定义的this调用视图模型中的其他监控属性

其中一种流行的方式是，将this关键字赋值给一个JS变量，比如var self，然后使用self调用整个视图模型的监控属性
    
    function AppViewModel() {
        var self = this;
        self.firstName = ko.observable('Bob');
        self.lastName = ko.observable('Smith');
        self.fullName = ko.computed(function() {
            return self.firstName() + " " + self.lastName();
        });
    }

### 升级版计算监控属性
3.X中新增了pureComputed方法，是在Computed方法的基础上改良而来的。主要作用的是防止内存泄露，其次是减少没有必要的内存开销

    this.fullName = ko.pureComputed(function() {
        return this.firstName() + " " + this.lastName();
    }, this);

### 强制计算监控属性实时通知用户
当赋值一个包含原始值(number,string,bollean,null)监控属性，使用内置的notified，以确保一个观测属性的用户总是得到通知，即使该值是相同的

    myViewModel.fullName = ko.pureComputed(function() {
        return myViewModel.firstName() + " " + myViewModel.lastName();
    }).extend({ notify: 'always' });

### 延缓或抑制更改通知

    // Ensure updates no more than once per 50-millisecond period
    myViewModel.fullName.extend({ rateLimit: 50 });

### 排除计算监控属性

排除一些计算监控属性，防止其送回服务器。可以使用js方法确定哪些属性是计算监控属性，然而KO提供了一个实用函数ko.isComputed以帮助判断哪些是计算监控属性

    for (var prop in myObject) {
        if (myObject.hasOwnProperty(prop) && !ko.isComputed(myObject[prop])) {
            result[prop] = myObject[prop];
        }
    }

除此之外，KO还提供了一些其他很有用的函数：
1. ko.isObservable : 对于所有的observable,observable array,computed observable将返回true；
2. ko.isWritableObservable : 对于所有的observable,observable array,writable computed observable返回true；

### 当计算监控属性只用于UI展示
如果值需要在界面中使用计算监控属性 可以声明：

    function AppViewModel() {
        // ... leave firstName and lastName unchanged ...
    
        this.fullName = function() {
            return this.firstName() + " " + this.lastName();
        };
    }

    调用：
    The name is <span data-bind="text: fullName()"></span>



## 可赋值的计算监控属性
一般情况下使用不到这部分内容  
通常，计算监控属性一般是只读的。可以通过使用自己的回调函数让计算监控属性变为可赋值状态  
可以使用自己定制的逻辑让计算监控属性可写。就像将空属性，可以使用一个模型对象的链接的语法进行赋值，比如myViewModel.fullName('john').age(50)

详细请参考html页面<a href="https://www.cnblogs.com/smallprogram/p/5923235.html">可赋值的计算监控属性</a>


## ko实现依赖追踪

ko自动更新原理：  
1. 声明一个计算监控属性时，ko立即调用其相关的函数来获取其初始值
2. 当相关函数正在运行，ko将建立一个订阅到相关监控属性（包括其他计算监控属性）并读取他们的值。订阅回调函数设置为订阅函数再次运行，循环这个过程
3. 当有新的值，ko会通知你的计算监控属性将值反馈给用户

采用peek控制依赖
peek方法会在不需要创建依赖的情况下控制一个监控属性或者依赖属性

在下面的例子中，依赖属性通过Ajax方法和其他两个监控属性参数来重新加载一个名为currentPageData的监控属性。当pageIndex发生变化时，依赖属性会被更新，但会忽略掉selectedItem的变化，因为它是通过peek方法控制。在这种情况下，用户可能希望仅仅在数据被加载时才使用selectedItem的当前值用于追踪。

    ko.computed(function() {
        var params = {
            page: this.pageIndex(),
            selected: this.selectedItem.peek()
        };
        $.getJSON('/Some/Json/Service', params, this.currentPageData);
    }, this);

如果想阻止监控属性则可以参考延缓或抑制更改通知

## pure computed observables
在PureComputed函数中，随着相关监控属性值发生变化的时候，在两种状态之间切换。
1. 每当它没有值变化的时候，它处于睡眠状态。当进入睡眠状态时，其配置的所有订阅它的依赖。在这种状态下，它不会订阅任何监控属性。如果它被读取，返回的也是睡眠状态的值
2. 每当它的值变化的时候，它处于监听状态。每当进入监听状态，他会立即订阅所有依赖。在这种状态下，它的运作就像一个普通的计算监控属性。

语法：  
pure computed observables:  

    this.fullname = ko.pureComputed(function() {
        return this.firstName() + "" + this.lastName();
    },this);
原始的Computed observables 加上pure参数后的等同写法：  

    this.fullName = ko.computed(function(){
        return this.firstName() + "" + this.lastName();
    },this,{pure: true})

确定一个属性是不是Pure Computed observables  
KO提供了ko.isPureComputed函数，帮助确定监控属性是不是Pure computed observables。  

    var result = {};
    ko.utils.objectForEach(myObject, function (name, value) {
        if (!ko.isComputed(value) || ko.isPureComputed(value)) {
            result[name] = value;
        }
    });















https://www.cnblogs.com/smallprogram/p/5927561.html


Tit@^ic!997
Wang!@#723!@#andong

https://github.com/FelisCatus/SwitchyOmega/releases/download/v2.5.20/SwitchyOmega_Chromium.crx
socket5 192.168.1.101 7070

git 
https://shinetechsoftware.coding.net/p/dockerdemo/git

wangad@shinetechchina.com
wang723andong
