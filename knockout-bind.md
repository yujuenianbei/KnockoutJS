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


## 文本绑定(text)
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

## html绑定
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


## css绑定
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


##　style绑定
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

## attr绑定
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