(function (ns) {

    var RockScene = ns.RockScene = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function (properties) {
            RockScene.superclass.constructor.call(this, properties);
            this.init(properties);
        },
        rockTip: null,
        tipType: '',
        init: function (properties) {
            this.rockTip = new Hilo.Bitmap({
                id: 'rockTip',
                image: properties.image,
                scaleX: 1,
                scaleY: 1,
                x: 20,
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
                }
            });
        },
        // 提示框标题
        addTipTitle() {
            let title = this.tipType === 'item' ? '获得了道具：' : '发生事件：';
            var titleView = new Hilo.DOMElement({
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
            var itemImage = 'images/' + rockData.boxContent + '.png'
            var tipContent = new Hilo.Bitmap({
                id: 'tipContent',
                image: itemImage,
                scaleX: 0.8,
                scaleY: 0.8,
                x: 320,
                y: 350
            }).addTo(this);
            // 道具描述
            var descView = new Hilo.DOMElement({
                id: 'descView',
                element: Hilo.createElement('div', {
                    innerHTML: rockData.descContent,
                    style: {
                        position: 'absolute',
                        color: 'rgb(249,195,22)',
                        fontWeight: 'bolder',
                        fontSize: '30px',
                        webkitTextStroke: '1px rgb(63,86,160)'
                    }
                }),
                width: 380,
                height: 100,
                x: 45,
                y: 300
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
        }
    });

})(window.game);