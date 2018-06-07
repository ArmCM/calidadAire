var chart,ctx,color,dataLocal=[],mymap=L.map("mapid").setView([16.8889,-100],5),valores=[],valoresRango=[],etiquetas=[],lbls={days:[],hours:[]},lastAverageOrData=0,ant_val_arr=[],ant_val_arr_rango=[],ant_val_arr_promedio=[],ant_lab_arr=[],ant_lab_arr_dias=[],ant_lab_arr_horas=[],arrPM10=[],arrPM2=[],arrNO2=[],arrCO=[],arrO3=[],arrSO2=[],extension="",hourSelected="",stationSelected="",dataHour={D:"1hr",8:"8hrs",24:"24hrs"},contador_vacios=0,ant=0,banderaPromedios=!0,ultimosEstados=[],pollutantsDescription={PM10:"Las partículas menores o iguales a 10 micras (PM<sub>10</sub>) se depositan en la región extratorácica del tracto respiratorio (nariz, boca, naso, oro y laringofarínge); contienen principalmente materiales de la corteza terrestre y se originan en su mayoría por procesos de desintegración de partículas más grandes. También pueden contener material biológico como polen, esporas, virus o bacterias o provenir de la combustión incompleta de combustibles fósiles.","PM2.5":"Las partículas menores o iguales a 2.5 micras (PM<sub>2.5</sub>) están formadas primordialmente por gases y por material proveniente de la combustión. Se depositan fundamentalmente en la región traqueobronquial (tráquea hasta bronquiolo terminal), aunque pueden ingresar a los alvéolos.",NO2:"El dióxido de nitrógeno es un compuesto químico gaseoso de color marrón amarillento, es un gas tóxico e irritante. La exposición a este gas disminuye la capacidad de difusión pulmonar.",SO2:"Gas incoloro que se forma al quemar combustibles fósiles que contienen azufre. La exposición a niveles altos de este contaminante produce irritación e inflamación de garganta y bronquios.",O3:"Es un compuesto gaseoso incoloro, que posee la capacidad de oxidar materiales, y causa irritación ocular y en las vías respiratorias.",CO:"Es un gas incoloro e inodoro que en concentraciones altas puede ser letal ya que forma carboxihemoglobina, la cual impide la oxigenación de la sangre."};function ponerTemperatura(a){$.ajax({type:"GET",url:a,data:{},success:function(a,e,t){for(var o="",r=0;r<a.results.length;r++)a.results[r].valororig<=60&&-50<=a.results[r].valororig&&(o=a.results[r].valororig.toFixed(2));""!==o?($("#temperatura_detalle").text(o+" ℃"),$("#temperatura_detalle_m").text(o+" ℃")):$(".temperatura").hide()},xhrFields:{withCredentials:!1},crossDomain:!0,async:!0})}function resetButtonDays(){$(".parametro").removeClass("active"),$("#pinta_primero").addClass("active")}function buscarCiudad(a){for(var e="",t=0;t<estaciones_json.length;t++){var o=estaciones_json[t];if(o.id.toString()===a.toString()){e=o.city;break}}return e}function cambioBotonActivo(a){$(".boton_pop").each(function(){$(this).removeClass("active_pop")}),$("#"+a).addClass("active_pop")}function hacerFechaValida(a){var e=a.split("T"),t=e[1].split("."),o=e[0].split("-")[0],r=parseInt(e[0].split("-")[1],10)-1,s=e[0].split("-")[2],n=t[0].split(":")[0],l=t[0].split(":")[1],i=t[0].split(":")[2];return new Date(o,r,s,n,l,i)}function convertDate(a){function e(a){return a<10?"0"+a:a}var t=new Date(a);return[e(t.getDate()),e(t.getMonth()+1),t.getFullYear()].join("/")}function options_estado(){for(var a='<option value="0">1.-Selecciona un estado</option>',e=0;e<coor_estado.length;e++){var t=coor_estado[e];a+='<option value="'+t.estado+'">'+t.estado+"</option>"}return a}function getNewDatas(a){var s=[],e=moment(),n=!1,l=moment().minutes(0).seconds(0).milliseconds(0);function i(a){s.push({date:a.format(),"date-insert":e.format(),fecha:a.format("YYYY-MM-DD"),hora:a.get("hour"),parametro:null,validoorig:null,valororig:null}),a.add(1,"hour")}if(l.add(-671,"hour"),a.forEach(function(a,e){var t=a.fecha,o=a.hora,r=moment(t+" "+(o<10?"0"+o:o)+":00:00");if(r.get("hour")!==o)s.push(a),n=!0;else if(r.format()===l.format()||1===l.get("hour")&&2===o)s.push(a),l.add(1,"hour");else{for(;r.format()!==l.format();)i(l);s.push(a),l.add(1,"hour")}}),s.length<672)for(var t=s.length;t<=671;t++)i(l);return n?i(l):n||673!==s.length||s.pop(),s}function existeUltimoPromedio(a){for(var e=0;e<ultimosEstados.length;e++)if(ultimosEstados[e].etiqueta===a)return e;return-1}function ponerReocmendaciones(){for(var a=0;a<ultimosEstados.length;a++){var e=rangoInecc(ultimosEstados[a].parametro,ultimosEstados[a].horas);ultimosEstados[a].valor>e&&$("#recomendaciones").show()}}function getUltimoRango(a){for(var e="",t=0;t<ultimosEstados.length;t++)ultimosEstados[t].etiqueta===a&&(e=ultimosEstados[t]);return e}function putGrafica(a,e,t){0<dataLocal.results.length&&(dataLocal.results=getNewDatas(dataLocal.results));var o=dataLocal.results,r=[],s=[];etiquetas=[],lbls.days=[],lbls.hours=[];for(var n=a+""+e,l=0;l<o.length;l++){if(o[l].valororig<t&&null!==o[l].valororig&&0<=o[l].valororig){r.push(o[l].valororig);var i=existeUltimoPromedio(n);"D"===e&&(-1!==i?(ultimosEstados[i].valor=o[l].valororig,ultimosEstados[i].fecha=o[l].fecha,ultimosEstados[i].hora=o[l].hora):ultimosEstados.push({etiqueta:n,fecha:o[l].fecha,hora:o[l].hora,horas:e,parametro:a,valor:o[l].valororig}))}else r.push(null);if(lbls.days.push(o[l].fecha),lbls.hours.push(o[l].hora.toString()+":00"),0===o[l].hora?(etiquetas.push(o[l].fecha),0):(etiquetas.push(""),0),"D"!==e)if(e-1<=l){for(var c=0,d=0,u=(hacerFechaValida(o[l].date).getTime(),l);l-(e-1)<=u;u--){hacerFechaValida(o[u].date);var h=o[u].valororig;h<t&&null!==h&&0<=h&&(c+=h,d++)}if(.75*e<=d){var m=c/e;s.push(m),-1!==(i=existeUltimoPromedio(n))?(ultimosEstados[i].valor=m,ultimosEstados[i].fecha=o[l].fecha,ultimosEstados[i].hora=o[l].hora):ultimosEstados.push({etiqueta:n,fecha:o[l].fecha,hora:o[l].hora,horas:e,parametro:a,valor:m})}else s.push(null)}else s.push(null);else s.push(null)}null!==(lastAverageOrData="D"!==e?null!==s[s.length-1]&&0<=s[s.length-1]?s[s.length-1]:0:null!==r[r.length-1]&&0<=r[r.length-1]?o[o.length-1].valororig:0)&&(lastAverageOrData=(lastAverageOrData=lastAverageOrData.toString()).substring(0,lastAverageOrData.indexOf(".")+4));for(var g=rangoInecc(a,e),p=[],b=0;b<r.length;b++)p[b]=g;var v={labelInfo:"",labelLimit:"",label:""},f=parameter_decorator(a,!1);"D"!==e?(v.labelInfo="Promedio horario de "+f+" en "+e+"hrs.",v.labelLimit="Límite NOM",v.label="Promedio móvil de "+e+" hrs. para "+f,v.label+="24"===e?" **":""):(v.labelInfo="Promedio horario de "+f,v.labelLimit="Límite NOM",v.label=e),extension="PM10"===a||"PM2.5"===a?" µg/m³":" ppm",actualizar_grafica_detalle(r,etiquetas,lbls,p,s,v)}function rangoInecc(a,e){var t=0;switch(a+""+e){case"PM1024":t=75;break;case"PM2.524":t=45;break;case"O3D":t=.095;break;case"SO2D":t=.025;break;case"SO224":t=.11;break;case"SO28":t=.2;break;case"O38":t=.07;break;case"NO2D":t=.21;break;case"CO8":t=11;break;default:t=0}return t}function actualizar_grafica_detalle(a,e,t,o,r,s){chart.data.datasets[0].data=o,"D"!==s.label&&!0===banderaPromedios?(chart.data.datasets[1].data=r,chart.data.datasets[1].label=s.label,chart.data.datasets[1].backgroundColor=color(window.chartColors.green).alpha(.2).rgbString(),chart.data.datasets[1].borderColor=window.chartColors.green,chart.data.datasets[1].pointBackgroundColor=window.chartColors.green):"D"===s.label&&!0===banderaPromedios&&(chart.data.datasets[1].data=a,chart.data.datasets[1].label=s.labelInfo,chart.data.datasets[1].backgroundColor=color(window.chartColors.blue).alpha(.2).rgbString(),chart.data.datasets[1].borderColor=window.chartColors.blue,chart.data.datasets[1].pointBackgroundColor=window.chartColors.blue),chart.data.datasets[0].label=s.labelLimit,chart.data.labels=e,chart.data.labels.dias=t.days,chart.data.labels.horas=t.hours,chart.update(),poner_botones(a)}function poner_botones(a){ant=a.length;var e=[{scope:Math.round(72),num:3},{scope:Math.round(168),num:7},{scope:Math.round(336),num:14},{scope:Math.round(672),num:28}];$(".parametro").each(function(a){$(this).text(e[a].num+" días"),$(this).val(e[a].scope)})}function convertDate(a){var e=a.getFullYear().toString(),t=(a.getMonth()+1).toString(),o=a.getDate().toString(),r=t.split(""),s=o.split("");return e+"-"+(r[1]?t:"0"+r[0])+"-"+(s[1]?o:"0"+s[0])}function getFormatDateAPI(a){return a.getFullYear()+"-"+meis[a.getMonth()]+"-"+(a.getDate()<10?"0":"")+a.getDate()+"T"+(a.getHours()<10?"0":"")+a.getHours()+":00:00"}function ponEstacionesSel(){for(var a=document.getElementById("estado_primer_select").value,e='<option value="0">2.-Seleccionar estación</option>',t=0,o=0;o<estaciones_json.length;o++){var r=estaciones_json[o];r.state===a&&r.activa&&(e+='<option value="'+r.id+'">'+r.city+" - "+r.nombre+"</option>",t++)}0<t?$("#estaciones_select").html(e):$("#estaciones_select").html('<option value="0">Sin estaciones</option>')}function cambiaCoor(){var t=document.getElementById("estados").value;jQuery.each(coor_estado,function(a,e){t===e.estado&&mymap.setView([e.lat,e.long],e.zoom-1)})}function DateFalsa(){return new Date("2018-03-07 00:00:00")}function llenarConstaminantes(a,o){$.ajax({type:"GET",url:a,data:{},success:function(a,e,t){if(0<a.results.length)if($("#myModal").modal("show"),$(".forLoader").removeClass("hide").slideUp(),"PM10"===o)arrPM10=a,cambioParametro("PM10","24","botonPM10");else if("PM2.5"===o)arrPM2=a,cambioParametro("PM2.5","24","botonPM25");else if("NO2"===o)arrNO2=a,cambioParametro("NO2","D","botonNO2");else if("CO"===o)arrCO=a,cambioParametro("CO","8","botonCO");else if("O3"===o&&""===hourSelected)arrO3=a,cambioParametro("O3","D","botonO3D");else if("O3"===o&&""!==hourSelected)arrO3=a,cambioParametro("O3",hourSelected,"botonO3"+hourSelected);else if("SO2"===o&&""===hourSelected)arrSO2=a,cambioParametro("SO2","8","botonSO28");else{if("SO2"!==o||""===hourSelected)return 0;arrSO2=a,cambioParametro("SO2",hourSelected,"botonSO2"+hourSelected)}else if(contador_vacios++,$("#conataminatesMovil option").each(function(a){if(!(-1<$(this).val().indexOf(o)))return 0;$(this).attr("disabled","disabled")}),"PM2.5"===o)arrPM2=a,$("#botonPM25").addClass("bloqueado");else if("PM10"===o)arrPM10=a,$("#botonPM10").addClass("bloqueado");else if("NO2"===o)arrNO2=a,$("#botonNO2").addClass("bloqueado");else if("CO"===o)arrCO=a,$("#botonCO").addClass("bloqueado");else if("O3"===o)arrO3=a,$("#botonO38").addClass("bloqueado"),$("#botonO3D").addClass("bloqueado");else{if("SO2"!==o)return 0;arrSO2=a,$("#botonSO28").addClass("bloqueado"),$("#botonSO224").addClass("bloqueado")}if(6!==contador_vacios)return 0;$(".forLoader").removeClass("hide").slideUp(),$("#alertModal").modal("show"),contador_vacios=0,$(".boton_pop").each(function(){$(this).removeClass("bloqueado")})},xhrFields:{withCredentials:!1},crossDomain:!0,async:!0})}function generaUrl(a,e,t){var o=new Date,r=new Date;return r.setHours(o.getHours()-t),"https://api.datos.gob.mx/v2/sinaica-30?parametro="+a+"&estacionesid="+e+"&date>"+getFormatDateAPI(r)+"&date<="+getFormatDateAPI(o)+"&validoorig=1&pageSize=1000"}function changeMovilOption(a,e){"PM10"===a&&$("#conataminatesMovil").val("PM10"),"PM2.5"===a&&$("#conataminatesMovil").val("PM2.5"),"NO2"===a&&$("#conataminatesMovil").val("NO2"),"SO2"===a&&"D"===e&&$("#conataminatesMovil").val("SO2D"),"SO2"===a&&"8"===e&&$("#conataminatesMovil").val("SO28"),"SO2"===a&&"24"===e&&$("#conataminatesMovil").val("SO224"),"O3"===a&&"D"===e&&$("#conataminatesMovil").val("O3D"),"O3"===a&&"8"===e&&$("#conataminatesMovil").val("O38"),"CO"===a&&$("#conataminatesMovil").val("CO8")}function parameter_decorator(a,e){var t="";switch(a){case"PM10":t=e?"PM<sub>10</sub>":"PM₁₀";break;case"PM2.5":t=e?"PM<sub>2.5</sub>":"PM₂.₅";break;case"SO2":t=e?"SO<sub>2</sub>":"SO₂";break;case"NO2":t=e?"NO<sub>2</sub>":"NO₂";break;case"O3":t=e?"O<sub>3</sub>":"O₃";break;default:t="CO"}return t}function cambioParametro(a,e,t){if($("#alerta").hide(),$("#recomendaciones").hide(),$("#"+t).hasClass("bloqueado"))return 0;cambioBotonActivo(t),changeMovilOption(a,e);$("#estado_primer_select").val(),$("#estaciones_select").val();$("#contaminante_detalle").html(parameter_decorator(a,!0)),$("#contaminante_grafica").html(parameter_decorator(a,!0)),$("#tituloTexto").html(parameter_decorator(a,!0)),$("#textoTitulo").html(pollutantsDescription[a]);var o,r=0,s=0,n="";if("PM10"===a)r=600,dataLocal=arrPM10,s=rangoInecc(a,e),n="µg/m³";else if("PM2.5"===a)r=175,dataLocal=arrPM2,s=rangoInecc(a,e),n="µg/m³";else if("NO2"===a)r=.21,dataLocal=arrNO2,s=rangoInecc(a,e),n="ppm";else if("CO"===a)r=15,dataLocal=arrCO,s=rangoInecc(a,e),n="ppm";else if("O3"===a)r=.2,dataLocal=arrO3,s=rangoInecc(a,e),n="ppm";else{if("SO2"!==a)return 0;r=.2,dataLocal=arrSO2,s=rangoInecc(a,e),n="ppm"}putGrafica(a,e,r),o=lastAverageOrData;var l=getUltimoRango(a+""+e);if(""!==l){var i=l.valor.toString();i=i.substring(0,i.indexOf(".")+4),$(".chart-gauge").html(""),$(".chart-gauge").gaugeIt({selector:".chart-gauge",value:i,label:n,gaugeMaxValue:2*s}),$(".date-gauge").html(l.fecha+" -- "+l.hora+":00:00 CST")}else $(".chart-gauge").html(""),$(".chart-gauge").gaugeIt({selector:".chart-gauge",value:0,label:n,gaugeMaxValue:2*s}),$(".date-gauge").html("");0<o&&s<o&&$("#recomendaciones").show()}function sacaDatoDiario(a,e,t){if("D"!==e){var o=new Date,r=new Date;r.setHours(o.getHours()-e);for(var s=a.results,n=[],l=s.length-1;0<l;l--){var i=hacerFechaValida(s[l].date);if(!(i.getTime()>=r.getTime()&&i.getTime()<=o.getTime()))break;n.push(s[l])}var c=0,d=0;for(l=0;l<n.length;l++){if(!(n[l].valororig<t&&1===n[l].validoorig))return 0;d+=n[l].valororig,c++}d=c=0;for(var u=s.length-1,h=u;u-e<h;h--){if(!(s[h].valororig<t&&1===s[h].validoorig))return 0;d+=s[h].valororig,c++}return.75*n.length<c?d/c:0}return a.results[a.results.length-1].valororig<t?a.results[a.results.length-1].valororig:0}function buscarEstacion(a){for(var e={},t=0;t<estaciones_json.length;t++){var o=estaciones_json[t];if(o.id===a){e=o;break}e=e}return e}$(document).ready(function(){function a(){var a,e,t;t=$(window).width(),a=(e=$(window).height())/476,846/476<=t/e&&(a=t/846),t<569?$("#video").css({width:1600,height:970}):$("#video").css({width:846*a,height:476*a}),$("#videoBlock").css("height",e)}$("#estados").val("Aguascalientes"),$(".forLoader").removeClass("hide").slideUp(),$("#infoModal").modal(),$("#myModal").on("hidden.bs.modal",function(){contador_vacios=0,ultimosEstados=[],$(".boton_pop").each(function(){$(this).removeClass("bloqueado")});var a=[];chart.data.datasets[0].data=a,chart.data.datasets[1].data=a,chart.data.labels=a,chart.update(),poner_botones(a),$(".temperatura").show(),$(".chart-gauge").html(""),$(".chart-gauge").gaugeIt({selector:".chart-gauge",value:0,gaugeMaxValue:10}),$("#conataminatesMovil option").each(function(a){$(this).attr("disabled",!1)}),$("#alerta").hide()}),$('[data-toggle="tooltip"]').tooltip(),$("#max-values p").on("click",function(){hourSelected=$(this).attr("data-hour"),llenarConstaminantes(generaUrl($(this).attr("data-id"),stationSelected,672),$(this).attr("data-id")),resetButtonDays()}),$("#estado_primer_select").on("change",function(){ponEstacionesSel()}),$("#estados").on("change",function(){cambiaCoor()}),mymap.panTo(new L.LatLng(24.8,-100)),L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(mymap),/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)&&mymap.dragging.disable(),mymap.scrollWheelZoom.disable(),$("#estado_primer_select").html(options_estado()),$("#estaciones_select").on("change",function(){$(".forLoader").show();var a=$(this).val();$("#fecha_detalle").html(convertDate(new Date)),$("#fecha_detalle_m").html(convertDate(new Date));buscarEstacion(a);$("#titulo_detalle").html(buscarCiudad(a)),$("#estacion_detalle").html($("#estaciones_select option:selected").text()),$("#estacion_detalle_m").html("<b>"+$("#estaciones_select option:selected").text()+"</b>");var e="botonPM10";$("#textoTitulo").html($("#"+e).attr("data-original-title")),cambioBotonActivo(e),resetButtonDays(),hourSelected="",llenarConstaminantes(generaUrl("PM10",stationSelected=a,672),"PM10"),llenarConstaminantes(generaUrl("PM2.5",a,672),"PM2.5"),llenarConstaminantes(generaUrl("NO2",a,672),"NO2"),llenarConstaminantes(generaUrl("SO2",a,672),"SO2"),llenarConstaminantes(generaUrl("O3",a,672),"O3"),llenarConstaminantes(generaUrl("CO",a,672),"CO"),ponerTemperatura(generaUrl("TMP",a,3),"TMP")}),ctx=document.getElementById("myChart").getContext("2d"),color=Chart.helpers.color,chart=new Chart(ctx,{type:"line",data:{labels:["January","February","March","April","May","June","July"],datasets:[{label:"Límite móvil",borderColor:window.chartColors.red,backgroundColor:window.chartColors.red,fill:!1,data:[10,10,10,10,10,10,10],pointRadius:1.3,borderWidth:1},{label:"Promedio horario",backgroundColor:color(window.chartColors.blue).alpha(.2).rgbString(),borderColor:window.chartColors.blue,pointBackgroundColor:window.chartColors.blue,data:[0,10,5,2,20,30,45],fill:!1,pointRadius:1.3,borderWidth:1}]},options:{legend:{display:!0},tooltips:{callbacks:{title:function(a,e){return e.labels.dias[a[0].index]+"  --  "+e.labels.horas[a[0].index]+" hrs"},label:function(a,e){var t=e.datasets[a.datasetIndex].data[a.index].toString();return e.datasets[a.datasetIndex].label+": "+t.substring(0,t.indexOf(".")+4)}}},scales:{yAxes:[{ticks:{callback:function(a,e,t){var o=a.toString();return o.substring(0,o.indexOf(".")+4)+extension},padding:5,min:0}}],xAxes:[{gridLines:{display:!0,drawBorder:!0,drawOnChartArea:!1},ticks:{autoSkip:!1,maxRotation:90,minRotation:0}}]}}}),$(".parametro").click(function(a){a.preventDefault(),$(".parametro").removeClass("active"),$(this).addClass("active");var e=parseInt($(this).val(),10);chart.data.datasets[0].data.length;if(chart.data.labels=etiquetas,e<ant)for(var t=ant-e,o=0;o<t;o++)ant_val_arr.push(chart.data.datasets[0].data.splice(0,1)),ant_val_arr_rango.push(chart.data.datasets[1].data.splice(0,1)),2<chart.data.datasets.length&&ant_val_arr_promedio.push(chart.data.datasets[2].data.splice(0,1)),ant_lab_arr.push(chart.data.labels.splice(0,1)),ant_lab_arr_dias.push(chart.data.labels.dias.splice(0,1)),ant_lab_arr_horas.push(chart.data.labels.horas.splice(0,1));else if(ant<e)for(t=e-ant,o=0;o<t;o++)chart.data.datasets[0].data.unshift(ant_val_arr.pop()[0]),chart.data.datasets[1].data.unshift(ant_val_arr_rango.pop()[0]),2<chart.data.datasets.length&&chart.data.datasets[2].data.unshift(ant_val_arr_promedio.pop()[0]),chart.data.labels.unshift(ant_lab_arr.pop()[0]),chart.data.labels.dias.unshift(ant_lab_arr_dias.pop()[0]),chart.data.labels.horas.unshift(ant_lab_arr_horas.pop()[0]);ant=e,chart.update()}),$("#conataminatesMovil").change(function(){if("PM10"===$(this).val())cambioParametro("PM10","24","botonPM10");else if("PM2.5"===$(this).val())cambioParametro("PM2.5","24","botonPM25");else if("NO2"===$(this).val())cambioParametro("NO2","D","botonNO2");else if("SO2D"===$(this).val())cambioParametro("SO2","D","botonSO2D");else if("SO28"===$(this).val())cambioParametro("SO2","8","botonSO28");else if("SO224"===$(this).val())cambioParametro("SO2","24","botonSO224");else if("O3D"===$(this).val())cambioParametro("O3","D","botonO3D");else if("O38"===$(this).val())cambioParametro("O3","8","botonO38");else{if("CO8"!==$(this).val())return 0;cambioParametro("CO","8","botonCO")}}),$("#go-map").click(function(a){a.preventDefault();var e=$("#map-section").position().top;$("html, body").animate({scrollTop:e},300)}),$(window).resize(function(){a()}),a()});