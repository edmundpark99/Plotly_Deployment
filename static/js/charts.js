function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultSample);
    //  5. Create a variable that holds the first sample in the array.
    var resultForSample = resultSample[0];
    console.log(resultForSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = resultForSample.otu_ids
    var otuIdsSliced = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    console.log(otuIdsSliced)

    var otuLabels = resultForSample.otu_labels;
    var otuLabelsSliced = otuLabels.slice(0,10).reverse();
    console.log(otuLabelsSliced);

    var sampleValues = resultForSample.sample_values;
    var sampleValuesSliced = sampleValues.slice(0,10).reverse();
    console.log(sampleValuesSliced);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();

    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x:sampleValuesSliced,
      y:otuIdsSliced,
      text:otuLabelsSliced,
      type: "bar",
      orientation: 'h',
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 0.8}
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
      titleFont: {"size": 25},
      xaxis: {title: "Sample Values"}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'RdBu'
      }
    }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      titleFont: {"size": 25},
      hovermode: "closest",
      height: 500
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
      var gaugeResult = gaugeArray[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var wfreqs = gaugeResult.wFreq;
    console.log(wfreqs)
    // Create the yticks for the bar chart.

    // Use Plotly to plot the bar data and layout.
    Plotly.newPlot();
    
    // Use Plotly to plot the bubble data and layout.
    Plotly.newPlot();
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
     {value: wfreqs,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},

        bar: {color: "black"},
        steps:[
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "thistle"},
          {range: [6.8], color: "mediumslateblue"},
          {range: [8,10], color: "royalblue"},
        ]
      }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      titlefont: {"size": 25}
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
