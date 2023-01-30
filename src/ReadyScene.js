
(function (ns) {

    var ReadyScene = ns.ReadyScene = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function (properties) {
            ReadyScene.superclass.constructor.call(this, properties);
            this.init(properties);
        },
        init: function (properties) {
            var getready = new Hilo.Bitmap({
                image: properties.image,
                scaleX: 1,
                scaleY: 1,
                x: 20,
                y: 200
            });
           
            this.addChild(getready);
        }
    });

})(window.game);