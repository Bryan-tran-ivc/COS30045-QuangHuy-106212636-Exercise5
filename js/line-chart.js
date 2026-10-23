d3.csv("data/ARE_Spot_Prices.csv", d => {
    if (!d.year?.trim()) return null;
    return { year: +d.year, averagePrice: +d.averagePrice };
  }).then(data => {
    console.log("Price data:", data);
    drawLineChart(data);
  }).catch(console.error);

  function drawLineChart(data) {
    const width = 760;
    const height = 440;
    const margin = { top: 30, right: 26, bottom: 66, left: 76 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, innerWidth]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.averagePrice)])
      .nice()
      .range([innerHeight, 0]);

    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.averagePrice));

    const svg = d3.select("#line-chart").append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Line and scatter chart of annual average electricity spot prices");
    const innerChart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    innerChart.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""));

    innerChart.append("path")
      .attr("class", "line-mark")
      .attr("d", lineGenerator(data));

    innerChart.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("class", "point-mark")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("r", 4.5);

    innerChart.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(7).tickFormat(d3.format("d")));
    innerChart.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `$${d}`));

    innerChart.append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 52)
      .attr("text-anchor", "middle")
      .text("Year");
    innerChart.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -56)
      .attr("text-anchor", "middle")
      .text("Average spot price ($/MWh)");
  }
