# 数据绑定

## 文本绑定
1. visible绑定
2. text绑定
3. html绑定
4. css绑定
5. style绑定
6. attr绑定


### 可见文本绑定（visible）
使用visible绑定，来控制DOM元素的可见或隐藏

    <div data-bind="visible: shouldShowMessage">
    You will see this message only when "shouldShowMessage" holds a true value.
    </div>
    
    <script type="text/javascript">
        var viewModel = {
            shouldShowMessage: ko.observable(true) // Message initially visible
        };
        viewModel.shouldShowMessage(false); // ... now it's hidden
        viewModel.shouldShowMessage(true); // ... now it's visible again
    </script>

参数：
当参数解析为假（例如，布尔值false，或数字值0，或者null，或undefined），则当前元素隐藏，如同CSS样式中display:none。  
当参数解析为真（例如，布尔值true，或者一个非null对象或序列）中，使其成为可见的。 

使用函数和表达式来控制元素的可见性  
还可以使用JavaScript函数或任意JavaScript表达式作为参数值，KO将运行函数/表达式，并使用结果来确定是否隐藏元素。

    <div data-bind="visible: myValues().length > 0">
    You will see this message only when 'myValues' has at least one member.
    </div>
    
    <script type="text/javascript">
        var viewModel = {
            myValues: ko.observableArray([]) // Initially empty, so message hidden
        };
        viewModel.myValues.push("some value"); // Now visible
    </script>


### 文本绑定(text)
使用text绑定到相关的DOM,以显示视图模型属性的值.可用于任何DOM元素上

    Today's message is: <span data-bind="text: myMessage"></span>
 
    <script type="text/javascript">
        var viewModel = {
            myMessage: ko.observable() // Initially blank
        };
        viewModel.myMessage("Hello, world!"); // Text appears
    </script>


使用函数和表达式来作为文本值
例如：

    The item is <span data-bind="text: priceRating"></span> today.
    
    <script type="text/javascript">
        var viewModel = {
            price: ko.observable(24.95)
        };
        viewModel.priceRating = ko.pureComputed(function() {
            return this.price() > 50 ? "expensive" : "affordable";
        }, viewModel);
    </script>

也可以写为如下等同格式：

    The item is <span data-bind="text: price() > 50 ? 'expensive' : 'affordable'"></span> today.


html编码  
在给视图属性赋值时，默认KO是进行html编码的。即：如果赋值的是带有DOM标记或者JS脚本的值，一律会原封不动的显示。不会造成安全隐患或脚本注入等情况。

例如:

    viewModel.myMessage("<i>Hello, world!</i>");
    //只会显示<i>Hello,workld!</i>，而不是斜体文本hello world

使用无容器的text绑定  
在某些情况下，可能不允许在UI中加入新的dom元素作为KO的text绑定容器，比如

    <select data-bind="foreach: items">
        <option>Item <span data-bind="text: name"></span></option>
    </select>

在这种情况中，可以使用ko自带的无容器绑定写法：<!--ko--> 和 <!--/ko-->，使用这种写法，ko会虚拟出一个容器元素作为绑定使用。

    <select data-bind="foreach: items">
        <option>Item <!--ko text: name--><!--/ko--></option>
    </select>

### html绑定
绑定方式主要是用于显示html玄关的DOM元素，具体就是将包含HTML元素的视图模型属性渲染到UI上  
例如：

    <div data-bind="html: details"></div>
    
    <script type="text/javascript">
        var viewModel = {
            details: ko.observable() // Initially blank
        };
        viewModel.details("<em>For further details, view the report <a href='report.html'>here</a>.</em>"); // HTML content appears
    </script>

注：这种方式要注意的是脚本注入攻击，切勿将该方式用于用户输入。


### css绑定
主要用于对DOM元素的CSS类添加或删除

