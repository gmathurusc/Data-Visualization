var width = $("svg").width();
var height = $("svg").height();
var colors = ["#FD8110", "#26A625", "#D22829", "#9166C3", "#895844", "#E277C8", "#7E7E7E"];

var projection = d3.geo.mercator()
    .scale(250)
    .center([-60, -20])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

d3.json("world-110m.json", function(error, world) {
	if (error) return console.error(error);

	d3.selectAll("svg").append("path")
	    .datum(topojson.feature(world, world.objects.countries))
	    .attr("d", path);
});

var svg = d3.select("svg");

var query = 'id:* AND location2_s:*';
var url = "http://localhost:8983/solr/jobposts/select?q=" + encodeURIComponent(query) + "&rows=50000&fl=longitude_d%2C+latitude_d&wt=json";

d3.json(url, function(error, resp) {
	if (error) return console.error(error);

	resp.response.docs.forEach(function(loc) {
		svg.append("circle")
		.attr("r", 1.2)
		.attr("transform", "translate(" + projection([loc.longitude_d, loc.latitude_d]) + ")")
		.style("fill", colors[6]);
	});

});
