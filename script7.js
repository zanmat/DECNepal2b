

    d3.tsv("DECData.tsv", function(data) {
     // drawMarkerSelect(data);
      drawMarkerArea(data);
    });


    function drawMarkerArea(data) {

      var xf = crossfilter(data);

      var groupname = "marker-select";

      var all = xf.groupAll();

      dc.dataCount("#dc-data-count", groupname)
            .dimension(xf)
            .group(all);

      var o = d3.scale.ordinal()
            .domain("Oxfam", "Age International")
            // .range(colorbrewer.RdBu[9]);

      var byAgency = xf.dimension(function(d) { return d.Agency; });
      var byAgencyGroup = byAgency.group().reduceCount();

      var bySector = xf.dimension(function(d) { return d.Sector; });
      var bySectorGroup = bySector.group().reduceCount();

      var byCountry = xf.dimension(function(d) { return d.Country; });
      var byCountryGroup = byCountry.group().reduceCount();

      var byProvince = xf.dimension(function(d) { return d.Province; });
      var byProvinceGroup = byProvince.group().reduceCount();

      var activities = xf.dimension(function(d) { return d.geo; });
      var activitiesGroup = activities.group().reduceCount();

      var dataTable = dc.dataTable(".dc-data-table");

      var tableData = crossfilter(data);
      var all = tableData.groupAll();
      var dimension = tableData.dimension(function (d) {
        return d.Agency;
        
      }  );
        

		
        
        
      dataTable.width(960).height(5000)
      .dimension(dimension)
      .group(function(d) {return "Who What Where"})
      .columns([
        function(d) {return d.Agency;},
        function(d) {return d.Sector;},
        function(d) {return d.Country;},
        function(d) {return d.Province;}
      ]);


      dc.leafletMarkerChart("#map .map", groupname)
          .dimension(activities)
          .group(activitiesGroup)
          .width(400)
          .height(390)
          .center([28,84])
          .zoom(7)
          .cluster(true)
          // .marker(function (d, map){return d.Agency})
          .filterByArea(true)
          .renderPopup(false)
          // .bindPopup('sup')
          .popup(function (d, map) {
            return d.Agency;
          })
          .brushOn(true);

    dc.rowChart("#Sector .Sector", groupname)
          .margins({top: 5, left: 10, right: 10, bottom: 30})
          .width(200)
          .height(300)
          .dimension(bySector)
          .group(bySectorGroup)
          .colors(d3.scale.category10())
          .title(function(d){return d.value;})
          .ordering(function(d) { return -d.value; })
          .elasticX(true)
          .xAxis().ticks(4);

    dc.rowChart("#Agency .Agency", groupname)
          .margins({top: 5, left: 10, right: 10, bottom: 60})
          .width(200)
          .height(300)
          .dimension(byAgency)
          .colors(["cadetblue"])
          .group(byAgencyGroup)
          .title(function (d){
                return d.value;
                })
          .ordering(function(d) { return -d.value; })
          .elasticX(true)
          .xAxis().ticks(4);

    dc.rowChart("#Province .Province", groupname)
          .margins({top: 5, left: 10, right: 10, bottom: 50})
          .width(200)
          .height(200)
          .dimension(byProvince)
          .group(byProvinceGroup)
          .colors(["gray"])
          .title(function (d){return d.value;})
          .ordering(function(d) { return -d.value; })
          .elasticX(true)
          .xAxis().ticks(4);

    $('#reset').on('click', function (){
      dc.filterAll(groupname);
      dc.redrawAll(groupname);
      return false;
    })
      dc.renderAll(groupname);
    }


