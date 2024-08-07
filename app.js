function lineChart(lineData, id) {
    var margin = {top: 10, right: 30, bottom: 50, left: 30},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#" + id)
        .html("")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var datasets = Object.keys(lineData).filter(k => k !== "timestamp").map(function (key) {
        return lineData[key].map((value, i) => {
            return {date: lineData.timestamp[i], value: value};
        });
    });

    var x = d3.scaleTime()
        .domain(d3.extent(lineData.timestamp))
        .range([0, width]);

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(15));

    xAxis.selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    var yMax = d3.max(datasets.flat(), d => d.value);
    var y = d3.scaleLinear()
        .domain([0, yMax * 1.2])
        .range([height, 0]);

    var yAxis = svg.append("g")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(".2s")));

    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.value); });

    // Add a clipPath
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    var colors = d3.schemeCategory10;
    var linesGroup = svg.append("g")
        .attr("class", "lines")
        .attr("clip-path", "url(#clip)");

    datasets.forEach(function (data, i) {
        linesGroup.append("path")
            .datum(data)
            .attr("class", "line line" + (i + 1))
            .attr("fill", "none")
            .attr("stroke", colors[i % colors.length])
            .attr("stroke-width", 1.5)
            .attr("d", line);
    });

    // Add brushing
    var brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", updateChart);

    linesGroup.append("g")
        .attr("class", "brush")
        .call(brush);

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart() {
        extent = d3.event.selection

        if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
            x.domain(d3.extent(lineData.timestamp));
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])]);
            linesGroup.select(".brush").call(brush.move, null);
        }

        xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(15));
        linesGroup.selectAll('.line')
            .transition()
            .duration(1000)
            .attr("d", line);
    }

    // If user double click, reinitialize the chart
    svg.on("dblclick", function() {
        x.domain(d3.extent(lineData.timestamp));
        xAxis.transition().call(d3.axisBottom(x).ticks(15));
        linesGroup.selectAll('.line')
            .transition()
            .attr("d", line);
    });

    function toggleLine(selector) {
        var line = svg.select(selector);
        var isVisible = line.style("display") !== "none";
        line.style("display", isVisible ? "none" : null);
    }

    function lineVisibility(button_id, line_class, visibility) {
        var line = svg.select(line_class);
        var color = colors[parseInt(line_class[line_class.length - 1]) - 1];

        if (visibility) {
            line.style("display", null);
            d3.select(button_id)
                .attr('class', 'btn chart-btn')
                .style('background-color', color)
                .style('color', 'white');
        } else {
            line.style("display", 'none');
            d3.select(button_id)
                .style('color', color)
                .style('background-color', '#e3e3e3');
        }
    }

    var buttonVisibilityObject = JSON.parse(localStorage.getItem('interfaceStatisticsButtons')) || {};
    var line1Visibility = buttonVisibilityObject.line1Visibility || true;
    var line2Visibility = buttonVisibilityObject.line2Visibility || true;
    var line3Visibility = buttonVisibilityObject.line3Visibility || true;
    var line4Visibility = buttonVisibilityObject.line4Visibility || true;

    lineVisibility('#toggleLine1', '.line1', line1Visibility);
    lineVisibility('#toggleLine2', '.line2', line2Visibility);
    lineVisibility('#toggleLine3', '.line3', line3Visibility);
    lineVisibility('#toggleLine4', '.line4', line4Visibility);

    d3.select("#toggleLine1").on("click", function () {
        line1Visibility = !line1Visibility;
        buttonVisibilityObject.line1Visibility = line1Visibility;
        localStorage.setItem("interfaceStatisticsButtons", JSON.stringify(buttonVisibilityObject));
        lineVisibility('#toggleLine1', '.line1', line1Visibility);
    });

    d3.select("#toggleLine2").on("click", function () {
        line2Visibility = !line2Visibility;
        buttonVisibilityObject.line2Visibility = line2Visibility;
        localStorage.setItem("interfaceStatisticsButtons", JSON.stringify(buttonVisibilityObject));
        lineVisibility('#toggleLine2', '.line2', line2Visibility);
    });

    d3.select("#toggleLine3").on("click", function () {
        line3Visibility = !line3Visibility;
        buttonVisibilityObject.line3Visibility = line3Visibility;
        localStorage.setItem("interfaceStatisticsButtons", JSON.stringify(buttonVisibilityObject));
        lineVisibility('#toggleLine3', '.line3', line3Visibility);
    });

    d3.select("#toggleLine4").on("click", function () {
        line4Visibility = !line4Visibility;
        buttonVisibilityObject.line4Visibility = line4Visibility;
        localStorage.setItem("interfaceStatisticsButtons", JSON.stringify(buttonVisibilityObject));
        lineVisibility('#toggleLine4', '.line4', line4Visibility);
    });
}


var data = {

        "timestamps": [
            1722944089380,
            1722944119380,
            1722944149380,
            1722944179380,
            1722944209380,
            1722944239380,
            1722944269380,
            1722944299380,
            1722944329380,
            1722944359380,
            1722944389380,
            1722944419380,
            1722944449380,
            1722944479380,
            1722944509380,
            1722944539380,
            1722944569380,
            1722944599380,
            1722944629380,
            1722944659380,
            1722944689380,
            1722944719380,
            1722944749380,
            1722944779380,
            1722944809380,
            1722944839380,
            1722944869380,
            1722944899380,
            1722944929380,
            1722944959380
        ],
        "values": {
            "a": [
                966488,
                422131,
                773831,
                820248,
                290668,
                893475,
                3492,
                976290,
                535157,
                945745,
                942567,
                803571,
                849347,
                690223,
                940243,
                711891,
                466844,
                318194,
                904293,
                14078,
                228436,
                530313,
                10422,
                395961,
                206518,
                313436,
                43937,
                828237,
                840640,
                206332
            ],
            "b": [
                594212,
                31819,
                651447,
                84030,
                220822,
                656285,
                937557,
                712931,
                22311,
                448111,
                967335,
                593447,
                680988,
                47031,
                752218,
                366970,
                587900,
                713417,
                509409,
                186923,
                838567,
                481679,
                434319,
                308075,
                687183,
                866779,
                300433,
                460167,
                328650,
                190954
            ],
            "c": [
                594685,
                416626,
                804334,
                313923,
                147741,
                467845,
                480239,
                992906,
                20667,
                139108,
                997090,
                880000,
                44576,
                656774,
                625467,
                682153,
                782651,
                352095,
                701976,
                564673,
                474509,
                730254,
                129189,
                930944,
                176163,
                628917,
                639206,
                892454,
                222573,
                259820
            ],
            "d": [
                880099,
                185998,
                885364,
                281223,
                524958,
                834767,
                409411,
                655060,
                613348,
                861000,
                122004,
                125931,
                103359,
                42272,
                143942,
                474282,
                295966,
                568137,
                16525,
                100029,
                710931,
                744890,
                473792,
                32054,
                70011,
                240502,
                730016,
                409675,
                281933,
                454240
            ]
        }
}

console.log(data.bps);


var bpsData = {}

bpsData["timestamp"] = data.timestamps
bpsData["a"] = data.values.a
bpsData["b"] = data.values.b
bpsData["c"] = data.values.c
bpsData["d"] = data.values.d

lineChart(bpsData, 'line_chart')