静态例子：

    <div data-bind="css: { profitWarning: currentProfit() < 0 }">
    Profit Information
    </div>
    
    <script type="text/javascript">
        var viewModel = {
            currentProfit: ko.observable(150000) // Positive value, so initially we don't apply the "profitWarning" class
        };
        viewModel.currentProfit(-50); // Causes the "profitWarning" class to be applied
    </script>

动态例子：

    <div data-bind="css: profitStatus">
    Profit Information
    </div>
    
    <script type="text/javascript">
        var viewModel = {
            currentProfit: ko.observable(150000)
        };
    
        // Evalutes to a positive value, so initially we apply the "profitPositive" class
        viewModel.profitStatus = ko.pureComputed(function() {
            return this.currentProfit() < 0 ? "profitWarning" : "profitPositive";
        }, viewModel);
    
        // Causes the "profitPositive" class to be removed and "profitWarning" class to be added
        viewModel.currentProfit(-50);
    </script>

多个绑定：

    <div data-bind="css: { profitWarning: currentProfit() < 0, majorHighlight: isSevere }">

    <div data-bind="css: { profitWarning: currentProfit() < 0, 'major highlight': isSevere }">

注： 

    <div data-bind="css: { 'my-class': someValue }">...</div>
    这种带有 ’-‘的要添加引号使其成为能识别的css绑定部分

###　style绑定
style绑定与CSS绑定类似，只是style绑定是添加或删除一个或多个元素样式

    <div data-bind="style: { color: currentProfit() < 0 ? 'red' : 'black' }">
    Profit Information
    </div>
    
    <script type="text/javascript">
        var viewModel = {
            currentProfit: ko.observable(150000) // Positive value, so initially black
        };
        viewModel.currentProfit(-50); // Causes the DIV's contents to go red
    </script>

多个style绑定

    <div data-bind="style: { color: currentProfit() < 0 ? 'red' : 'black', fontWeight: isSevere() ? 'bold' : '' }">...</div>

如果视图模型属性是一个监控属性类型(observable)，那么之后的style绑定将根据模型属性的值变化而变化，如果你的视图模型属性不是一个监控属性，那只有第一次运行会变化，之后将不会改变。

注意：

如果需要绑定一些style，例如font-weight或者text-decoration
不要写成这样 { font-weight: someValue }; 要写成这样{ fontWeight: someValue }
不要写成这样 { text-decoration: someValue }; 要写成这样{ textDecoration: someValue }
和vue,react写法基本一致

### attr绑定
目的：attr绑定主要是为了通过KO设置元素的值，比如img标签的src值，a标签的href值和title值

    <a data-bind="attr: { href: url, title: details }">
        Report
    </a>
    
    <script type="text/javascript">
        var viewModel = {
            url: ko.observable("year-end.html"),
            details: ko.observable("Report including final year-end statistics")
        };
    </script>

    <div data-bind="attr: { 'data-something': someValue }">...</div>
    // 因为data-something是KO中不合法的标识名称。最简单的方法是用引号括住

## foreach 绑定
foreach绑定主要用于循环展示监控数组属性中的每一个元素，一般用于table标签中  
假设你有一个监控属性数组，每当您添加，删除或重新排序数组项时，绑定将有效地更新UI的DOM-插入或去除相关项目或重新排序现有的DOM元素，不影响任何其他的DOM元素。  
当然，也可以配合其他控制流一起适用，例如if和with。  

实例见页面中sample6,sample7

### 使用$data 
当需要引用监控属性数组本身的时候可以使用这个特殊的上下文$data，它所指的就是监控属性数组的本身

    <ul data-bind="foreach: months">
        <li>
            The current item is: <b data-bind="text: $data"></b>
        </li>
    </ul>
    
    <script type="text/javascript">
        ko.applyBindings({
            months: [ 'Jan', 'Feb', 'Mar', 'etc' ]
        });
    </script>
如果需要的话，也可使用$data来引用监控数组属性的项目，例如：  

    <td data-bind="text: $data.firstName"></td>

