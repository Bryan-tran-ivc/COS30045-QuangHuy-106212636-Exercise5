d3.csv("data/tvSizeGroups.csv", d => {
    if (!d.sizeGroup?.trim()) return null;
    return { sizeGroup: d.sizeGroup.trim(), count: +d.count };
  }).then(data => {
    console.log("Size group data:", data);
    drawDonutChart(data);
  }).catch(console.error);

  function drawDonutChart(data) {
    const width = 560;
    const height = 470;
    const radius = 170;
    const total = d3.sum(data, d => d.count);
    const colours = d3.scaleOrdinal()
      .domain(data.map(d => d.sizeGroup))
      .range(["#286fbd", "#d76c28", "#23865a"]);
    const pie = d3.pie().sort(null).value(d => d.count);
    const arc = d3.arc().innerRadius(radius * 0.58).outerRadius(radius).cornerRadius(8).padAngle(0.025);

    const svg = d3.select("#donut-chart").append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Donut chart showing TV models by size group");
    const chart = svg.append("g").attr("transform", `translate(${width / 2},${height / 2 - 24})`);
    const arcs = pie(data);

    chart.selectAll("path")
      .data(arcs)
      .join("path")
      .attr("d", arc)
      .attr("fill", d => colours(d.data.sizeGroup));

    chart.selectAll("text.donut-label")
      .data(arcs)
      .join("text")
      .attr("class", "donut-label")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .text(d => `${Math.round(d.data.count / total * 100)}%`);

    chart.append("text").attr("class", "donut-centre-number").attr("y", -4).text(d3.format(",")(total));
    chart.append("text").attr("class", "donut-centre-caption").attr("y", 23).text("models");

    const legend = svg.append("g").attr("transform", `translate(90,${height - 28})`);
    const legendItems = legend.selectAll("g").data(data).join("g")
      .attr("transform", (_, i) => `translate(${i * 145},0)`);
    legendItems.append("circle").attr("r", 6).attr("fill", d => colours(d.sizeGroup));
    legendItems.append("text").attr("class", "legend-text").attr("x", 12).attr("dy", ".35em").text(d => d.sizeGroup);
  }
