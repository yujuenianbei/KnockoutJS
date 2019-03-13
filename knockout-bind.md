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

### with绑定
目的:  
格式:  data-bind="with:attribute", 使用with绑定会将其后跟的属性看做一个新的上下文进行绑定。with绑定内部的所有元素将受到该上下文的约束。with可以和if/foreach绑定一起使用

例子： 

    <h1 data-bind="text: city"> </h1>
    <p data-bind="with: coords">
        Latitude: <span data-bind="text: latitude"> </span>,
        Longitude: <span data-bind="text: longitude"> </span>
    </p>

    <script type="text/javascript">
        ko.applyBindings({
            city: "London",
            coords: {
                latitude:  51.5001524,
                longitude: -0.1262362
            }
        });
    </script>
本例中，通过with直接绑定了coords监控属性，并在其内部直接调用了coords监控属性的内部属性。这里就体现了with绑定的特性。


    <form data-bind="submit: getTweets">
        Twitter account:
        <input data-bind="value: twitterName" />
        <button type="submit">Get tweets</button>
    </form>
    
    <div data-bind="with: resultData">
        <h3>Recent tweets fetched at <span data-bind="text: retrievalDate"> </span></h3>
        <ol data-bind="foreach: topTweets">
            <li data-bind="text: text"></li>
        </ol>
    
        <button data-bind="click: $parent.clearResults">Clear tweets</button>
    </div>

    <script>
    function AppViewModel() {
        var self = this;
        self.twitterName = ko.observable('@example');
        self.resultData = ko.observable(); // No initial value
    
        self.getTweets = function() {
            var name = self.twitterName(),
                simulatedResults = [
                    { text: name + ' What a nice day.' },
                    { text: name + ' Building some cool apps.' },
                    { text: name + ' Just saw a famous celebrity eating lard. Yum.' }
                ];
    
            self.resultData({ retrievalDate: new Date(), topTweets: simulatedResults });
        }
    
        self.clearResults = function() {
            self.resultData(undefined);
        }
    }
    
    ko.applyBindings(new AppViewModel());
    </script>
该例子中将使用with绑定动态添加和删除其绑定值为null/undefined或非null/undefined

#### with无容器绑定
像if、foreach等的虚拟绑定一样，with绑定也一样。使用<!-- ko -->和<!-- /ko -->进行。  

    <ul>
        <li>Header Element</li>
        <!-- ko with: outboundFlight -->
            ...
        <!-- /ko -->
        <!-- ko with: inboundFlight -->
            ...
        <!-- /ko -->
    </ul>


### component绑定
例子:  

    <h4>First instance, without parameters</h4>
    <div data-bind='component: "message-editor"'></div>
    
    <h4>Second instance, passing parameters</h4>
    <div data-bind='component: {
        name: "message-editor",
        params: { initialText: "Hello, world!" }
    }'></div>

    <script>
    ko.components.register('message-editor', {
        viewModel: function(params) {
            this.text = ko.observable(params && params.initialText || '');
        },
        template: 'Message: <input data-bind="value: text" /> '
                + '(length: <span data-bind="text: text().length"></span>)'
    });
    
    ko.applyBindings();
    </script>
这只是一个非常简单的例子，在开发中，一般都是将View Model和Template写成单独外部文件，然后通过ko的components.register方法注册他们，在以后的KO高级应用系列中将会进一步讲解。

API  
1. 快速语法：  
只传递一个字符串作为组件名称，不用任何参数

        <div data-bind='component: "my-component"'></div>
如果觉得死板，可以传递一个监控属性，用其值作为组件名称。待以后组件名变化的时候，直接修改监控属性值即可。

    <div data-bind="component: observableWhoseValueIsAComponentName"></div>

2. 完整语法
提供完整的组件参数，参数如下：
* name - 注入组件的名称。可使用字符串或是监控属性
* params - 一组参数对象。通常，这是一个包含多个参数的键值对

        <div data-bind="component: {
            name: "shopping-cart",
            params: { mode: "detail-list", items: productsList}
        }"></div>

备注1  
仅模板式的component  
通常的component绑定具有ViewModel和Template,但是这并不是必须的有些时候一个component可能只包含一个Template

    ko.components.register('special-offer', {
        template: '<div class="offer-box" data-bind="text: productName"></div>'
    })

可以使用注入的方式，将视图模型注入给Template:

    <div data-bind='component: {
        name: "special-offer-callout",
        params: { productName: someProduct,name}
    }'></div>
