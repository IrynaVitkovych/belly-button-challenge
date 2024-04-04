const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the data from the URL
d3.json(url).then(function (data) {
    console.log(data);
});

// Function to initialize the dashboard
function init() {
    // Fetch data from the specified URL using D3.json
    d3.json(url).then(function (data) {
        // Extract the names data from the fetched data
        let names = data.names
        // Select the dropdown element by its ID
        let dropdown = d3.select("#selDataset");
        // Populate the dropdown menu with options based on the names data
        for (let i = 0; i < names.length; i++) {
            dropdown.append("option")
            .text(names[i]) // Set the text of the option
            .property("value", names[i]); // Set the value of the option
        }
        // Display the panel with metadata for the first name in the names data
        popPanel(names[0]);
        // Draw the charts for the first name in the names data
        drawCharts(names[0])
    });
}

// Function to populate a panel with metadata based on a provided category
function popPanel(cat) {
    // Fetch data from the specified URL using D3.json
    d3.json(url).then(function (data) {
        // Extract the metadata array from the fetched data
        let metadata = data.metadata
        // Filter the metadata array to find the object with the matching id
        let result = metadata.filter(x => x.id == cat)[0]
        // Select the panel element using D3
        let panel = d3.select("#sample-metadata");
        // Clear any existing content inside the panel
        panel.html("")
        // Iterate over the key-value pairs in the result object and display them in the panel
        for (k in result) {
            panel.append("h6").text(`${k}: ${result[k]}`)
        }
    });
    // Log the provided category to the console for debugging
    console.log(cat);
}

// Function to draw charts based on the provided ID
function drawCharts(dog) {
    // Fetch data from the specified URL using D3.json
    d3.json(url).then(function (data) {
        // Extract the metadata array from the fetched data
        let samples = data.samples;
        let result2 = samples.filter(x => x.id == dog)[0];

        // Sort the data to get the top 10 OTUs based on sample_values
        let top10Values = result2.sample_values.slice(0, 10).reverse();
        let top10Ids = result2.otu_ids.slice(0, 10).reverse();
        let top10Labels = result2.otu_labels.slice(0, 10).reverse();

        // Create the trace for the horizontal bar chart
        let trace = {
            x: top10Values,
            y: top10Ids.map(id => `OTU ${id}`),
            text: top10Labels,
            type: 'bar',
            orientation: 'h'
        };
        let dataBar = [trace];

        // Define the layout for the bar chart
        let layoutBar = {
            title: 'OTU Data',
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU IDs' }
        };

        // Update the data and layout of the horizontal bar chart
        Plotly.newPlot('bar', dataBar, layoutBar);

        // Creating the Bubble chart
        let trace2 = {
            x: result2.otu_ids,
            y: result2.sample_values,
            text: result2.otu_labels,
            mode: 'markers',
            marker: {
                size: result2.sample_values,
                color: result2.otu_ids
            }
        };
        let dataBubble = [trace2];

        let layoutBubble = {
            title: '# of Sample Values per OTU ID',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Instances' }
        };

        // Update the data and layout of the Bubble chart
        Plotly.newPlot('bubble', dataBubble, layoutBubble);
    });
    console.log(dog);
}

function optionChanged(x) {
    popPanel(x);
    drawCharts(x)
}

init();