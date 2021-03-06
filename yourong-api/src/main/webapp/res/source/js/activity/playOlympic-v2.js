/*global define,require,$,environment,alert,env,globalPath,Vue,log,formValid*/
/* jshint undef: true, asi: true, boss: true */
define(['base'], function (require, exports, module) {
    'use strict'
    var base=require('base');
    var path = environment.globalPath,
        serverTime = +environment.serverDate,
        serverDate = new Date(serverTime),
        today = serverDate.getDate(),
        hook = new AppHook(os),
        isLogined=false

    if(isNeedYRWtoken){
        isLogined=!!encryptionId
    }else{
        isLogined=!!logined
    }

    Vue.config.devtools = true

    Vue.filter('raceHours', function (string) {
        return string ? string.replace(/:00$/g, '') : string
    })
    
    window.vm = new Vue({
        el: '#j-playOlympic',
        data: {
            isCurrent:0,
            loginUrl:isLogined?'javascript:;':(os>2?env.path + '/mstation/login?from=' + location.href:'javascript:;'),
            today: serverDate.getDate(),
            postUrl:env.path+'/activity/dynamicInvoke/',
            urls: {
                guessMedal: env.path+'/activity/olympic/guessMedal',
                guessGold: env.path+'/activity/olympic/guessGold',
                collectOlympic: env.path+'/activity/olympic/setOlympic'
            },
            logined:isLogined,
            lightList: {},
            initData: window.receiveData.result||{},
            parityList: [],
            guessMedalType:'',
            validErrorMsg1: '',// 猜金牌错误提示文案
            validErrorMsg2: '',// 猜金牌错误提示文案
            passValid1: false, // 是否通过表单1验证
            passValid2: false, // 是否通过表单2验证
            tips: {
                guessGold: {
                    goldEmpty: '请输入竞猜金牌的数量！',
                    valueEmpty: '请输入人气值的数量！',
                    valueError: '下注人气值数量必须大于0！',
                    valueNotEnough: '您好！当前人气值不足，请重新下注！'
                },
                collectAward:'',
                guessGoldNumberError: '',
                guessGoldValueError: ''
            },
            // 赛奥运文案
            maskText: '活动未开始'
        },
        props:['os'],
        created: function () {

            var self = this,result = self.initData||{}
            //竞猜记录
            self.parityList = self.getParityList(result.guessMedalRecord, [0, 15], 16)
            // 赛奥运填充我的投资额
            if (self.logined) {
                self.$set('myCount', self.fillCount(result.totalMyInvestAmount || 0))
            }

            // 比赛的人的列表
            self.$set('everydayTrackList', self.fillTrackList(result.everydayTotalAmountList || []))
            //集奥运幸运儿列表
            setTimeout(function () {
                $('#j-juckyList').scrollList({
                    size:1,
                    length: 1,
                    height: 40,
                    time: 2000,
                    stoppabled: true
                })
            }, 250)

            //亮奥运日历
            self.lightList = self.getLightList(result.brightOlympic, [5, 22], 35)

            //app callback

            window.hookCallback = self.hookCallback
        },

        computed: {
            platform: function () {
              return +this.os
            },
            guessMedalStatus: function () {
                var init = this.initData,
                    status = 2,
                    now = serverTime,
                    start = init.guessMedalStartTimeM,
                    end = init.guessMedalEndTimeM

                if (now >= start && now <= end) {
                    status = 4
                } else if (now > end) {
                    status = 6
                }
                return status
            },
            guessGoldStatus: function () {
                var status = 2,
                    init = this.initData,
                    now = serverTime,
                    start = init.guessGoldStartTimeM,
                    end = init.guessGoldEndTimeM
                if (now >= start && now <= end) {
                    status = 4
                } else if (now > end) {
                    status = 6
                }
                return status
            },
            // 竞奥运
            everydayTotalAmountList: function () {
                return this.fillTrackList(this.initData.everydayTotalAmountList||[])
            },
            totalAmountList:function () {
                return this.championList(this.initData.totalAmountList||[])
            },
            showTotalMask: function () {
                var self = this

                if (self.initData.activityStatus === 2) {

                    self.maskText = '活动未开始'
                    return true
                } else if (self.initData.activityStatus === 6) {

                    self.maskText = '活动已结束'
                    return true
                } else {
                    return false
                }
            },
            showRaceMask: function () {
                var self = this

                if (self.initData.activityStatus === 2) {

                    self.maskText = '活动未开始'
                    return true
                } else if (self.initData.activityStatus === 6) {

                    self.maskText = '活动已结束'
                    return true
                } else {
                    if(self.todaySeconds<self.raceStartSeconds){
                        self.maskText = '当日活动未开始'
                        return true
                    }else{
                        return false
                    }
                }
            },
            raceStartSeconds: function () {
                var string = this.initData.raceStartTime
                return string ? string.replace(/:/g, '') - 0 : 0
            },
            todaySeconds: function () {
                var hours = fillZero(serverDate.getHours()),
                    minutes = fillZero(serverDate.getMinutes()),
                    seconds = fillZero(serverDate.getSeconds())

                function fillZero(num){
                    var n = num+'',str=n
                    if(n.length<2){
                        str = 0+n
                    }
                    return str
                }

                return +(hours + minutes + seconds)
            }
        },

        methods: {

            getTime: function (time) {
                var date = new Date(time)
                return date.getTime()
            },
            // tab 切换
            changeTab:function (i) {
                this.isCurrent = i
            },
            hookCallback:function (data, eventName) {
                var self = this
                switch(eventName){
                    case 'setOlympic':
                        self.collectDataHandle(data)
                    break
                    case 'guessGold':
                        self.guessGoldDataHandle(data.result)
                    break
                    case 'guessMedal':
                        self.guessMedalDataHandle(data.result)
                    break
                }
            },
            getData: function (target, method, args, callback) {
                var self = this

                base.getAPI({
                    url: self.postUrl,
                    data: {
                        invokeMethod:method,
                        invokeParameters:args
                    },
                    callback: function (data) {
                        if (data.success) {
                            self.$set(target, data.result)
                            if (callback) {
                                callback(data.result)
                            }
                        }
                        else {
                            //数据异常显示,可根据target区分处理
                            var errorCodes = data.resultCodeEum || data.resultCodes
                            if ($.isArray(errorCodes) && errorCodes.length) {
                                base.xTips({content: errorCodes[0].msg})
                            } else {
                                console.error(self.postUrl, '未知错误')
                            }

                        }
                    }
                })
            },

            // 亮奥运
            getLightList: function (calList, range, size) {
                var orderedList = [],
                    list = calList?calList.match(/\d{1,2}/g):null

                for (var i = 0; i < size; i++) {
                    if (i >= range[0] && i <= range[1]) {
                        orderedList.push({tag: 0})
                    } else {
                        orderedList.push({tag: -1})
                    }
                }

                if (list && list.length) {
                    for (var j = 0; j < list.length; j++) {
                        orderedList[list[j]] = {tag: 1}
                    }
                }

                return orderedList// -1范围之外的日期 0范围之内的日期 1点亮的日期
            },
            //亮奥运 券
            showLightCoupon: function (amount) {
                var show = true,
                    status = this.initData.activityStatus,
                    sent = this.initData['couponAmount' + amount] || false

                switch (status) {
                    case 2:
                        show = true
                        break
                    case 4:
                        show = this.logined
                        break
                    case 6:
                        if (this.logined) {
                            show = sent
                        } else {
                            show = false
                        }
                        break
                }
                return show
            },
            //猜奖牌
            guessMedal: function (medalType) {
                var self = this,
                    type = +medalType,
                    init = self.initData

                if (!init.ifGuessMedal) {

                    var curHours = serverDate.getHours()
                    if (curHours >= init.guessStartTime && curHours < init.guessEndTime) {

                        if (self.logined && init.remindPopularityVaule < 10) {
                            base.xTips({content: '人气值不足！'})

                        }else{
                            window.location.href=self.loginUrl
                        }
                        var invokeName = 'guessMedal',
                            args='args_medalType_1_string_'+type

                        self.guessMedalType=type

                        if(self.platform<3){
                            hook.getEvent(invokeName + '&isNeedRealName=0&'+args,$(event.currentTarget))

                        }else{
                            self.getData('guessMedalData', invokeName, args, self.guessMedalDataHandle)
                        }
                    } else {
                        base.xTips({content: '亲，每日的竞猜时间内才可以参加活动。'})
                    }

                } else {
                    //base.xTips({content: '今天已经猜过奖牌奇偶数了'})
                }
            },
            guessMedalDataHandle: function (data) {
                var init = this.initData
                init.guessTotalNumber = data.guessTotalNumber
                init.ifGuessMedal = true
                init.guessMedalNumber = this.guessMedalType
                this.parityList = this.getParityList(data.guessMedalRecord, [0, 15], 16)
                init.remindPopularityVaule = init.remindPopularityVaule - 10

            },
            //猜奥运列表
            getParityList: function (list, range, size) {
                var parityList = [],
                    start = new Date(this.initData.guessGoldStartTimeM).getDate()

                for (var i = 0; i < size; i++) {
                    if (i >= range[0] && i <= range[1]) {
                        var passed = false
                        if (today >= start && i + 6 <= today) {
                            passed = true
                        }
                        parityList.push({parity: -1, passed: passed, guessed: false, inRange: true})
                    } else {
                        parityList.push({parity: -1, guessed: false, inRange: false})
                    }
                }

                if (list && list.length) {
                    for (var j = 0; j < list.length; j++) {
                        var guess = list[j],
                            todayTime = serverDate.getDate(),
                            guessTime = new Date(guess.guessTime).getDate()

                        parityList[guessTime - 6] = {
                            parity: guess.guessResult % 2,//0偶数 1奇数
                            passed: todayTime >= guessTime,
                            guessed: true, //是否猜过
                            correct: guess.realResult === guess.guessResult, //是否猜对
                            inRange: true//是否在活动范围内
                        }
                    }
                }

                return parityList
            },

            //猜金牌
            guessGold: function (goldNumber, popularityValue) {
                var num = +goldNumber || 0,
                    value = +popularityValue || 0,
                    self = this

                if (self.initData.ifGuessGold) {
                    return false
                }

                if (!this.guessGoldValidNumber || !this.guessGoldValidValue) {
                    if (!this.logined) {
                        guess()
                        return false
                    }
                    this.validGoldInput(this.goldNumber, 1)
                    this.validGoldInput(this.popularityValue, 2)
                    return false
                }

                guess()

                function guess() {
                    var invokeName = 'guessGold',
                        args='args_popularityValue_1_string_'+value+',args_goldNumber_2_string_'+num
                    if(self.platform<3){
                        hook.getEvent(invokeName + '&isNeedRealName=0&'+args,$(event.currentTarget))

                    }else{
                        self.getData('collectOlympicData', invokeName, args, self.guessGoldDataHandle)
                    }
                }
            },
            guessGoldDataHandle: function (data) {
                this.initData.guessGoldRecord = data.guessGoldRecord
                this.initData.ifGuessGold = true
            },
            // 竞猜表单验证
            validGoldInput: function (val, type) {
                var value = typeof(val) !== 'undefined' ? val + '' : ''


                //金牌数量
                if (type === 1) {
                    var passed1 = false
                    //空值校验
                    if (!value.length) {
                        this.tips.guessGoldNumberError = this.tips.guessGold.goldEmpty
                        passed1 = false
                    } else {
                        this.tips.guessGoldNumberError = ''
                        passed1 = true
                    }
                    this.guessGoldValidNumber = passed1
                }
                //人气值
                else {
                    var passed2 = false
                    //空值校验
                    if (!value.length) {
                        this.tips.guessGoldValueError = this.tips.guessGold.valueEmpty
                        passed2 = false
                    } else {
                        if (value > (this.initData.remindPopularityVaule || 0)) {
                            this.tips.guessGoldValueError = this.tips.guessGold.valueNotEnough
                            passed2 = false
                        } else {
                            this.tips.guessGoldValueError = ''
                            passed2 = true
                        }
                    }
                    this.guessGoldValidValue = passed2
                }

            },
            // 竞奥运列表
            fillTrackList: function (arr) {
                if (arr.length < 8) {
                    var arrLength = arr.length
                    for (var i = 0; i < 8 - arrLength; i++) {
                        arr.push({
                            avatars: '',
                            username: '',
                            totalInvest: 0
                        })
                    }
                }
                return arr
            },
            //总冠军列表
            championList:function (arr) {
                if (arr.length < 10) {
                    var arrLength = arr.length
                    for (var i = 0; i < 10 - arrLength; i++) {
                        arr.push({
                            avatars: '',
                            username: '',
                            totalInvest: 0
                        })
                    }
                }
                return arr
            },
            splitList: function (arr, pos) {
                var list = []

                if (arr.length == 0) {

                    list = _.fill(new Array(8), {username: null})
                } else {

                    if (arr.length < 8) {
                        list = _.fill(_.concat(arr, new Array(8 - arr.length)), {username:null})
                    } else {
                        list = arr
                    }
                }

                return (_.chunk(list, 4))[pos - 1]

            },
            //集奥运
            collectOlympic: function (puzzleList,event) {
                var self = this,
                    $target = $(event.currentTarget)
                if ($.isArray(puzzleList)) {

                    var list = []

                    puzzleList.forEach(function (item, index) {
                        if (item) {
                            list.push(index + 1)
                        }
                    })

                    var invokeName = 'setOlympic',
                        args='args_puzzle_1_string_'+ (list.length > 1 ? list.join(',') : list.toString()+',')
                    if(self.platform<3){
                        if(!self.logined||this.selectedPuzzleSize){
                            hook.getEvent(invokeName + '&isNeedRealName=0&'+args,$target)
                            self.$set('selectedPuzzleList',list)
                        }
                    }else{
                        if(this.selectedPuzzleSize){
                            this.getData('collectOlympicData', invokeName, args, self.collectDataHandle)
                            self.$set('selectedPuzzleList',list)
                        }
                    }
                }
            },
            collectDataHandle:function (data){
                var list = this.selectedPuzzleList,
                    self = this,
                    rewardTips=[
                        '30元现金券一张',
                        '100元现金券一张',
                        '200元现金券一张',
                        '荣耀手环zero一个'
                    ]
                base.xTips({content: '兑换成功!'})
                self.tips.collectAward = rewardTips[list.length-1]

                // 重置拼图状态
                list.forEach(function (item) {
                    var puzzle = 'initData.puzzle' + item
                    self.$set('puzzle' + item, false)
                    self.$set(puzzle, self.$get(puzzle) - 1)
                })
                var luckyList = data.luckyList

                if (luckyList) {
                    self.initData.luckyList = luckyList
                }

                self.selectedPuzzleSize = 0
                $('#j-puzzle-btn').attr('href','javascript:void(0)')
            },
            selectPuzzle: function (target, size) {
                if (size && this.initData.activityStatus === 4) {
                    var selected = this.$get(target),
                        num = this.selectedPuzzleSize || 0
                    this.$set('selectedPuzzleSize', selected ? num - 1 : num + 1)
                    this.$set(target, !selected)
                }
            },
            // 赛奥运
            fillCount: function (count) { // 我的战队
                var str = count + '' || '0',
                    arr = str.split('')

                var list = []
                arr.forEach(function (item) {
                    list.push({tag: item})
                })

                if (list.length < 8) {
                    var len = list.length
                    for (var i = 0; i < 8 - len; i++) {
                        list.unshift({tag: '0'})
                    }
                }
                list.unshift({tag: '￥'})

                return list
            },
            updateValues: function (e, tag, type) {
                var tagValue = this.$get(tag)
                //update Value
                $(e.currentTarget).val(tagValue)
                //valid input
                this.validGoldInput(tagValue, type)
            }
        }
    })

    $.fn.extend({
        /**
         * scrollList 滚动显示列表
         * @config {size:[Number]最小滚动行数,length:[Number]每行个数,height:[Number]最小滚动高度,time:[Number]滚动间隔时间,stoppabled:[bool]是否可以经过停止}
         */
        scrollList: function (config) {
            this.each(function () {
                var $this = $(this),
                    scrollSize = $this.find("li").length / config.length;

                if (scrollSize > config.size) {
                    var timer = scrollTimer();

                    if (config.stoppabled) {
                        $this.on('mouseenter', function () {
                            clearInterval(timer);
                        }).on('mouseleave', function () {
                            timer = scrollTimer();
                        });
                    }
                }
                //定时动画效果
                function scrollTimer() {
                    return setInterval(function () {
                        var scrollItems = $this.find("li:visible");
                        $this.animate({marginTop: -config.height}, 700, function () {
                            scrollItems.slice(0, config.length).appendTo($this);
                            $this.css("margin-top", 0);
                        });
                    }, config.time);
                }
            })
        }
    })
})