或者使用客户元素（高级章节使用）进行注入视图模型

    <special-offer params='productName: someProduct.name'></special-offer>
备注2  
component虚拟绑定  
如同之前章节的虚拟绑定一样，同样是使用<!-- ko -->和<!-- /ko -->这种方式实现虚拟绑定，来达到不更改DOM元素的目的

    <!-- ko component: "message.editor" -->
    <!-- /ko -->
传参

    <!-- ko component: {
        name: "message-editor",
        params: { initalText: "hello world!", otherPara: 123 }
    } -->

备注3  
传递标记到component绑定  

    <div data-bind="component: {
        name: 'my-special-list',
        params: { items:someArrayOfPeople }
    }">
    The person <em data-bind="text: name"></em>
    is <em data-bind="text: age"></em>years old
    </div>
如上例子中，既有component绑定，也有一些DOM元素，当绑定后，my-special-list组件将会和这些DOM元素组成一个新的UI界面。


### click 绑定
例子：  

    <div>
        you have clicked<span data-bind="text: numberOfClicks"></span>Times
        <button data-bind="click: incrementClickCounter">click me</button>
    </div>

    <script type="text/javascript">
        var viewModel = {
            numberOfClicks : ko.observable(0),
            incrementClickCounter : function() {
                var previousCount = this.numberOfClicks();
                this.numberOfClicks(previousCount + 1);
            }
        };
    </script>

备注1:  
传递一个参数  

    <ul data-bind="foreach: places">
        <li>
            <span data-bind="text: $data"></span>
            <button data-bind="click: $parent.removePlace">Remove</button>
        </li>
    </ul>
    
    <script type="text/javascript">
        function MyViewModel() {
            var self = this;
            self.places = ko.observableArray(['London', 'Paris', 'Tokyo']);
    
            // The current item will be passed as the first parameter, so we know which place to remove
            self.removePlace = function(place) {
                self.places.remove(place)
            }
        }
        ko.applyBindings(new MyViewModel());
    </script>
当点击remove时只会删除当前的项目，从源码上看，说明传递的是当前项目。这种在渲染集合数据的时候特别有用。  
需要注意两点：  

* <span style="color: #ff4400">如果你是一个嵌套在绑定上下文，例如，如果使用foreach或with绑定，但你的处理函数是根视图模型或其他一些父模型，你需要使用一个前缀，如$parent或$root定位处理函数。  </span>
* <span style="color: #ff4400">在您的视图模型，但是这是可以使用self（或其他一些变量）作为this的一个别名。</span>

备注2  
传递事件对象（多参数）  

    <button data-bind="click: myFunction">
        Click me
    </button>
    
    <script type="text/javascript">
        var viewModel = {
            myFunction: function(data, event) {
                if (event.shiftKey) {
                    //do something different when user has shift key down
                } else {
                    //do normal action
                }
            }
        };
        ko.applyBindings(viewModel);
    </script>

如果要传递更多的参数，可以时用函数文本的方式

    <button data-bind="click: function(data, event) {myFunction('param1', 'param2', 'param3', data, event)}">
        Click me
    </button>
还有更优雅的写法（优雅个毛线），使用bind函数绑定多个参数

    <button data-bind="click: myFunction.bind($data, 'param1', 'param2')">
        Click me
    </button>

备注3  
允许默认点击动作
默认情况下，Ko会阻止任何默认动作。比如你把click绑定到一个a标签上，当点击时，浏览器会调用click绑定的回调函数。但是不会执行href的连接跳转。

如果你不希望这种默认的阻止动作。可以在回调函数中返回true。

备注4  
防止冒泡事件  
默认情况下，KO允许click绑定继续到任何高级别的事件处理。例如，父元素和子元素都有click绑定，那么这两个元素的click绑定会都被触发。
可以使用一个附加绑定clickBubble来解决该问题：

    <div data-bind="click: myDivHandler">
        <button data-bind="click: myButtonHandler, clickBubble: false">
            Click me
        </button>
    </div>
如上述例子，myButtonHandler将被调用，而附件绑定clickBubble，并设置了false，这至使父元素的myDivHandler不会被调用。

备注5：  
与Jquery互动  
如果存在Jquery的click事件，KO将会去调用Jquery的click事件，如果你想总是使用自己本地的事件来处理，可以在ko.applyBindings中加入如下代码：

    ko.options.useOnlyNativeEvents = true;

