(function (ns) {

    var RockScene = ns.RockScene = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function (properties) {
            RockScene.superclass.constructor.call(this, properties);
            this.init(properties);
        },
        rockTip: null,
        winImg: null,
        tipWidth: 0,
        tipType: '',
        tipImgArr: {},
        init: function (properties) {
            this.tipImgArr = properties.tipImgArr
            this.winImg = properties.winImg

            let rockTip = properties.image;
            let scaleX = window.game.width / (rockTip.width * 1.2);
            let newWidth = rockTip.width * scaleX * 0.5;
            this.tipWidth = newWidth;
            let tipX = (window.game.width - newWidth) / 8
            this.rockTip = new Hilo.Bitmap({
                id: 'rockTip',
                image: properties.image,
                scaleX: scaleX,
                // scaleY: 1,
                x: tipX,
                y: -800
            });
            this.addChild(this.rockTip);
        },
        // 显示图片
        show(rockData) {
            this.visible = true;
            var _this = this;
            Hilo.Tween.to(this.getChildById('rockTip'), {y: 200, alpha: 1}, {
                duration: 300, delay: 500, onComplete: function () {
                    if (rockData.type === 'item') {
                        _this.tipType = 'item';
                    } else {
                        _this.tipType = 'event';
                    }
                    _this.addTipTitle();
                    _this.addItemImage(rockData);
                    window.game.state = 'showTip';
                }
            });
        },
        // 提示框标题
        addTipTitle() {
            let title = this.tipType === 'item' ? '获得了道具：' : '发生事件：';
            new Hilo.DOMElement({
                id: 'titleView',
                element: Hilo.createElement('div', {
                    innerHTML: title,
                    style: {
                        position: 'absolute',
                        color: 'rgb(249,195,22)',
                        fontWeight: 'bolder',
                        fontSize: '30px',
                        webkitTextStroke: '1px rgb(63,86,160)'
                    }
                }),
                width: 400,
                height: 100,
                x: 50,
                y: 120
            }).addTo(this)
        },
        // 添加道具图片
        addItemImage(rockData) {
            // 道具图片
            var itemImage = this.tipImgArr[rockData.boxContent];
            let imageX = (window.game.width - itemImage.width) / 2
            new Hilo.Bitmap({
                id: 'tipContent',
                image: itemImage,
                scaleX: 0.8,
                scaleY: 0.8,
                x: imageX,
                y: 350
            }).addTo(this);
            // 道具描述
            new Hilo.DOMElement({
                id: 'descView',
                element: Hilo.createElement('div', {
                    innerHTML: rockData.descContent,
                    style: {
                        position: 'absolute',
                        color: 'rgb(249,195,22)',
                        fontWeight: 'bolder',
                        fontSize: '25px',
                        webkitTextStroke: '1px rgb(63,86,160)'
                    }
                }),
                width: this.tipWidth - 30,
                height: 100,
                x: 55,
                y: 320
            }).addTo(this)
        },
        hide() {
            this.visible = false;
            this.getChildById('rockTip').alpha = 0;
            this.getChildById('rockTip').y = -800;
            this.getChildById('tipContent').removeFromParent();
            this.getChildById('titleView').removeFromParent();
            this.getChildById('descView').removeFromParent();
            this.tipType = '';
        },
    });

})(window.game);