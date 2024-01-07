//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {

    //声明一个记录点击的缩略图下标
    var bigimgIndex = 0;

    //路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind() {
        /**
     * 思路：
     * 1、先获取路径导航的页面元素（navPath）
     * 2、再来获取所需要的数据（data.js->goodData.path）
     * 3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
     * 4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
     */

        //1.获取页面导航的元素对象
        var navPath = document.querySelector('#wrapper #content .contentMain #navPath');

        //2.获取数据
        var path = goodData.path;

        //3.遍历数据
        for (var i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                //只需要创建a且没有href属性
                var aNode = document.createElement("a");
                aNode.innerText = path[i].title;
                navPath.appendChild(aNode);
            } else {
                //4.创建a标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                //5.创建i标签
                var iNode = document.createElement('i');
                iNode.innerText = '/';

                //6.让navPath元素来追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }


        }
    }

    //放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind() {
        /**
         * 思路：
         * 1、获取小图框元素对象，并且设置移入事件(onmouseenter)
         * 2、动态的创建蒙版元素以及大图框和大图片元素
         * 3、移出时(onmouseleave)需要移除蒙版元素和大图框
         */

        //1.获取小图框元素
        var smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic');
        //获取leftTop元素
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop');

        //获取数据
        var imagessrc = goodData.imagessrc;

        //2.设置移入事件
        smallPic.onmouseenter = function () {

            //3. 创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            //4.创建大图框元素
            var BigPic = document.createElement('div');
            BigPic.id = "bigPic";

            //5.创建大图片元素
            var BigImg = document.createElement('img');
            BigImg.src = imagessrc[bigimgIndex].b;

            //6.大图框来追加大图片
            BigPic.appendChild(BigImg);

            //7.让小图框来追加蒙版元素
            smallPic.appendChild(maskDiv);

            //8.让leftTop元素追加大图框
            leftTop.appendChild(BigPic);


            //设置移动事件
            smallPic.onmousemove = function (event) {
                //event.clientX: 鼠标点距离浏览器左侧X轴的值
                //getBoundingClientRect().left:小图框元素距离浏览器左侧可视left值
                //offsetWidth:为元素的占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                //判断
                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }

                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }

                //设置left和top属性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                //大图发生移动
                //确定 bigImg 的left top
                //移动比 = 蒙版的位置/大图的位置 = (小图的宽度-蒙版的宽度)/(大图片的宽度-大图框的宽度);
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth)

                BigImg.style.left = -left / scale + 'px';
                BigImg.style.top = -top / scale + 'px';
            }


            //设置移出事件
            smallPic.onmouseleave = function () {

                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);

                //让leftTop元素移除大图框
                leftTop.removeChild(BigPic);
            }
        }
    }

    //动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData() {
        /**
         * 思路：
         * 1、先获取piclist元素下的ul
         * 2、在获取data.js文件下的goodData->imagessrc
         * 3、遍历数组，根据数组的长度来创建li元素
         * 4、让ul遍历追加li元素
         */

        //1.获取piclist下的ul
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');

        //2.获取imagessrc数据
        var imagessrc = goodData.imagessrc;

        //3.遍历数组
        for (var i = 0; i < imagessrc.length; i++) {
            //4.创建li元素
            var newLi = document.createElement('li');

            //5.创建img元素
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;

            //6.让li追加img元素
            newLi.appendChild(newImg);

            //7.让ul追加li元素
            ul.appendChild(newLi);
        }
    }

    //点击缩略图的效果
    thumbnailClick();
    function thumbnailClick() {
        /**
         * 思路：
         * 1、获取所有的li元素，并且循环发生点击事件
         * 2、点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有src的值
         */

        //1.获取所有的li元素
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');

        var smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');

        var imagessrc = goodData.imagessrc;

        //小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallPic_img.src = imagessrc[0].s;

        //2.循环点击这些li元素
        for (var i = 0; i < liNodes.length; i++) {
            //在点击事件之前，给每一个元素都添加上自定义的下标
            liNodes[i].index = i; /** 还可以通过setAttribute('index',i) */
            liNodes[i].onclick = function () {
                var idx = this.index; /** 事件函数中的this永远指向的是实际发生事件的目标源对象 */
                bigimgIndex = idx;

                //变换小图路径
                smallPic_img.src = imagessrc[idx].s;
            }
        }
    }


     //点击缩略图左右箭头的效果
     thumbnailLeftRightClick();
     function thumbnailLeftRightClick(){
         /**
          * 思路：
          * 1、先获取左右两端的箭头按钮
          * 2、在获取可视的div以及ul元素和所有的li元素
          * 3、计算（发生起点、步长、总体运动的距离值）
          * 4、然后再发生点击事件
          */
 
         //1、获取箭头元素
         let prev = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom a')[0];
         let next = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom a')[1];
 
         
         //2、获取可视的div以及ul元素和所有的li元素
         var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul');
 
         var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li');
 
         //3、计算
 
         //发生起点
         var start = 0;
 
         //步长
         var step = (liNodes[0].offsetWidth + 20) * 2;
 
         //总体运动的距离值 = ul的宽度 - div框的宽度 = (图片的总数 - div中显示的数量) * （li的宽度 + 20）
         var endPostion = (liNodes.length - 5 ) * (liNodes[0].offsetWidth + 20);
 
         //4、发生事件
         prev.onclick = function(){
            console.log('1')
             start-=step;
             if(start < 0){
                 start = 0;
             }
             ul.style.left = -start + "px";
         }
 
         next.onclick = function(){
             start+=step;
             if(start > endPostion){
                 start = endPostion;
             }
             ul.style.left = -start + "px";
         }
 
     }
 


    //商品详情数据的动态渲染
    rightTopData();
    function rightTopData() {
        /**
         * 思路：
         * 1、查找rightTop元素
         * 2、查找data.js->goodData->goodsDetail
         * 3、建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染rightTop元素
         */

        //1、查找元素
        var rightTop = document.querySelector('#wrapper #content .contentMain #center #right .rightTop');

        //2、查找数据
        var goodsDetail = goodData.goodsDetail;

        //3、创建一个字符串(双引号、单引号、模板字符串)变量
        //模板字符串替换数据：${变量}
        var s = `<h3>${goodsDetail.title}</h3>
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetail.price}</p>
                            <i>降价通知</i>
                        </div>
                        <p>
                            <span>累计评价</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                    <span>配&nbsp;送&nbsp;至</span>
                    <p>${goodsDetail.address}</p>
                </div>`;

        //4、重新渲染rightTop元素
        rightTop.innerHTML = s;
    }

    //商品参数数据的动态渲染
    rightBottomData();
    function rightBottomData() {
        /**
         * 思路：
         * 1、找rightBottom的元素对象
         * 2、查找data.js->goodData.goodsDetail.crumbData数据
         * 3、由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象(dt、dd)
         */

        //1、查找元素对象
        var chooseWrap = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap');

        //2、查找数据
        var crumbData = goodData.goodsDetail.crumbData;

        //3、循环数据
        for (var i = 0; i < crumbData.length; i++) {

            //4、创建dl元素对象
            var dlNode = document.createElement('dl');

            //5、创建dt元素对象
            var dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;

            //6、dl追加dt
            dlNode.appendChild(dtNode);

            //7、遍历crumbData->data元素
            for (var j = 0; j < crumbData[i].data.length; j++) {

                //创建dd元素
                var ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                ddNode.setAttribute('changePrice', crumbData[i].data[j].changePrice)

                //让dl来追加dd
                dlNode.appendChild(ddNode);
            }

            //8、让chooseWrap追加dl
            chooseWrap.appendChild(dlNode);
        }
    }

    //点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind() {
        let dls = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl');
        let choose = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .choose');
        let arr = new Array(dls.length);
        arr.fill(0);
        for (let i = 0; i < dls.length; i++) {
            let childs = dls[i].childNodes;
            for (let j = 1; j < childs.length; j++) {

                childs[j].onclick = () => {
                    choose.innerHTML = "";
                    for (let k = 0; k < childs.length; k++) {
                        childs[k].style.color = '#666';
                    }
                    childs[j].style.color = 'red';
                    arr[i] = childs[j];
                    changePriceBind(arr);
                    arr.forEach((value, index) => {
                        if (value) {
                            let maskDiv = document.createElement('div');
                            maskDiv.id = 'mark';
                            maskDiv.innerText = value.innerText;
                            let a = document.createElement('a');
                            a.innerText = 'X';
                            a.setAttribute('index', index);
                            maskDiv.appendChild(a);
                            choose.appendChild(maskDiv);
                        }
                    })
                    let aNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .choose #mark a');
                    for (let n = 0; n < aNodes.length; n++) {
                        aNodes[n].onclick = () => {
                            let e = aNodes[n].parentElement;
                            choose.removeChild(e);
                            let index = aNodes[n].getAttribute('index');
                            arr[index] = 0;
                            changePriceBind(arr);
                            let ddlist = dls[index].querySelectorAll('dd');
                            for (let m = 0; m < ddlist.length; m++) {
                                ddlist[m].style.color = '#666';
                            }
                            ddlist[0].style.color = 'red';
                        }
                    }
                }
            }
        }
    }

    function changePriceBind(arr) {
        let oldPrice = document.querySelector('#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price p');



        let num = goodData.goodsDetail.price;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                num += parseInt(arr[i].getAttribute('changePrice'));
            }
        }
        oldPrice.innerHTML = num;
        let leftPrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        leftPrice.innerHTML = "￥" + num;
        let ips = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li div input');
        let changePrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        for(let i = 0; i < ips.length; i++) {

            if(ips[i].checked){
                num += Number(ips[i].value);
            }
        }
        changePrice.innerHTML = '￥' + num;



    }

    function choosePrice() {
        let ips = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li div input');
        let leftPrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        let rightPrice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        for(let i = 0 ; i < ips.length; i++) {
            ips[i].onclick = function() {
                let num = Number(leftPrice.innerText.slice(1));
                for(let j = 0; j < ips.length; j++) {
                    if(ips[j].checked) {
                        num += Number(ips[j].value);
                    }
                }
                rightPrice.innerHTML = '￥' + num;

            }
        }
   
    }
    choosePrice();  

    //封装一个公共选项卡
    function Tab(tabBtns,tabConts) {
        for(let i = 0; i < tabBtns.length;i++) {
            tabBtns[i].index = i;
            tabBtns[i].onclick = function() {
                for(let j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                this.className = 'active';
                tabConts[this.index].className = 'active';
            }
        }
    }

    function leftTab() {
        let h4s = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4')
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .aslideContent>div');
        Tab(h4s,divs);
    }
    leftTab()

    function rightTab() {
        let lis = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabBtns li');
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabContents div');
        Tab(lis,divs);
    }
    rightTab();

    //右边侧边栏的点击效果
    function rightAsideBind() {
        let btn = document.querySelector('#wrapper .rightAside .btns');
        let rightAside = document.querySelector('#wrapper .rightAside');
        let flag = true;
        btn.onclick = function() {
            if(flag) {
                btn.className = 'btns btnsOpen';
                rightAside.className = 'rightAside asideOpen';
            }else{
                btn.className = 'btns btnsClose'
                rightAside.className = 'rightAside asideClose';
            }
            flag = !flag;
        }
    }
    rightAsideBind();

}