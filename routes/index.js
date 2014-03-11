/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};


exports.crawler = function (req, res) {
    var eventProxy = require('eventproxy'),
        requestLib = require('request'),
        baseUrl = 'http://xyq.gm.163.com/cgi-bin/csa/csa_sprite.py?act=ask&product_name=xyq&question=',
        dataList = require("../model/dataList.js"),
        epNameList = [],
        resultArr = [];


    //构造ep队列
    dataList.forEach(function (item, index) {
        if (index == 5) {
            var lv1Name = item.name;
            item.content.forEach(function (itemContent, index) {
                var lv2Name = itemContent.desc;
                epNameList.push(lv1Name + '-' + lv2Name);

            })
        }
    });


    var ep = eventProxy.create(epNameList, function () {
        console.log(resultArr);
        res.send(resultArr);
    });

    //执行ep队列
    dataList.forEach(function (item, index) {
        if (index == 5) {
            var lv1Name = item.name;
            item.content.forEach(function (itemContent, index) {
                var lv2Name = itemContent.desc;
                itemContent.data.forEach(function (itemData) {
                    getAnswer(itemData, lv1Name + '-' + lv2Name);
                })
                if (itemContent.data.length == 0) {
                    getAnswer(lv2Name, lv1Name + '-' + lv2Name);
                }
            })
        }
    });

    //取得结果
    function getAnswer(question, tag) {
        requestLib(baseUrl + question, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                resultArr.push({
                    tag: tag,
                    titel: question,
                    answer: result.answer.replace(/(onclick|name|href|class)=\"[^"]+"/g, '')
                });
                console.log(result.answer);
                ep.emit(tag);
            } else {
                // res.send('not work')
            }
        });
    }
}

exports.sendPost = function (req, res) {
    var requestLib = require('request'),
        eventproxy = require('eventproxy'),
        epNameList=[],
        dataList = require('../result/result1.js'),
        request = requestLib.defaults({jar: true}),
        options = {
            url: 'http://esalesdev.163.com:5356/app/article/add',
            method: 'post',
            headers: {
                'Cookie': '_ntes_nuid=f4ae07c6cd2ce0f672d0c5f5e243f890; ALLYESID4=00130130123824704076548; vjuids=-a7e2d865f.13c89bfa0a4.0.f22b35f9; _ga=GA1.2.1265797034.1372665592; pgv_pvi=1876153344; usertrack=ezq041I+g96y9yxEYcNjAg==; _jzqa=1.3546358345093979000.1387245281.1387245281.1387245281.1; __oc_uuid=0ebcc900-7ccd-11e3-81ff-35dcea2f8639; Province=020; City=020; NTES_SESS=sgRKiliatn1nmaR1ASDZmCGlsHyZ9IfF1lBLtMap6uJyVg255XvOEWbV3X15UCZNBKW2.IDleysVpLB2OApCuSGPHhpr.Ur0PoWdL4rx6eGEWt7v5QfHAYIz9cyP0sUGMvC7ugsxOtthRcWwBB9q4bRYEEBKa_GVm; S_INFO=1394180189|0|3&100##|gse7en2010; P_INFO=gse7en2010@163.com|1394180189|0|note|11&14|gud&1394170428&cbg#gud&440100#10#0#0|&0|flashmail&cbg|gse7en2010@163.com; ANTICSRF=26c0924dbb5abee5dc55e49882e2c900; NTES_REPLY_NICKNAME=gse7en2010%40163.com%7Cgse7en2010%7C2618866008846770912%7C3160956326%7Chttp%3A%2F%2Fmimg.126.net%2Fp%2Fbutter%2F1008031648%2Fimg%2Fface_big.gif%7C%7C1%7C2; n_ht_s=1; cm_newmsg=user%3Dgse7en2010%26new%3D21%26total%3D325; vjlast=1359520703.1394501024.11; _ntes_nnid=f4ae07c6cd2ce0f672d0c5f5e243f890,1394501023870; sid9543=000AAMHsjvOSu4j5hfuiJXlv7yq1xaTQ4l5U_4vypSF'
            },
            form: {
                "topiclist_id": 12,
                "keywords": "技能法术-门派法术",
                "title": "苍茫树",
                "resources": '{"default_album_id":1,"albums":[{"id":1,"images":[]}]} ',
                "body": "【苍茫树】　&gt;&gt;普陀山门派法术<br/>　　此法术位于门派技能<span >五行学说</span><span >下<br/>　　</span><span >效果</span><span >：<br/>　　1、PK：对</span><span >玩家</span><span >只能攻击</span><span >1个</span><span >目标<br/>　　2、任务：对</span><span >怪物NPC</span><span >可秒多个，</span><span >最多6个</span><span ><br/>　　攻击个数=技能等级/45+2<br/>　　五行学说技能=180级，</span><span >秒6个</span><span ><br/>　　五行学说技能=135级，</span><span >秒5个</span><span ><br/>　　五行学说技能=90级，</span><span >秒4个</span><span ><br/>　　五行学说技能=45级，</span><span >秒3个</span><span ><br/>　　五行学说技能=13级，</span><span >秒2个</span><span ><br/>　　小精灵提醒：<br/>　　1、五行学说技能等级越高，攻击个数越多，伤害越大<br/>　　2、学习奇经八脉推衍、莲心剑意、法咒都可增加五行法术输出<br/>　　3、装备镶嵌</span><span >行云流水</span><span >符石组合可提升伤害<br/>　　<br/>　　如需GM帮助，小精灵推荐快速服务通道：<br/>　　1、<a  target=\"_blank\"></a></span><a  target=\"_blank\"><font >&gt;&gt;客服专区</font><span ></span></a>：处理<span >被盗问题</span><span >、</span><span >点卡问题</span><span >等<br/>　　2、<a  target=\"_blank\"></a></span><a  target=\"_blank\"><font >&gt;&gt;游戏在线联系GM</font></a>\n".replace(/\n$/, '').replace(/小精灵提醒.*/g, '')
            }
        };

    //.replace(/\n$/,'')
    function postCallback(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            ep.emit(name);
        }
    }

    function setOption(obj) {
        var options = {
            url: 'http://esalesdev.163.com:5356/app/article/add',
            method: 'post',
            headers: {
                'Cookie': 'sid9543=000AAMHsjvOSu4j5hfuiJXlv7yq1xaTQ4l5U_4vypSF'
            },
            form: {
                "topiclist_id": 12,
                "keywords": obj.titel,
                "title": obj.titel,
                "resources": '{"default_album_id":1,"albums":[{"id":1,"images":[]}]} ',
                "body": obj.answer.replace(/\n$/, '').replace(/小精灵提醒.*/g, '')
            }
        };
    }

    function epAction(name,options){
        request(options,function(error,response,body){
            if (!error && response.statusCode == 200) {
                ep.emit(name);
            }
        })
    }

    dataList.forEach(function (item, index) {
        if(index){
            epNameList.push(item.titel);
        }
    })

    var ep=eventproxy.create(epNameList,function(){
        res.send(200);
    })


    dataList.forEach(function(item,index){
        if(index){
            epAction(item.titel,setOption(item.titel));
        }
    })

}