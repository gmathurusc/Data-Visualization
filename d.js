var width = $("svg").width();
var height = $("svg").height();
var colors = ["#FD8110", "#26A625", "#D22829", "#9166C3", "#895844", "#E277C8", "#7E7E7E"];

var projection = d3.geo.mercator()
    .scale(220)
    .center([-75, -20])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

d3.json("world-110m.json", function(error, world) {
	if (error) return console.error(error);

	d3.selectAll("svg").append("path")
	    .datum(topojson.feature(world, world.objects.countries))
	    .attr("d", path);
});

function handler(error, resp, svg) {
	if (error) return console.error(error);

	resp.response.docs.forEach(function(loc) {
		svg.append("circle")
		.attr("r", 1.5)
		.attr("transform", "translate(" + projection([loc.longitude_d, loc.latitude_d]) + ")")
		.style("fill", colors[4]);
	});

}

$("input:radio").click(function() {
	d3.selectAll("circle").remove();
	var type = this.value;

	var first = d3.select(".first");
	var start = "2012-10-01T00:00:00Z";
	var end = "2012-12-01T00:00:00Z";
	var query = 'id:*00 AND location2_s:* AND jobtype_s:"' + type + '" AND postedDate_dt:[' + start + ' TO ' + end + ']';
	var url = "http://localhost:8983/solr/jobposts/select?q=" + encodeURIComponent(query) + "&rows=10000&fl=longitude_d%2C+latitude_d&wt=json";
	d3.json(url, function(error, resp) {
		handler(error, resp, first);
	});

	var second = d3.select(".second");
	var start = "2013-01-01T00:00:00Z";
	var end = "2013-03-01T00:00:00Z";
	var query = 'id:*00 AND location2_s:* AND jobtype_s:"' + type + '" AND postedDate_dt:[' + start + ' TO ' + end + ']';
	var url = "http://localhost:8983/solr/jobposts/select?q=" + encodeURIComponent(query) + "&rows=10000&fl=longitude_d%2C+latitude_d&wt=json";
	d3.json(url, function(error, resp) {
		handler(error, resp, second);
	});

	var third = d3.select(".third");
	var start = "2013-04-01T00:00:00Z";
	var end = "2013-06-01T00:00:00Z";
	var query = 'id:*00 AND location2_s:* AND jobtype_s:"' + type + '" AND postedDate_dt:[' + start + ' TO ' + end + ']';
	var url = "http://localhost:8983/solr/jobposts/select?q=" + encodeURIComponent(query) + "&rows=10000&fl=longitude_d%2C+latitude_d&wt=json";
	d3.json(url, function(error, resp) {
		handler(error, resp, third);
	});

	var fourth = d3.select(".fourth");
	var start = "2013-07-01T00:00:00Z";
	var end = "2013-09-01T00:00:00Z";
	var query = 'id:*00 AND location2_s:* AND jobtype_s:"' + type + '" AND postedDate_dt:[' + start + ' TO ' + end + ']';
	var url = "http://localhost:8983/solr/jobposts/select?q=" + encodeURIComponent(query) + "&rows=10000&fl=longitude_d%2C+latitude_d&wt=json";
	d3.json(url, function(error, resp) {
		handler(error, resp, fourth);
	});
});