### event绑定
event绑定即为事件绑定，即当触发相关DOM事件的时候回调函数。例如keypress，mouseover或者mouseout等  

    <div>
        <div data-bind="event: { mouseover: enableDetails, mouseout: disableDetails }">
            Mouse over me
        </div>
        <div data-bind="visible: detailsEnabled">
            Details
        </div>
    </div>
    
    <script type="text/javascript">
        var viewModel = {
            detailsEnabled: ko.observable(false),
            enableDetails: function() {
                this.detailsEnabled(true);
            },
            disableDetails: function() {
                this.detailsEnabled(false);
            }
        };
        ko.applyBindings(viewModel);
    </script>

如上述例子，当鼠标指针移入或者移出Mouse over me时，对于detailsEnabled的值设定true或者false。进而控制Details的显示和隐藏。  
和click一样，event后边所跟的格式一般为：event { mouseover: someObject.someFunction }，其中的回调函数并不一定非要是视图模型的函数，他可以时任何对象的函数。

备注1：  
传递一个当前项目作为参数
    <ul data-bind="foreach: places">
        <li data-bind="text: $data, event: { mouseover: $parent.logMouseOver }"> </li>
    </ul>
    <p>You seem to be interested in: <span data-bind="text: lastInterest"> </span></p>
    
    <script type="text/javascript">
        function MyViewModel() {
            var self = this;
            self.lastInterest = ko.observable();
            self.places = ko.observableArray(['London', 'Paris', 'Tokyo']);
    
            // The current item will be passed as the first parameter, so we know which place was hovered over
            self.logMouseOver = function(place) {
                self.lastInterest(place);
            }
        }
        ko.applyBindings(new MyViewModel());
    </script>
需要注意，如果你使用的是嵌套绑定上下文，比如foreach或者with，而需要处理的回调函数在视图模型中或者在父模型中，需要使用$parent或者$root前缀来进行绑定

与click绑定一样，给this取个别名比较好。

备注2：  
传递多个参数  

    <div data-bind="event: { mouseover: myFunction }">
        Mouse over me
    </div>
    
    <script type="text/javascript">
        var viewModel = {
            myFunction: function(data, event) {
                if (event.shiftKey) {
                    //do something different when user has shift key down
                } else {
                    //do normal action
                }
            }
        };
        ko.applyBindings(viewModel);
    </script>
封装多参数示例：

    <div data-bind="event: { mouseover: function(data, event) { myFunction('param1', 'param2', data, event) } }">
        Mouse over me
    </div>

使用bind函数示例：  

    <button data-bind="event: { mouseover: myFunction.bind($data, 'param1', 'param2') }">
        Click me
    </button>

备注3：  
允许默认动作  
同click绑定一样，ko禁止默认动作，比如你将event的keypress事件绑定到一个Input元素上，那这个input元素输入的值将会被keypress回调占用而无法输入任何信息。解决方案很简单，就是在回调函数中返回true即可。

备注4：  
防止冒泡事件  
如果要防止冒泡事件，可以直接在事件绑定后附加一个youreventBubble绑定。将该附加绑定设置为false则禁止冒泡事件的发生，例如：

    <div data-bind="event: { mouseover: myDivHandler }">
        <button data-bind="event: { mouseover: myButtonHandler }, mouseoverBubble: false">
            Click me
        </button>
    </div>

### submit绑定目的
submit绑定即为提交绑定，通常用于form元素。这种绑定方式会打断默认的提交至服务器的操作。转而提交到你设定好的提交绑定回调函数中。如果要打破这个默认规则，只需要在回调函数中返回true即可。  

    <form data-bind="submit: doSomething">
        ... form contents go here ...
        <button type="submit">Submit</button>
    </form>
    
    <script type="text/javascript">
        var viewModel = {
            doSomething : function(formElement) {
                // ... now do something
            }
        };
    </script>
在回调函数中，你可以做很多事情，比如前端数据验证if ($(formElement).valid()) { /* do something */ }。等等

### enable绑定目的  disable
enable绑定主要用于DOM元素的启用禁用状态，通常用于input,select或者textarea。  

    <p>
        <input type='checkbox' data-bind="checked: hasCellphone" />
        I have a cellphone
    </p>
    <p>
        Your cellphone number:
        <input type='text' data-bind="value: cellphoneNumber, enable: hasCellphone" />
    </p>
    
    <script type="text/javascript">
        var viewModel = {
            hasCellphone : ko.observable(false),
            cellphoneNumber: ""
        };
    </script>


    <!-- 获取form数据 -->
    <form data-bind="submit:showValue">
        <input type="text" value="123" name="test"/>
        <input type="submit" value="submit"/>
    </form>

    showValue:function (formdata) {
        alert(formdata.test.value);
    }

