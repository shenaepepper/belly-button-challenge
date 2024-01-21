// Define the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data;

// Initialize the page
function init() {
    
    d3.json(url).then((jsonDatadata) => {
        data = jsonDatadata; 
        console.log(data); 
        
        let dropdown = d3.select("#selDataset");
        
        data.names.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });

        let firstSample = data.names[0];
        buildPlots(firstSample);
        buildBubbleChart(firstSample);
        displaySampleMetadata(firstSample);
        buildGaugeChart(firstSample);
    });
}
// Build the plots
function buildPlots(sample) {
        
        var selectedSample = data.samples.filter((s) => s.id === sample)[0];

        selectedSample.sample_values.sort((a, b) => b - a);

        var top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        var top10OTUIds = selectedSample.otu_ids.slice(0, 10).reverse();
        var top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();

        // Create the bar chart
        var trace = {
            x: top10SampleValues,
            y: top10OTUIds.map((id) => `OTU ${id}`),
            text: top10OTULabels,
            type: "bar",
            orientation: "h"
        };

        var plotData = [trace];

        var layout = {
            title: `Top 10 OTUs`,
        };

        Plotly.newPlot("bar", plotData, layout);
}
// Create the bubble chart
function buildBubbleChart(sample) {
        
        var selectedSample = data.samples.filter((s) => s.id === sample)[0];
        
        var otuIds = selectedSample.otu_ids;
        var sampleValues = selectedSample.sample_values;
        var otuLabels = selectedSample.otu_labels;
        var trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,  
                color: otuIds,       
                colorscale: 'Electric'  
            }
        };
        var plotData = [trace];
        var layout = {
            title: `Sample Size for OTU's`,
             };
        Plotly.newPlot("bubble", plotData, layout);
    }
// Display the metadata
function displaySampleMetadata(sample) {
        
        var metadata = data.metadata.filter((m) => m.id == sample)[0];
        
        var metadataPanel = d3.select("#sample-metadata");
        
        metadataPanel.html("");
        
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
}
// Build the gauge chart
function buildGaugeChart(sample) {
        
        var selectedMetadata = data.metadata.filter((m) => m.id == sample)[0];
        
        var wfreq = selectedMetadata.wfreq;
        
        var plotData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Weekly Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9] }, 
                    bar: { color: "#212121" }, 
                    steps: [
                        { range: [0, 1], color: "#FFEBEE" },
                        { range: [1, 2], color: "#FFCDD2" },
                        { range: [2, 3], color: "#EF9A9A" },
                        { range: [3, 4], color: "#E57373" },
                        { range: [4, 5], color: "#EF5350" },
                        { range: [5, 6], color: "#F44336" },
                        { range: [6, 7], color: "#E53935" },
                        { range: [7, 8], color: "#D32F2F" },
                        { range: [8, 9], color: "#C62828" }
                ]}}];
        var layout = {
            width: 400,
            height: 300,
            margin: { t: 0, b: 0 },
        };

        Plotly.newPlot("gauge", plotData, layout);
}

function optionChanged(sample) {
    buildPlots(sample);
    buildBubbleChart(sample);
    displaySampleMetadata(sample);
    buildGaugeChart(sample); // Call the gauge chart function here
}

init();