/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
    { id: 1001, state: "Alabama", county: "Autauga County", rate: 5.1 },
        ....
 */

// constants
const width = 700;
const height = 500;
const margin = {
  top: 20,
  left: 50,
  right: 20,
  bottom: 50,
};

var visWidth = width - margin.left - margin.right;
var visHeight = height - margin.top - margin.bottom;

// TASK 1: Select the slider #bins-slider and add a input listener that adjusts
// the value of the <span> #bins-counter to the currently selected value and calls the method update()
// Hint: See https://github.com/d3/d3-selection#selection_on

d3.select("#bins-slider")
  .on("input", (event, d) => {
    var sliderValue = event.currentTarget.valueAsNumber;
    d3.select("#bins-counter").property("innerHTML", sliderValue.toString())
    update(sliderValue);
  });

// TASK 2: Write a function 'update', that realizes the general update pattern of d3 to create a histogram of the data using the currently selected number of bins.
// The update function has one parameter 'numbins' that describes how many bins are currently selected in the #bins-slider <input> element.
// The update function should create a bar chart in the <svg> element with the id #chart
// Use the methods enter() to create new bars, exit() to remove no longer needed bars and merge() to update existing bars
function update(numbins) {

    // TASK 2.1: Create an linear x scale given the extent of the data to the width of the svg. Be careful to consider the left and right margins.
    //// Create x scale from data extent as domain and SVG width as range
    var xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.rate))
      .range([margin.left, visWidth])
      .nice();
 
    // TASK 2.2: Bin the data using https://github.com/d3/d3-array/blob/main/README.md#bin
    // Make sure to specify the following attributes: domain and threshold, threshold is the approximate number of bins.
    // Afterwards bin the input data
    //// Generate the bin array of all values according to domain and thresholds
    const binner = d3.bin()
      .domain(xScale.domain())
      .thresholds(numbins);
    const bins = binner(data.map((d => d.rate)));

    // TASK 2.3: Create a linear y scale to given the number of elements in the bins [0, max(elements in bin)]
    //// Create y scale for max elements in bins as domain and SVG height as range
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)])
      .range([visHeight, margin.top])
      .nice();
  
    // TASK 2.4: Select the #chart <svg> element.
    var svg = d3.select("#chart");

    // TASK 2.5: Connect all <rect> children of the svg with the bins (be careful to use the length of the bins, not the bin elements)
    var rectangles = svg
      .selectAll("rect")
      .data(bins);
   
    // TASK 2.6: Remove superfluous rectangles from the visualization  
    rectangles
      .exit()
      .remove();

    // TASK 2.7 & 2.8: Append a rectangle for every newly added rect to the visualization, and merge the entered rectangles with the
    // existing rectangles. Update their position (x, y, width, height).
    rectangles
      .enter()
      .append("rect")
      .merge(rectangles)
      .transition() 
      .duration(250)
        .attr("x", 1)
        .attr("transform", d => "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")")
        .attr("width", d => (xScale(d.x1) - xScale(d.x0) - 1))
        .attr("height", d => (visHeight - yScale(d.length)))

    // Task 2.9: Add a x scale to the visualization
    // Hint: https://github.com/d3/d3-axis
    d3.select("#xaxis")
      .attr("transform", 
             "translate(0, " + (visHeight) + ")")
      .call(d3.axisBottom(xScale));

    // Task 2.10: Add a y scale to the visualization
    d3.select("#yaxis")
      .attr("transform",
            "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(yScale));
}

// Call update function with initial value to create visualization on first site visit
update(20);
