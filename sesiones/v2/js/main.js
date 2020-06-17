/*
*    main.js
*    Mastering Data Visualization with D3.js
*    11.1 - graph evolution
*/

var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom, 
    width = 900 - margin.left - margin.right;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width + margin.left + margin.right , height + margin.top + margin.bottom])
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

var formattedData;
//datos sesion
let sesiones = []
let nodos = []
let links = []

let simulation = d3.forceSimulation(nodos)
    .force("charge", d3.forceManyBody().strength(-60))
    .force("link", d3.forceLink(links).id(d => d.id))
    //.force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", tick);

let nodes = g.selectAll("circle")
    //.data(nodos)
    //.join("circle")
    //.attr("r", 5)
    //.attr("fill", "green")

d3.json("data/data.json").then(showData)

//$("#date-slider").slider({
//    max: 963,
//    min: 0,
//    step: 1,
//    start: function(event, ui){
//        sesion = ui.value - 0;
//        console.log('sesion: ', sesion)
//        //update(sesion)
//    }
//})

$("#date-slider").ionRangeSlider({
    skin: "big",
    min: 0,
    max: 963,
    step: 1,
    grid: true,
    onChange: function (data) {
        // fired on every range slider update
        console.log('on change', data.from)
        update(data.from)
    },
    //onFinish: function (data) {
    //    // fired on pointer release
    //    console.log('on finish',data.from)
    //},
});


function showData(data) {
    console.log('DATA:', data);
    

    data.map( sesion => {
        let element = {
            visitado: false,
            nombre : sesion.name,
            sesion : sesion.sesion,
            votacion : sesion.votacion,
            fecha : sesion.fecha,
            hora : sesion.hora,
            asunto : sesion.asunto,
            nodos : sesion.nodes,
            left: sesion.left,
            links: sesion.links,
            llinks: sesion.leftlinks
        }
        //console.log(element)
        sesiones.push(element)
    }) 
    console.log('sesiones', sesiones)
    update(0)
}

async function update(value) {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);

    data = sesiones[value]
    console.log('sesion: ', data)

    let tmpnodos, tmplinks

    for(var i = 0; i < value; i++){
        console.log(i)
        let data = sesiones[i]
        if (sesiones[i].visitado != true){
            await data.nodos.map(d => nodos.push({id: d.id}))
            await data.links.map(l=> links.push(l))
             sesiones[i].visitado = true
        }
        else {
            console.log('ya se visito')
        }
    }

    //if (data.visitado == false){
    //    data.nodos.map(n=> nodos.push({id: n.id}))
    //    console.log('Nodos update', nodos)
    //    data.links.map(l=> links.push(l))
    //    console.log('links', links)
    //    sesiones[value].visitado = true
    //}

    
    tmpnodos =  nodos.map(d =>  d);
    tmplinks =  links.map(d =>  d);
    
    console.log('tmpn', tmpnodos)
    console.log('tmpl', tmplinks)

    console.log('left', data.left)
    //data.left.map(n1=> {
    //    //console.log(n1.id)
    //    nodos.map(n => {
    //        if (n.id == n1.id){
    //            console.log('Son iguales', n)
    //            let index = tmpnodos.indexOf(n)
    //            console.log(index)
    //            tmpnodos.splice(index,1)
    //        }
    //    })
    //})
    
    console.log('leftlinks', data.llinks)

    //data.llinks.map(l1 => {
    //    links.map(l => {
    //        //console.log(l1)
    //        //console.log(l)
    //        if ((l1.source == l.source) && (l1.target == l.target) ){
    //            //console.log('son iguales')
    //            let index = tmplinks.indexOf(l)
    //            //console.log(index)
    //            tmplinks.splice(index,1)
    //        }
    //    })
    //})

    console.log('after', tmpnodos)
    nodes = nodes
        .data(tmpnodos, d => d.id)
        .join(
          enter => enter.append("circle").attr("r", 4)
            .call(enter => enter.transition().attr("r", 4).attr("fill", "green").transition().duration(500)),
          update => update.transition().duration(500),
          exit => exit.remove().transition().duration(500)
        );
          
    //console.log(simulation)
    nodes.append("title")
      .text(d => d.id);
    simulation.nodes(tmpnodos, d => d.id)

    //simulation.nodes().filter(d=> console.log(d))
    simulation.force("link").links(tmplinks);
    simulation.alpha(0.3).restart();

    
}

function tick() {
    nodes.attr("cx", d => d.x)
        .attr("cy", d => d.y);
} 