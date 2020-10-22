var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// creating an SVG wrapper and appending an SVG group to hold my chart

var svg = d3.select('#scatter')
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chart_group = svg.append("g")
  .attr("transform",`translate(${margin.left}, ${margin.top})`);

// selecting age and income as my variables, and casting them to integers
d3.csv("assets/data/data.csv").then(function(health_data) {

    health_data.forEach(function(data) {
        data.age = +data.age;
        data.income = +data.income;
    });

    // creating my scale functions so that my chart looks good while
    // fitting my data

    var xLinearScale = d3.scaleLinear()
        .domain([30, d3.max(health_data, d => d.age)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([30000, d3.max(health_data, d => d.income)])
        .range([height, 0]);

    // creating my x and y axes

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // adding these axes to the chart

    chart_group.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart_group.append("g")
        .call(leftAxis);

    // creating my circles

    var myCircles = chart_group.selectAll("circle")
    .data(health_data)
    .enter()
    .append("circle")
    .classed('stateCircle',true)
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r","10")
    .attr("opacity","1");
    
    var myText = chart_group.selectAll(".stateText")
        .data(health_data)
        .enter()
        .append("text")
        .classed("stateText",true)
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.income))
        .attr("dy",3)
        .attr("font-size","9px")
        .text(function(d) {
            return (`${d.abbr}`)
        });

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8,0])
      .html(function(d) {
         return (`Average Age: ${d.age}<br>Average Income: ${d.income}`);
      });

    chart_group.call(toolTip);

    myCircles.on("mouseover", function(data) {
        toolTip.show(data,this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    myText.on("mouseover", function(data) {
        toolTip.show(data,this);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    // this will create my y axis label
    chart_group.append("text")
        .attr("transform","rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class","axisText")
        .text("Income ($)")
        .attr("font-weight", 700);

    // this will create my x axis label
    chart_group.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age")
        .attr("font-weight", 700);
//   }).catch(function(error) {
//         console.log(error);

  });