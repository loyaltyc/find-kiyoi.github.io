(function () {

    window.onload = function () {
        game.init();
    }

    var game = window.game = {
        width: 0,
        height: 0,

        asset: null,
        stage: null,
        ticker: null,
        state: 'wait',
        score: 0,

        bg: null,
        rock: null,
        hira: null,
        gameReadyScene: null,
        gameRockScene: null,

        init: function () {
            this.asset = new game.Asset();
            this.asset.on('complete', function (e) {
                this.asset.off('complete');
                this.initStage();
            }.bind(this));
            this.asset.load();
        },

        initStage: function () {
            this.width = Math.min(innerWidth, 450) * 2;
            this.height = Math.min(innerHeight, 750) * 2;
            this.scale = 0.5;

            //舞台画布
            var renderType = location.search.indexOf('dom') !== -1 ? 'dom' : 'canvas';

            //舞台
            this.stage = new Hilo.Stage({
                renderType: renderType,
                width: this.width,
                height: this.height,
                scaleX: this.scale,
                scaleY: this.scale
            });
            document.body.appendChild(this.stage.canvas);
            //绑定交互事件
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
            this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));
            //启动计时器
            this.ticker = new Hilo.Ticker(60);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start(true);

            //初始化
            this.initBackground();
            this.initScenes();

        },

        initBackground: function () {
            //背景
            var bgWidth = this.width * this.scale;
            var bgHeight = this.height * this.scale;

            var bgImg = this.asset.bg;
            this.bg = new Hilo.Bitmap({
                id: 'bg',
                image: bgImg,
                scaleX: this.width / bgImg.width,
                scaleY: this.height / bgImg.height
            }).addTo(this.stage);
        },
        initRock: function () {
            this.rock = new game.Rock({
                id: 'rock',
                image: this.asset.rock,
                tipImgArr: this.asset.tipImgArr,
            }).addTo(this.stage);
        },
        initHira() {
            this.hira = new game.Hira({
                id: 'hira',
                image: this.asset.hira,
                heartImage: this.asset.heart,
                height: this.height,
                numberGlyphs: this.asset.numberGlyphs,
            }).addTo(this.stage);
        },
        onUserInput: function (e) {
            // 平良移动中 或 点击平良
            if (this.state === 'moving' || e.eventTarget.id === 'hira' || this.state === 'over') {
                return;
            }
            // 开始游戏
            if (this.state === 'wait') {
                this.startGame();
                return;
            }
            // 显示事件
            if (this.state === 'showTip') {
                this.gameRockScene.hide()
                this.state = 'playing'
                return;
            }
            // 点击格子
            this.handleClickRock(e);
        },
        handleClickRock(e) {
            var rockId = e.eventTarget.id;
            var checkResult = this.rock.checkBox(rockId);
            // 不可用的格子
            if (checkResult === false) {
                return;
            }
            // 处理格子事件，移动，扣除体力
            var rockData = this.rock.getRockData(checkResult);
            var pickRock = this.rock.getChildById(rockId);
            // 平良移动中不可点击，定时器更新状态
            this.state = 'moving';
            var isGameOver = this.hira.startMove(pickRock, rockData.usedHeart);
            // 找到清居，显示奖励提示
            if (rockData.usedHeart === 0) {
                this.gameOver(true);
                return;
            }
            if (rockData.boxContent !== 'empty') {
                this.gameRockScene.show(rockData);
                this.updateStatus('showTip', 800);
            } else {
                this.updateStatus('playing', 1200);
            }
            // 体力耗尽，游戏结束
            if (isGameOver) {
                this.gameOver()
            }
        },
        // 更新状态，防止处理无效点击
        updateStatus(newStatus, time) {
            var _this = this;
            setTimeout(function () {
                _this.state = newStatus;
            }, time)
        },
        gameOver(isWin = false) {
            // 游戏结束，可重新开始
            this.state = 'over'
        },
        initRockScene() {
            this.gameRockScene = new game.RockScene({
                id: 'rockScene',
                width: this.width,
                height: this.height,
                image: this.asset.tipBg,
                visible: false
            }).addTo(this.stage);
        },
        // 开始游戏
        startGame() {
            this.gameReadyScene.visible = false
            this.initRock();
            this.initHira();
            this.initRockScene();
            this.state = 'playing'
        },
        initScenes: function () {
            //准备场景
            this.gameReadyScene = new game.ReadyScene({
                id: 'readyScene',
                width: this.width,
                height: this.height,
                image: this.asset.readyTip
            }).addTo(this.stage);

            // //结束场景
            // this.gameOverScene = new game.OverScene({
            //     id: 'overScene',
            //     width: this.width,
            //     height: this.height,
            //     image: this.asset.over,
            //     numberGlyphs: this.asset.numberGlyphs,
            //     visible: false
            // }).addTo(this.stage);
        },
    };

})();