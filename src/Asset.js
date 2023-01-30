(function (ns) {

    var Asset = ns.Asset = Hilo.Class.create({
        Mixes: Hilo.EventMixin,

        queue: null,
        bg: null,
        rock: null,
        question:null,
        package:null,
        tipBg:null,
        heart:null,
        number:null,
        readyTip:null,
        load: function () {
            var resources = [
                {id: 'bg', src: 'images/bg.png'},
                {id: 'rock', src: 'images/rock.png'},
                {id: 'hira', src: 'images/hira.png'},
                {id: 'question', src: 'images/question.png'},
                {id: 'tipBg', src: 'images/tipBg.png'},
                {id: 'heart', src: 'images/heart.png'},
                {id:'number', src:'images/number.png'},
                {id:'readyTip', src:'images/readyTip.png'},
            ];

            this.queue = new Hilo.LoadQueue();
            this.queue.add(resources);
            this.queue.on('complete', this.onComplete.bind(this));
            this.queue.start();
        },

        onComplete: function (e) {
            this.bg = this.queue.get('bg').content;
            this.rock = this.queue.get('rock').content;
            this.hira = this.queue.get('hira').content;
            this.question = this.queue.get('question').content;
            this.tipBg = this.queue.get('tipBg').content;
            this.heart = this.queue.get('heart').content;
            this.readyTip = this.queue.get('readyTip').content;
            var number = this.queue.get('number').content;
            this.numberGlyphs = {
                0: {image:number, rect:[0,0,60,91]},
                1: {image:number, rect:[61,0,60,91]},
                2: {image:number, rect:[121,0,60,91]},
                3: {image:number, rect:[191,0,60,91]},
                4: {image:number, rect:[261,0,60,91]},
                5: {image:number, rect:[331,0,60,91]},
                6: {image:number, rect:[401,0,60,91]},
                7: {image:number, rect:[471,0,60,91]},
                8: {image:number, rect:[541,0,60,91]},
                9: {image:number, rect:[611,0,60,91]}
            };
            this.queue.off('complete');
            this.fire('complete');
        }
    });

})(window.game);