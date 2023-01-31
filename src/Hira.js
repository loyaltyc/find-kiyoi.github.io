(function (ns) {
    var Hira = ns.Hira = Hilo.Class.create({
        Extends: Hilo.Container,
        moveTween: null,
        hira: null,
        hiraX: 10,
        hiraY: 7 * 161,
        heart: 20,
        heartIcon: null,
        heartScore: null,
        constructor: function (properties) {
            Hira.superclass.constructor.call(this, properties);
            this.createHira(properties);
            // 平良可以移动
            this.moveTween = Hilo.Tween;
        },
        // 创建平良
        createHira: function (properties) {
            this.hira = new Hilo.Bitmap({
                id: 'hira',
                image: properties.image,
                scaleX: 0.45,
                scaleY: 0.45,
                x: this.hiraX,
                y: this.hiraY
            }).addTo(this);
            this.heartIcon = new Hilo.Bitmap({
                id: 'heart',
                image: properties.heartImage,
                scaleX: 2,
                scaleY: 2,
                x: 20,
                y: properties.height - 90
            }).addTo(this);
            this.heartScore = new Hilo.BitmapText({
                id: 'score',
                glyphs: properties.numberGlyphs,
                scaleX: 0.5,
                scaleY: 0.5,
                letterSpacing: 4,
                text: 0,
                x: 120,
                y: properties.height - 85
            }).addTo(this);
            this.getChildById('score').setText(this.heart);
        },
        // 开始移动
        startMove(rockObj, rockData) {
            var rockX = rockObj.x;
            var rockY = rockObj.y;
            //设置缓动时间
            var _this = this;
            this.moveTween.time = 120;
            this.moveTween.to(this.hira, {x: rockX, y: rockY}, {
                onComplete: function () {
                    rockObj.visible = false;
                    // 扣除体力
                    let isGameOver = _this.takeHeart(rockData.usedHeart)
                    window.game.endMove(isGameOver, rockData);
                }
            });
        },
        // 扣除，并检查剩余体力
        takeHeart(usedHeart) {
            this.heart = this.heart - usedHeart;
            this.getChildById('score').setText(this.heart);
            return this.heart <= 0;
        }
    });

})(window.game);
