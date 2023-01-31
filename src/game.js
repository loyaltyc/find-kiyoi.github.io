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
            this.ticker = new Hilo.Ticker(180);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start(true);

            //初始化
            this.initBackground();
            this.initScenes();

        },

        initBackground: function () {
            //背景
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
            var _this = this;
            var rockId = e.eventTarget.id;
            var checkResult = this.rock.checkBox(rockId);
            // 不可用的格子
            if (checkResult === false) {
                return;
            }
            // 处理格子事件，移动，扣除体力
            var rockData = this.rock.getRockData(checkResult);
            this.updatePackage(rockData.hiraPackage);
            var pickRock = this.rock.getChildById(rockId);
            // 平良移动中不可点击
            this.state = 'moving';
            this.hira.startMove(pickRock, rockData);
        },
        endMove(isGameOver, rockData) {
            // 体力耗尽，游戏结束
            if (isGameOver) {
                this.gameOver(false)
                return;
            }
            // 找到清居，显示奖励提示
            if (rockData.usedHeart === 0) {
                this.gameOver(true);
                return;
            }
            if (rockData.boxContent !== 'empty') {
                this.gameRockScene.show(rockData);
            } else {
                this.state = 'playing';
            }
        },
        // 更新平良背包
        updatePackage(hiraPackage) {
            let packageText = '道具：';
            let itemNameArr = {
                'camera': '照相机',
                'gun': '枪',
                'firework': '烟花',
                'bicycle': '自行车',
                'soda': '姜汁汽水',
                'hat': '帽子'
            };
            for (var i = 0; i < hiraPackage.length; i++) {
                var itemName = itemNameArr[hiraPackage[i]];
                if (!itemName) {
                    continue;
                }
                packageText += itemName;
                if (i !== hiraPackage.length - 1) {
                    packageText += '，'
                }
            }
            new Hilo.DOMElement({
                id: 'packageText',
                element: Hilo.createElement('div', {
                    innerHTML: packageText,
                    style: {
                        position: 'absolute',
                        color: 'rgb(249,195,22)',
                        fontWeight: 'bolder',
                        fontSize: '17px',
                        webkitTextStroke: '1px rgb(63,86,160)'
                    }
                }),
                width: this.width / 3,
                x: this.width / 7,
                y: (this.height / 2) - 45
            }).addTo(this.stage)
        },
        // 游戏结束
        gameOver(isWin = false) {
            let image = isWin ? this.asset.gamewin : this.asset.gameLose;
            let gameOverText = isWin ? '恭喜！找到老婆！' : '没体力了！<br\>送个熊猫给你吧！';
            let scaleX = this.width / (image.width * 1.2);
            let newWidth = image.width * scaleX * 0.5;
            let tipX = (this.width - newWidth) / 8
            new Hilo.Bitmap({
                id: 'gameOverTip',
                image: image,
                scaleX: scaleX,
                scaleY: scaleX,
                x: tipX,
                y: 300
            }).addTo(this.stage);
            new Hilo.DOMElement({
                id: 'overText',
                element: Hilo.createElement('div', {
                    innerHTML: gameOverText,
                    style: {
                        position: 'absolute',
                        color: 'rgb(249,195,22)',
                        fontWeight: 'bolder',
                        fontSize: '40px',
                        webkitTextStroke: '1px rgb(63,86,160)'
                    }
                }),
                width: this.width - 30,
                height: 100,
                x: 55,
                y:  isWin ? 320 : 280
            }).addTo(this.stage)
            this.state = 'over'
        },
        initRockScene() {
            this.gameRockScene = new game.RockScene({
                id: 'rockScene',
                width: this.width,
                height: this.height,
                image: this.asset.tipBg,
                winImg: this.asset.gamewin,
                tipImgArr: this.asset.tipImgArr,
                visible: false
            }).addTo(this.stage);
        },
        // 开始游戏
        startGame() {
            this.gameReadyScene.visible = false
            this.initRock();
            this.initHira();
            this.initRockScene();
            this.updatePackage(['camera'])
            this.state = 'playing'
        },
        initScenes: function () {
            //准备场景
            let readyTip = this.asset.readyTip;
            let scaleX = this.width / (readyTip.width * 1.2);
            let newWidth = readyTip.width * scaleX * 0.5;
            let tipX = (this.width - newWidth) / 8
            this.gameReadyScene = new game.ReadyScene({
                id: 'readyScene',
                width: this.width,
                height: this.height,
                image: readyTip,
                x: tipX,
                y: 100,
                scaleX: this.width / (readyTip.width * 1.2),
            }).addTo(this.stage);
        },
    };

})();