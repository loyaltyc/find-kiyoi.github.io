(function (ns) {
    var Rock = ns.Rock = Hilo.Class.create({
        Extends: Hilo.Container,
        // 列、行数;横纵间隔；
        rowNum: 8,
        colNum: 5,
        rockBox: [],
        itemRockObj: {},
        eventArr: ['shirota', 'cleanUp', 'sleepKiyoi', 'stalker', 'kiss', 'river', 'coffee', 'subway', 'likewho', 'kissgoodbye', 'water'],
        itemArr: ['duck', 'bicycle', 'gun', 'soda', 'hat', 'firework', 'duck', 'bicycle', 'gun', 'soda', 'hat', 'firework', 'duck', 'bicycle', 'gun', 'soda', 'hat', 'firework', 'duck', 'duck', 'duck'],
        descArr: {
            'duck': '这是一个获得老婆青睐的鸭子队长，为你带来幸运 BUFF 。体力 +1.',
            'bicycle': '请把这个自行车装进口袋，可获得带老婆兜风的机会一次。',
            'gun': '可以为把嘲笑神的臭虫们哒哒哒哒哒哒哒！！！',
            'soda': '老婆爱喝的姜汁汽水，惹老婆生气的时候，你背包里最好有它。',
            'hat': '戴了之后更可疑的伪装道具。',
            'firework': '鸳鸯戏水之后，难道不想再来一次换装 PLAY 吗？',
        },
        punishEventArr: ['shirota', 'cleanUp', 'subway', 'likewho', 'kissgoodbye'],
        eventAnswer: {
            'sleepKiyoi': {'addHeart': 3, 'item': 'camera', 'yes': '偶遇睡着的神明，还不赶快掏出自带的照相机啪啪啪啪啪？体力 +3', 'no': ''},
            'stalker': {
                'addHeart': 3,
                'item': 'soda',
                'yes': '跟踪被发现！惹老婆生气的时候，还好背包里有姜汁汽水。体力 +3',
                'no': '跟踪被发现！你惨了，你连姜汁汽水都没有准备！'
            },
            'kiss': {
                'addHeart': 3,
                'item': 'gun',
                'yes': '神明被臭虫们玷污了，快拿出你的机关枪哒哒哒哒哒！体力 +3',
                'no': '神明被臭虫们玷污了，你连机关枪都没有，你凭什么保护老婆。'
            },
            'river': {
                'addHeart': 3,
                'item': 'bicycle',
                'yes': '河边散步。掏出背包里的自行车，带老婆兜风啦！体力 +3',
                'no': '河边散步。出门不带自行车，兜风计划失败。'
            },
            'coffee': {
                'addHeart': 3,
                'item': 'hat',
                'yes': '偷看老婆演出。化身可疑君，吸引老婆注意！计划通 get√ 。体力 +3',
                'no': '偷看老婆演出。没有化身可疑君的道具，区区平良埋没在人群中。'
            },
            'water': {
                'addHeart': 3,
                'item': 'firework',
                'yes': '玩水之后一定要换上干衣服哦。拿出烟花逗老婆开心，清居清居清居清居~',
                'no': '没有烟花的代价是，我们好多人都失去了壁纸。'
            },
            'shirota': {
                'addHeart': 3,
                'desc': '遇到了找茬的臭虫，真倒霉。希望他不要再出现在神明周围了。体力 -3'
            },
            'cleanUp': {
                'addHeart': 3,
                'desc': '慌慌张张大扫除中！手忙脚乱，收内裤收内裤...... 体力 -3'
            },
            'subway': {
                'addHeart': 5,
                'desc': '我坐地铁回去。（微笑） 体力 -5'
            },
            'likewho': {
                'addHeart': 5,
                'desc': '我想不明白，为什么老婆亲了我一下，又踢了我一脚。我做错什么了？ 体力 -5'
            },
            'kissgoodbye': {
                'addHeart': 3,
                'desc': '神明给了我最后的施舍，他修正了错误，独留我一个人在金字塔下。 体力 -3'
            },
        },
        // 平良的背包
        hiraPackage: [],
        tipImgArr: {},
        constructor: function (properties) {
            Rock.superclass.constructor.call(this, properties);
            this.hiraPackage = ['camera'];
            this.tipImgArr = properties.tipImgArr
            this.createRock(properties.image);
            this.pushItem();
        },
        // 创建格子
        createRock: function (image) {
            let bgWidth = window.game.width;
            let bgHeight = window.game.height;
            let scaleX = bgWidth / (5 * image.width);
            let scaleY = bgHeight / (8 * image.height);
            for (var row = 0; row < this.rowNum; row++) {
                for (var col = 0; col < this.colNum; col++) {
                    // 留下平良的位置
                    if (row === 7 && col === 0) {
                        continue;
                    }
                    var id = 'rock-' + col + '-' + row;
                    var rockList = new Hilo.Bitmap({
                        id: id,
                        image: image,
                        scaleX: scaleX,
                        scaleY: scaleY,
                        rect: [0, 0, 120, 120],
                        depth: 20
                    }).addTo(this);
                    this.rockBox.push(id)
                    rockList.x = col * 160;
                    rockList.y = row * 160;
                }
            }
        },
        // 获取随机数
        getRandomNum: function (minNum, maxNum) {
            switch (arguments.length) {
                case 1:
                    return parseInt(Math.random() * minNum + 1, 10);
                case 2:
                    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                default:
                    return 0;
            }
        },
        // 放置道具和事件
        pushItem: function () {
            var totalItemArr = [];
            var emptyArr = [];
            // 空白格子的 行*列-平良-清居-道具-事件  数
            var emptyRockCount = this.rowNum * this.colNum - 2 - this.itemArr.length - this.eventArr.length;
            for (var i = 0; i < emptyRockCount; i++) {
                emptyArr.push('');
            }
            totalItemArr = totalItemArr.concat(this.eventArr, this.itemArr, emptyArr);
            // 先放清居，不可放在平良周围
            var kiyoiBox = this.getRandomNum(0, 24)
            console.log(kiyoiBox);
            var usedBoxIndex = [kiyoiBox]
            this.itemRockObj.king = kiyoiBox;
            // 循环随机出格子号
            for (var i = 0; i < totalItemArr.length; i++) {
                var result = false;
                var itemName = totalItemArr[i];
                while (!result) {
                    var itemBox = this.getRandomNum(0, 38)
                    // 判断格子是否占用
                    if (usedBoxIndex.findIndex(value => value === itemBox) === -1) {
                        result = true;
                        usedBoxIndex.push(itemBox)
                        if (itemName !== '') {
                            this.itemRockObj[itemName] = itemBox;
                        }
                    }
                }
            }
        },
        // 检查格子内容
        checkBox(id) {
            var index = this.rockBox.findIndex(value => value === id);
            if (index === -1) {
                return false;
            }
            var boxContent = 'empty';
            for (var key in this.itemRockObj) {
                if (this.itemRockObj[key] === index) {
                    boxContent = key;
                }
            }
            return {index: index, boxContent: boxContent}
        },
        // 处理格子
        getRockData(checkResult) {
            let rockData = {
                index: checkResult.index,
                boxContent: checkResult.boxContent,
                hiraPackage:this.hiraPackage
            }
            var boxContent = checkResult.boxContent;
            var pickRock = this.getChildAt(checkResult.index);
            pickRock.x = pickRock.x + 15;
            pickRock.y = pickRock.y + 15;
            // 空白格子
            if (boxContent === 'empty') {
                pickRock.visible = false;
                rockData.usedHeart = 1;
                return rockData;
            }
            // TODO 清居格子
            if (boxContent === 'king') {
                console.log('find!!!');
                rockData.usedHeart = 0;
                return rockData;
            }
            // 道具格子
            var isItemBox = this.itemArr.findIndex(value => value === boxContent);
            var itemImage = this.tipImgArr[boxContent];
            pickRock.setImage(itemImage);
            pickRock.scaleX = 1.1;
            pickRock.scaleY = 1.1;
            if (isItemBox !== -1) {
                this.hiraPackage.push(boxContent);
                rockData.descContent = this.descArr[boxContent];
                rockData.usedHeart = boxContent === 'duck' ? -1 : 1;
                rockData.type = 'item';
                return rockData
            }
            // 事件格子
            rockData.type = 'event';
            let eventBoxRes = this.handleEventBox(boxContent);
            rockData.usedHeart = eventBoxRes.usedHeart;
            rockData.descContent = eventBoxRes.descContent;
            return rockData;
        },
        // 返回扣除的体力，负数为加体力
        handleEventBox(boxContent) {
            let eventBoxRes = {usedHeart: 1, descContent: ''}
            // 惩罚事件
            var punishAnswer = this.punishEventArr.findIndex(value => value === boxContent);
            var eventAnswer = this.eventAnswer[boxContent];
            if (punishAnswer !== -1) {
                eventBoxRes.usedHeart = eventAnswer.addHeart;
                eventBoxRes.descContent = eventAnswer.desc;
                return eventBoxRes;
            }
            // 奖励格子判断背包
            if (this.hiraPackage.findIndex(value => value === eventAnswer.item) !== -1) {
                eventBoxRes.usedHeart = 0 - eventAnswer.addHeart;
                eventBoxRes.descContent = eventAnswer.yes;
            } else {
                eventBoxRes.descContent = eventAnswer.no;
            }
            return eventBoxRes;
        },

    });

})(window.game);
