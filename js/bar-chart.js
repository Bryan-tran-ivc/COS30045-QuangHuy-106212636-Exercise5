d3.csv("data/screenTypeEnergy55.csv", d => {
    if (!d.screenType?.trim()) return null;
    return { screenType: d.screenType.trim(), avgEnergy: +d.avgEnergy };
  }).then(data => {
    console.log("Screen type data:", data);
    drawBarChart(data);
  }).catch(console.error);

  function drawBarChart(data) {
    data.sort((a, b) => d3.ascending(a.avgEnergy, b.avgEnergy));
    const width = 720;
    const height = 440;
    const margin = { top: 30, right: 24, bottom: 72, left: 72 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.screenType))
      .range([0, innerWidth])
      .padding(0.24);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.avgEnergy)])
      .nice()
      .range([innerHeight, 0]);
    const colours = d3.scaleOrdinal()
      .domain(data.map(d => d.screenType))
      .range(["#2c9d66", "#ed7d31", "#286fbd", "#c59822", "#8b60bd"]);

    const svg = d3.select("#bar-chart").append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Vertical bar chart of average annual energy by screen type");
    const innerChart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    innerChart.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""));

    innerChart.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("class", "bar-mark")
      .attr("fill", d => colours(d.screenType))
      .attr("x", d => xScale(d.screenType))
      .attr("y", d => yScale(d.avgEnergy))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.avgEnergy))
      .attr("rx", 6);

    innerChart.selectAll("text.value-label")
      .data(data)
      .join("text")
      .attr("class", "value-label")
      .attr("x", d => xScale(d.screenType) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.avgEnergy) - 10)
      .attr("text-anchor", "middle")
      .text(d => `${d.avgEnergy} kWh`);

    innerChart.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0));
    innerChart.append("g").attr("class", "axis").call(d3.axisLeft(yScale).ticks(5));

    innerChart.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -52)
      .attr("text-anchor", "middle")
      .text("Average annual energy (kWh)");
  }
