function ana(){//sayfa tamamen yüklendikten sonra çalışacak
    document.getElementById('ground').innerHTML="";
    document.getElementById('cozum').innerHTML="";
    var grafikDOM = document.getElementById('grafik');

    while (grafikDOM.firstChild) {
        grafikDOM.removeChild(grafikDOM.firstChild);
    }

    var m1 = parseInt(document.getElementById('kutle1').value);
    var m2 = parseInt(document.getElementById('kutle2').value);
    var v1 = parseInt(document.getElementById('hiz1').value);
    var v2 = parseInt(document.getElementById('hiz2').value);
    var carpisma = false;
    var vs = 0;
    var v1_ = 0, v2_ = 0;

    var svg=Pablo('#ground').svg({//yükseklik ve genişlik ayarı svg için
        width:1000,
        height:400
    });

    var yazi = svg.text({
        x:400,
        y:55,
        fill:'brown',
        'font-size':'20px',
        'font-family':'sans-serif'
    })
    .content('Enter Tuşuna Basınız!');

    var timer = 20; //20ms

    var top1;//topun özelliklerini tutar
    var topX1=100;//topun x noktası
    var topY1=200;//topun y noktası
    var topR1=100;//topun yarıçapı

    var top2;//topun özelliklerini tutar
    var topX2=500;//topun x noktası
    var topY2=200;//topun y noktası
    var topR2=100;//topun yarıçapı


    top1=svg.circle({//daire oluşturmaya yarayan metot
        cx:topX1,
        cy:topY1,
        r:topR1,
        fill:'#060',
    });
    var top1yazi = svg.text({
        x:topX1-20,
        y:topY1,
        fill:'white',
        'font-size':'20px',
        'font-family':'sans-serif'
    })
    .content('V1 = '+v1);
    top2=svg.circle({//daire oluşturmaya yarayan metot
        cx:topX2,
        cy:topY2,
        r:topR2,
        fill:'#aaa'
    });
    var top2yazi = svg.text({
        x:topX2-20,
        y:topY2,
        fill:'white',
        'font-size':'20px',
        'font-family':'sans-serif'
    })
    .content('V2 = '+v2);

        Pablo.template('star', function(options){
            var points = options.points || 6,
                size = options.size || 20,
                x = options.x || 0,
                y = options.y || 0,
                theta = 360 / points,
                pathString = 'm' + size*1.5 + ',' + size*0.75,
                // Should be 1/points to 0.5*points
                depth = points * 0.375,
                angle = 0, i, x1, y1, x2, y2;

            size = (size * 8) / (points+5.5);
            for (i=0; i<points; i++){
                angle = Math.PI * theta * i / 180; 
                x1 = size * Math.cos(angle); 
                y1 = size * Math.sin(angle);
                angle = Math.PI * theta * (i+depth) / 180; 
                x2 = size * Math.cos(angle); 
                y2 = size * Math.sin(angle);
                pathString += 'l'+x1+','+y1+'l'+x2+','+y2;
            }
            return Pablo.path({
                d: pathString,
                transform: 'translate('+x+','+y+')'
            });
        });

    var JSONdata = '{"animationEnabled": false,"theme": "dark","title":{"text": "Hız Zaman Grafiği"},'+
            '"axisX":{"title":"Zaman (sn)"}, "axisY":{"title":"Hız (cm/sn)", "includeZero": false},'+
            '"data": [{ "type": "line",   "dataPoints": [{"":""}]},{ "type": "line",   "dataPoints": [{"":""}]}]}';
            
    var obj = JSON.parse(JSONdata);
    var chart;
    var counter = 0;

$(document).keydown(function(event){//klavye tuşlarına basılma anı
    //37 sol---  38 yukarı  ----39 sağ  ----  40 aşağı
    //32 space ----  13 enter  ----   27  esc
    var code=event.which;

    
    if(code==13){//sol yön tuşuna basıldı
       
        var interval = setInterval(function(){
            yazi.content("Vs = "+vs);
            if (topX2>850 || topX1<100 || counter>2000) {

                clearInterval(interval);
            }
                top1.attr({cx:topX1,cy:topY1});
                top2.attr({cx:topX2,cy:topY2});
                top1yazi.attr({x:topX1-50,y:topY1});
                top2yazi.attr({x:topX2-50,y:topY2});
           
            if (carpisma) {
                top1yazi.content("V1 = "+vs);
                top2yazi.content("V2 = "+vs);
                topX1 += v1_;
                topX2 += v2_;
                if ((counter%100)==0) {
                    obj.data[0].dataPoints.push({"x":counter/1000,"y":vs});
                    obj.data[1].dataPoints.push({"x":counter/1000,"y":vs});
                }
            }
            else
            {
                topX1 += v1;
                topX2 += v2;
                if ((counter%100)==0) {
                    obj.data[0].dataPoints.push({"x":counter/1000,"y":v1});
                    obj.data[1].dataPoints.push({"x":counter/1000,"y":v2});
                }
            }

            if(topX1>=topX2-200)//x ekseni sınırlarıyla çarpışma
            {
                topX2 = topX1+200;

                vs = (m1*v1+m2*v2)/(m1+m2);
                vs = Math.round(vs*100)/100;

                document.getElementById('cozum').innerHTML = "<h3>ÇÖZÜM</h3>v<sub>s</sub>=v<sub>1</sub><sup>'</sup>"
                    +"=v<sub>2</sub><sup>'</sup><br>"
                    +"m<sub>1</sub>*v<sub>1</sub>+m<sub>2</sub>*v<sub>2</sub>=m<sub>1</sub>*v<sub>s</sub>+m<sub>2</sub>*v<sub>s</sub><br>"
                    +"v<sub>s</sub> = (m<sub>1</sub>*v<sub>1</sub>+m<sub>2</sub>*v<sub>2</sub>)/(m<sub>1</sub>+m<sub>2</sub>)<br>"
                    +"v<sub>s</sub> = ("+m1+"*"+v1+"+"+m2+"*"+v2+")/("+m1+"+"+m2+")<br>"
                    +"v<sub>s</sub> = "+vs;

                v1_= vs;
                v2_= vs;
              /*  yildiz= svg.star({points:4, x:topX1+75, y:topY2-20})
                   .attr({fill:'orange'});
                setTimeout(function() {
                    yildiz.remove();
                },timer);*/
                carpisma=true;
            }

        
        chart = new CanvasJS.Chart("grafik", obj);
        chart.render(); 

        counter+=timer;

        },timer);

        }

           
    });
}