其实这是多此一举的。因为firstName的默认前缀就是$data，所以一般可以省略不写。

### 使用$index $parent和其他上下文标记

$index 相当于循环中的index
$parent 所代表的是在foreach绑定循环外的某个绑定属性

    <h1 data-bind="text: blogPostTitle"></h1>
    <ul data-bind="foreach: likes">
        <li>
            <b data-bind="text: name"></b> likes the blog post <b data-bind="text: $parent.blogPostTitle"></b>
        </li>
    </ul>

### 使用'as'给foreach绑定项目起别名
在‘使用$data’中，使用$data.varibale的方式访问的监控属性数组的项目，但在有些时候你可以需要给这些项目起个别名，那就是可以使用as，例如：

    <ul data-bind="foreach: { data: people, as: 'person' }"></ul>
现在，只要在foreach循环中，使用person，就可以访问数组中的元素了。  
嵌套的例子：  

    <ul data-bind="foreach: { data: categories, as: 'category' }">
        <li>
            <ul data-bind="foreach: { data: items, as: 'item' }">
                <li>
                    <span data-bind="text: category.name"></span>:
                    <span data-bind="text: item"></span>
                </li>
            </ul>
        </li>
    </ul>
    
    <script>
        var viewModel = {
            categories: ko.observableArray([
                { name: 'Fruit', items: [ 'Apple', 'Orange', 'Banana' ] },
                { name: 'Vegetables', items: [ 'Celery', 'Corn', 'Spinach' ] }
            ])
        };
        ko.applyBindings(viewModel);
    </script>

### 不使用foreach容器并生产内容
在某些情况下，可能需要复制容器标签的内容，例如生成如下DOM：

    <ul>
        <li class="header">Header item</li>
        <!-- The following are generated dynamically from an array -->
        <li>Item A</li>
        <li>Item B</li>
        <li>Item C</li>
    </ul>
像这种情况，我们就无法在ul标签中使用foreach绑定，解决这个问题的方法就是使用无容器的foreach绑定：

    <ul>
        <li class="header">Header item</li>
        <!-- ko foreach: myItems -->
            <li>Item <span data-bind="text: $data"></span></li>
        <!-- /ko -->
    </ul>
    
    <script type="text/javascript">
        ko.applyBindings({
            myItems: [ 'A', 'B', 'C' ]
        });
    </script>
这里使用虚拟元素容器，<!-- ko -->和<!-- /ko -->。就想之前章节提到的虚拟绑定一样。

### 检测并处理数组变化
当您修改模型数组的内容（通过添加，移动或删除其项），在foreach绑定使用一个有效的差分算法计算方法当出发生了什么变化的时候。

1. 当您添加数组项，foreach会使您的模板的新副本，并将其插入到现有的DOM  
2. 当你删除数组项，foreach将直接删除相应的DOM元素  
3. 当你重新排序数组项（保持相同的对象实例），foreach通常只要将相应的DOM元素融入自己的新位置 

### 销毁项目
有时你可能想为数据项目做删除标记，但实际上并不真正删除该项目。这种方式被称为非破坏性的删除。

默认情况下，foreach绑定将跳过（即隐藏）标记为删除任何数组项。如果你想显示这些项目，使用includeDestroyed选项。例如，

    <div data-bind='foreach: { data: myArray, includeDestroyed: true }'>
        ...
    </div>

### 使用动画过渡，提高用户体验
如果您需要在生成的DOM元素运行一些定制逻辑，你可以使用afterRender/ afterAdd/beforeRemove/ beforeMove/ afterMove这些回调函数。

