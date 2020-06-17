/*
*    main.js
*    Grafo individual para una simple sesion
*    Sesiones - 11.2
*/

var margin = { left:80, right:20, top:50, bottom:100 };
var height = 600 - margin.top - margin.bottom, 
    width = 900 - margin.left - margin.right;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width + margin.left + margin.right , height + margin.top + margin.bottom])
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

//const svg = d3.select("#chart-area")
//    .property("value", {nodes: [], links: []})
//    .append("svg")
//        .attr("viewBox", [-width / 2, -height / 2, width, height])
//.attr("width", (width + margin.left + margin.right)/2)
//.attr("height", (height + margin.top + margin.bottom)/2)
//let g = svg.append("g")
//    .attr("stroke", "#fff")
//    .attr("stroke-width", 1.5)

var sesion = 0;
var formattedData;
//datos sesion
var nombre = ''
var sesion = NaN
var votacion = NaN
var fecha = ''
var hora = ''
var asunto = ''
let nodos = {
    values : [],
    visited: false
}

let links = []
// var left = [] // solo para acumuladas

let simulation = d3.forceSimulation(nodos.values)
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

//nodes.append("text")
//  .text(d => d.id);

d3.json("data/data.json").then(showData)

function showData(data) {
    console.log('DATA:', data);
    
    nombre = data.name
    sesion = data.sesion
    votacion = data.votacion
    fecha = data.fecha
    hora = data.hora
    asunto = data.asunto
    nodos.values = [...data.nodes]
    nodos.visited = true
    links = [...data.links]

    console.log('nodos', nodos.values)
    console.log('links', links)

    nodes = nodes
        .data(nodos.values, d => d.id)
        .join(
          enter => enter.append("circle").attr("r", 0)
            .call(enter => enter.transition().attr("r", 4).attr("fill", "green").transition().duration(500)),
          update => update.transition().duration(500),
          exit => exit.remove().transition().duration(500)
        );
          
    //console.log(simulation)
    nodes.append("title")
      .text(d => d.id);
    simulation.nodes(nodos.values)
    //simulation.nodes().filter(d=> console.log(d))
    simulation.force("link").links(links);
    simulation.alpha(0.3).restart();
}


$("#date-slider").slider({
    max: 963,
    min: 0,
    step: 1,
    slide: function(event, ui){
        sesion = ui.value - 0;
        console.log('sesion: ', sesion)
        //console.log('FD update slider: ', formattedData[sesion])
        //update(formattedData[time]);
    }
})


function update() {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(100);

    console.log('name: ' + nombre + ' sesion: ' +  sesion + ' V ' + votacion)
    console.log(asunto)
    //console.log('nodos', nodos)
    //console.log('links', links)


}

function tick() {
    nodes.attr("cx", d => d.x)
        .attr("cy", d => d.y);
} 