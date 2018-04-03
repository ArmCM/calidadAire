// RequireJS configuration
// -----------------------------------

require.config({
  baseUrl: 'js',
  paths: {
    jquery: 'vendor/jquery-2.1.1',
    bootstrap: 'vendor/bootstrap-3.3.7',
    leaflet: 'vendor/leaflet',
    d3: 'vendor/d3.v3',
    gaugeIt: 'vendor/jquery.gaugeIt',
    chart: 'vendor/chartjs/Chart.bundle',
    utils: 'vendor/chartjs/utils',
    stations: 'estaciones_json',
    states: 'estados_mexico'
  }
});

require(
  ['https://framework-gb.cdn.gob.mx/gobmx.js', 'utils', 'gaugeIt', 'main'],
  (gobmx, utils, gaugeIt, main) => {});