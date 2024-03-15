let table = document.getElementById('content-table');
let totalFactura = 0;
let disponibles = 0;

get = document.getElementById('cargarDatos')

get.addEventListener('click', () => {
  getAttachmentsFromGmail().then(function(responses) {
    responses.forEach(function(response) {
      var data = response.result.data;
      var decodedData = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
      var byteArray = new Uint8Array(decodedData.length);
      for (var i = 0; i < decodedData.length; i++) {
        byteArray[i] = decodedData.charCodeAt(i);
      }
      var blob = new Blob([byteArray], {type: 'application/zip'});
      unzipAndProcess(blob)
      totalFactura++;
      document.getElementById('TotalFacturas').innerText = totalFactura.toString();
      document.getElementById('sendInvoices').style.display = 'block';
    });
  });
})

document.addEventListener('DOMContentLoaded', (event) => {
    setTimeout(function() {
      countAttachmentsFromGmail().then(function(responses) {
        responses.forEach(function(response) {
          var data = response.result.data;
          var decodedData = atob(data.replace(/-/g, '+').replace(/_/g, '/'));
          var byteArray = new Uint8Array(decodedData.length);
          for (var i = 0; i < decodedData.length; i++) {
            byteArray[i] = decodedData.charCodeAt(i);
          }
          var blob = new Blob([byteArray], {type: 'application/zip'});
          disponibles++;
          document.getElementById('cantidad').innerText = disponibles.toString();
        });
      });
    }, 3000);
});
  