下面是一个使用afterAdd的一个简单的例子，应用经典的“黄色淡出”的效果，以新增项目。它需要的jQuery插件的颜色，使背景色彩的动画。

    <ul data-bind="foreach: { data: myItems, afterAdd: yellowFadeIn }">
        <li data-bind="text: $data"></li>
    </ul>
    
    <button data-bind="click: addItem">Add</button>
    
    <script type="text/javascript">
        ko.applyBindings({
            myItems: ko.observableArray([ 'A', 'B', 'C' ]),
            yellowFadeIn: function(element, index, data) {
                $(element).filter("li")
                        .animate({ backgroundColor: 'yellow' }, 200)
                        .animate({ backgroundColor: 'white' }, 800);
            },
            addItem: function() { this.myItems.push('New item'); }
        });
    </script>

### 细节内容
1. afterRender-当foreach第一次初始化执行的回调函数。KO提供下列参数回调：

* 插入的DOM元素的数组
* 数据项
2. afterAdd-当foreach添加新项目后的回调函数。KO提供下列参数回调：

* DOM节点
* 添加的数组元素的索引
* 添加的数组元素
3. beforeRemove-当一个数组项已被删除的回调函数。这里最明显的用jQuery的$(domNode).fadeOut()动画去除相应的DOM节点。KO提供下列参数回调：

* 删除一个DOM节点
* 被删除的数组元素的索引
* 删除的数组元素
4. beforeMove-当一个数组项在数组中已经改变了位置的回调函数，但之前相应的DOM节点已被移动。需要注意的是beforeMove适用于所有的数组元素的指标发生了变化，因此，如果你在一个数组的开头插入一个新的项目，然后回调（如果指定）将触发所有其他元素，因为它们的索引位置增加了一个。您可以使用beforeMove存储在受影响元素的原始屏幕坐标，这样你可以在afterMove回调动画动作。KO提供下列参数回调：

* 可能是移动的DOM节点
* 移动的数组元素的索引
* 移动的数组元素
5. afterMove-数组项在数组中已经改变位置的回调函数，KO提供下列参数回调：

* 可能已经移动的DOM节点
* 移动的数组元素的索引
* 移动的数组元素


## if绑定
if绑定一般是格式是data-bind=if:attribute,if后所跟属性或表达式的值应为bool值(也可以是非bool值，当非空字符串时则为真)，if绑定的作用与visible绑定的作用类似。可控制DOM的显示与隐藏，不一样的地方是，if绑定是物理删除或添加DOM元素。

例１：　展示IF绑定的动态删除添加DOM  

    <label>
        <input type="checkbox" data-bind="checked: displayMessage" />Display Message
    </label>

    <div data-bind="if: displayMessage">Here is a message</div>

    <script>
    ko.applyBindings({
        displayMessage: ko.observable(false)
    })
    </script>

例２：　　通过foreach绑定循环planets监控属性数组，其中name为Mercury的项目中capital为null，则循环中该项目只显示其name.

    <ul data-bind="foreach: planets">
        <li>
            Planet: <b data-bind="text: name"></b>
            <div data-bind="if: capital">
                Capital: <b data-bind="test: capital.cityName"></b>
            </div>
        </li>
    </ul>

    <script>
        ko.applyBindings({
            planets:[
                {name: 'Mercury', capital: null},
                {name: 'Earth', capital: { cityName: 'Barnsley'}}
            ]
        })
    </script>

##### 注使用无容器的if绑定（if虚拟绑定）
像之前的虚拟绑定一样，同样使用<!-- ko -->和<!-- /ko -->进行。虚拟绑定适用于不改变UI元素的情况。

    <ul>
        <li>This item always appears</li>
        <!-- ko if: someExpressionGoesHere -->
            <li>I want to make this item present/absent dynamically</li>
        <!-- /ko -->
    </ul>

### ifnot绑定
ifnot绑定是if绑定的逆向表达，格式与if绑定一样，只是判断结果与if整好相反。就像等于和不等于一样。例如：

    <div data-bind="ifnot: someProperty">...</div>
其等效写法为：

    <div data-bind="if: !someProperty()">...</div>
有人会说使用if绑定是足够了。为毛还要ifnot绑定。原因是有很多强迫症患者喜欢这种ifnot的绑定方式，看起来更易懂，代码更整洁。