### value绑定
value绑定主要用于DOM元素给视图模型赋值用的。通常用于( input select textarea )等元素。

value绑定与text绑定的区别在于，value绑定中当用户编辑表单控件相关值的时候，值会自动更新视图模型的相关属性值，当视图模型的相关属性值被更新后，表单中相关的value绑定也会随之变化。

value绑定就像DOM和ViewModel的一个双向通道。而text绑定只是ViewModel到DOM的单向通道。

    <p>Login name: <input data-bind="value: userName" /></p>
    <p>Password: <input type="password" data-bind="value: userPassword" /></p>
    
    <script type="text/javascript">
        var viewModel = {
            userName: ko.observable(""),        // Initially blank
            userPassword: ko.observable("abc"), // Prepopulate
        };
    </script>

主要技术细节：

1. KO将会使用初始值设置value绑定的元素。当有新的值的时候，初始值将被覆盖  
2. 如果value绑定的是监控属性，那么之后的属性值更新就会被体现在DOM的value绑定上，如果不是监控属性，则只有第一次运行会更新DOM上的value绑定的值，之后就不会再变了。  
3. 如果你的value绑定不是数值型或字符型数据(例如一个对象或数组)，那显示的文本内容将等同于yourParameter.toString()。最好还是绑定值型或字符型数据。
4. 当用户编辑表单控件修改基于value绑定的元素值并移出焦点后，KO就会自动更新对应的视图模型的属性值，你也可以通过使用valueUpdate事件来控制。

其他技术细节：

1. valueUpdate，KO定义了一系列的change事件，最常用包括如下事件：
* "input"-input或textarea元素的变化更新您的视图模型时的值。
* "keyup" - 当用户释放某个键更新您的视图模型
* "keypress"-当用户输入一个值更新您的视图模型。不像keyup，这个会反复更新
* "afterkeydown"-当用户开始输入一个字符尽快更新您的视图模型。这通过捕获浏览器的keydown事件，并异步处理该事件。这个事件在一些移动客户端可能不会起什么作用。
2. valueAllowUnset，适用于select的value绑定，其他元素不起作用，具体请参考之后的备注2.

备注1：实时更新
如果你想要实时更新input或者textarea到你的视图模型，可以使用textInput绑定。具体的textInput细节将在之后的章节提到。

备注2：下拉列表select的绑定
KO在下拉列表绑定中，需要使用value绑定和options绑定(options绑定将在以后的章节中提到)。  
使用valueAllowUnset与select元素  

    <p>
        Select a country:
        <select data-bind="options: countries,
                        optionsCaption: 'Choose one...',
                        value: selectedCountry,
                        valueAllowUnset: true"></select>
    </p>
    
    <script type="text/javascript">
        var viewModel = {
            countries: ['Japan', 'Bolivia', 'New Zealand'],
            selectedCountry: ko.observable('Latvia')
        };
    </script>

有很多时候，我们希望下拉列表中包含一个空白的或者没有包含在数据集合中的元素，比如choose one…，那么就可以使用valueAllowUnset:true来带到目的。如上述例子一样。

selectedCountry将保留Latvia，并将下拉列表中空白匹配给它。

备注3：绑定监控属性和非监控属性  
如果你使用value绑定的是一个监控属性，KO是能够建立一个双向绑定。

但是如果value绑定是一个非监控属性，则KO会进行以下处理：

如果引用一个简单的属性，也就是说，它只是在你的视图模型一个普通的属性，表单元素编辑时KO将设置表单元素的初始状态属性值。

    <p>First value: <input data-bind="value: firstValue"></p>
    <p>First value:<span data-bind="text:firstValue"></span></p>
    <!-- One-way binding. Populates textbox; syncs only from textbox to model. -->
    <p>Second value: <input data-bind="value: secondValue"></p>
    <p>Second value: <span data-bind="text: secondValue"></span></p>
    <!-- No binding. Populates textbox, but doesn't react to any changes. -->
    <p>Third value: <input data-bind="value: secondValue.length &gt; 8"></p>
    <script type="text/javascript">
        var viewModel = {
            firstValue: ko.observable("hello"), // Observable
            secondValue: "hello, again"         // Not observable
        };
        ko.applybindings(viewModel,document.getElementById("eq2"));
    </script>