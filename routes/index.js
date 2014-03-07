/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};


exports.crawler = function (req, res) {
    var eventProxy=require('eventproxy'),
        requestLib=require('request'),
        baseUrl='http://xyq.gm.163.com/cgi-bin/csa/csa_sprite.py?act=ask&product_name=xyq&question=',
        dataList=require("../model/dataList.js"),
        epNameList=[],
        resultArr=[];



    //构造ep队列
    dataList.forEach(function(item,index){
        if(index==1){
            var lv1Name=item.name;
            item.content.forEach(function(itemContent,index){
                var lv2Name=itemContent.desc;
                epNameList.push(lv1Name+'-'+lv2Name);

            })
        }
    });


    var ep=eventProxy.create(epNameList,function(){
        console.log(resultArr);
        res.send(resultArr);
    });

    //执行ep队列
    dataList.forEach(function(item,index){
        if(index==1){
            var lv1Name=item.name;
            item.content.forEach(function(itemContent,index){
                var lv2Name=itemContent.desc;
                itemContent.data.forEach(function(itemData){
                   getAnswer(itemData,lv1Name+'-'+lv2Name);
                })
            })
        }
    });

    //取得结果
    function getAnswer(question,tag){
        requestLib(baseUrl+question,function(error,response,body){
            if(!error&&response.statusCode==200){
                var result=JSON.parse(body);
                resultArr.push({
                    tag:tag,
                    titel:question,
                    answer:result.answer
                });
                console.log(result.answer);
                ep.emit(tag);
            }else{
               // res.send('not work')
            }
        });
    }


}