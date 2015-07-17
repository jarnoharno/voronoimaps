// Get google maps bounding box in a format accepted by Raymond Hill's Voronoi
// diagram library.
//
// map: A fully initialized Google maps object.
// return: Bounding box of the Google maps window.

function mapBbox(map) {
  var bounds = map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  return {
    xl: sw.lng(),
    xr: ne.lng(),
    yt: sw.lat(),
    yb: ne.lat()
  };
}

function mean(x) {
  var y = x[0].slice();
  for (var i = 1; i < x.length; ++i) {
    for (var j = 0; j < y.length; ++j) {
      y[j] += x[i][j];
    }
  }
  for (var j = 0; j < y.length; ++j) {
    y[j] = y[j]/x.length;
  }
  return y;
}

function vertexToLatLng(vertex) {
  return new google.maps.LatLng(vertex.y, vertex.x);
}

function arrayToLatLng(array) {
  return new google.maps.LatLng(array[0], array[1]);
}

function toVertex(x) {
  return { x: x[1], y: x[0] };
}

function toVertices(x) {
  return x.map(toVertex);
}

// parse jsonp data files to global variables

function parseData(labels, sites) {
  window.labels = labels;
  window.sites = sites;
}

// Compute voronoi diagram and convert to Google Maps polygons.

function voronoiPolygons(labels, sites, bbox, voronoi) {
  var vertices = toVertices(sites);
  var diagram = voronoi.compute(vertices, bbox);
  return diagram.cells.map(function(cell) {
    var label = sites[cell.site.voronoiId][2];
    var path = cell.halfedges.map(function(edge) {
      return vertexToLatLng(edge.getStartpoint());
    });
    return new google.maps.Polygon({
      path: path,
      strokeOpacity: 0.0,
      strokeWeight: 0,
      fillColor: labels[label][1],
      fillOpacity: 0.4
    });
  });
}

function initVoronoi() {
  var voronoi = new Voronoi();
  return {
    compute: function(labels, sites, bbox) {
      return voronoiPolygons(labels, sites, bbox, voronoi);
    }
  };
}
