var width = $("svg").width();
var height = $("svg").height();
var colors = ["#FD8110", "#26A625", "#D22829", "#9166C3", "#895844", "#E277C8", "#7E7E7E"];

var projection = d3.geo.mercator()
    .scale(220)
    .center([-85, -20])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

d3.json("world-110m.json", function(error, world) {
	if (error) return console.error(error);

	d3.selectAll("svg").append("path")
	    .datum(topojson.feature(world, world.objects.countries))
	    .attr("d", path);
});

var companies = [];
d3.json("http://localhost:8983/solr/jobposts/select?q=id%3A*+AND+location2_s%3A*&rows=0&wt=json&facet=true&facet.field=company_s", function(error, resp) {
	if (error) return console.error(error);

	var results = resp.facet_counts.facet_fields.company_s;
	for (var i = 0; i < 5; i++) {
		companies.push(results[i * 2]);
	}
});

var jobtypes = [];
d3.json("http://localhost:8983/solr/jobposts/select?q=id%3A*00+AND+location2_s%3A*&rows=0&wt=json&facet=true&facet.field=jobtype_s", function(error, resp) {
	if (error) return console.error(error);

	var results = resp.facet_counts.facet_fields.jobtype_s;
	for (var i = 0; i < 5; i++) {
		jobtypes.push(results[i * 2]);
	}
});

$("input:radio").click(function() {
	d3.selectAll("circle").remove();
	d3.selectAll("button").remove();

	var start = $(this).attr("data-start");
	var end = $(this).attr("data-end");
	var compSvg = d3.select(".company");
	var jobtypeSvg = d3.select(".jobtype");

	companies.forEach(function(comp, i) {
		var companyKey = $("<button/>").attr("type", "button").addClass("btn btn-xs map-key-button").css("background-color", colors[i]).text(comp);
		$(".company-keys").append(companyKey);

		var query = 'id:* AND location2_s:* AND company_s:"' + comp
		+ '" AND postedDate_dt:[' + start + ' TO ' + end + ']';
		var url = "http://localhost:8983/solr/jobposts/select?q=" + encodeURIComponent(query) + "&rows=1000&fl=longitude_d%2C+latitude_d&wt=json";
		d3.json(url, function(error, resp) {
			if (error) return console.error(error);

			resp.response.docs.forEach(function(loc) {
				compSvg.append("circle")
				.attr("r", 2)
				.attr("transform", "translate(" + projection([loc.longitude_d, loc.latitude_d]) + ")")
				.style("fill", colors[i]);
			});

		});
	});

	jobtypes.forEach(function(type, i) {
		var jobtypeKey = $("<button/>").attr("type", "button").addClass("btn btn-xs map-key-button").css("background-color", colors[i]).text(type);
		$(".jobtype-keys").append(jobtypeKey);

		var query = 'id:*00 AND location2_s:* AND jobtype_s:"' + type
		+ '" AND postedDate_dt:[' + start + ' TO ' + end + ']';
		var url = "http://localhost:8983/solr/jobposts/select?q=" + encodeURIComponent(query) + "&rows=10000&fl=longitude_d%2C+latitude_d&wt=json";
		d3.json(url, function(error, resp) {
			if (error) return console.error(error);

			resp.response.docs.forEach(function(loc) {
				jobtypeSvg.append("circle")
				.attr("r", 1.5)
				.attr("transform", "translate(" + projection([loc.longitude_d, loc.latitude_d]) + ")")
				.style("fill", colors[i]);
			});

		});
	});
});
