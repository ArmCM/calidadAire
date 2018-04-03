// Common file (before: utilería)
// -------------------------------------

define(['leaflet'], (L) => {
  let temporale = [];
  let avg = 0;
  let totalt = 0;
  let d = new Date();
  let anio = d.getFullYear();
  let meis = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  let mes = meis[d.getMonth()];
  let deis = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
  let dia = deis[d.getDate()];
  let meses_abr = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  let mymap = L.map("mapid").setView([16.8889, -100], 5);

  return {
    meis: meis,
    deis: meis,

    restaHoras: (d, h) => {
      return d.getHours() - h;
    },

    get_mymap: () => { return mymap },

    get_fecha_corta:(d) => {
      let fecha = d.getFullYear() + '-' + meis[d.getMonth()] + '-' + ((d.getDate() < 10 ? '0' : '') + d.getDate());
      return fecha;
    },

    put_temperatura: (estacion, contenedor) => {
      let fActual = new Date();
      let url = "https://api.datos.gob.mx/v1/sinaica?parametro=TMP&fecha=" + get_fecha_corta(fActual) + "&estacionesid=" + estacion;
      $.ajax({
        type: 'GET',
        url: url,
        data: {},
        success: function (data, textStatus, jqxhr) {
          if (data.results.length > 0)
            contenedor.html(data.results[data.results.length - 1].valororig);
          else
            contenedor.html('ND');
        },
        xhrFields: {
          withCredentials: false
        },
        crossDomain: true,
        async: true
      });
    },

    reset_botones: () => {
      $('.parametro').each(function (index) {
        $(this).removeClass('active');
      });

      $('#pinta_primero').addClass('active');
    },

    get_fecha_formato: (fecha) => {
      //voltear fecha 
      let voltear = fecha.split('-');
      let nuevaFecha = voltear[1] + '/' + voltear[2] + '/' + voltear[0];
      let f = new Date(nuevaFecha);

      return f.getDate() + '-' + meses_abr[f.getMonth()];
    }
  }
});