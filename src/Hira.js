(function (ns) {
    var Hira = ns.Hira = Hilo.Class.create({
        Extends: Hilo.Container,
        moveTween: null,
        hira: null,
        hiraX: 9,
        hiraY: 7 * 170,
        heart: 30,
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
                scaleX: 0.5,
                scaleY: 0.5,
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
        startMove: function (rockObj, usedHeart) {
            var rockX = rockObj.x;
            var rockY = rockObj.y
            //设置缓动时间
            this.moveTween.time = 20 * 9;
            this.moveTween.to(this.hira, {x: rockX + 9, y: rockY}, {
                onComplete: function () {
                    rockObj.visible = false;
                }
            });
            // 扣除体力
            this.takeHeart(usedHeart)
        },
        // 扣除，并检查剩余体力
        takeHeart(usedHeart) {
            this.heart = this.heart - usedHeart;
            this.getChildById('score').setText(this.heart);
            if (this.heart <= 0) {
                return false;
            }
            return true;
        }

    });

})(window.game);
