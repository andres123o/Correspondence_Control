

function unzipAndProcess(zipData) {
    JSZip.loadAsync(zipData).then(function (zip) {
        const xmlFile = zip.file(/\.xml$/i)[0];
        const pdfFile = zip.file(/\.pdf$/i)[0]; // Obtener el archivo PDF dentro del ZIP
        if (xmlFile) {
            xmlFile.async('string').then(function (xmlContent) {
              if (pdfFile){
                pdfFile.async('blob').then(function(blob) {
                  const pdfBlob =  new Blob([blob], {type: 'application/pdf'});

                  parseXML(xmlContent, pdfFile, URL.createObjectURL(pdfBlob)); // Pasar el archivo PDF a la función parseXML
                }) 
              } else {
                alert('No se encontró un archivo PDF dentro del archivo ZIP.');
              }   
            });
        } else {
            alert('No se encontró un archivo XML dentro del archivo ZIP.');
        }
        // if (pdfFile) {
        //   pdfFile.async('blob').then(function(blob) {
        //     const pdfBlob =  new Blob([blob], {type: 'application/pdf'});
        //   })
        // } else {
        //   alert('No se encontró un archivo PDF dentro del archivo ZIP.');
        // }
    }).catch(function (error) {
        alert('Error al descomprimir el archivo ZIP: ' + error.message);
    });
}

function parseXML(xmlContent, pdfFile, pdfNote) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
  const cbcRegistrationNameElements = xmlDoc.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'RegistrationName');
  const cbcCompanyIDElements = xmlDoc.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'CompanyID');
  const cbcParentDocumentID = xmlDoc.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'ParentDocumentID');
  const cbcIssueDate = xmlDoc.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'IssueDate');
  const cbcKind = xmlDoc.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'ProfileID');
  const cbcDescription = xmlDoc.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'Description');

  if (cbcRegistrationNameElements.length > 0 && cbcCompanyIDElements.length > 0 && cbcParentDocumentID.length > 0 && cbcIssueDate.length > 0) {
    const companyID = cbcCompanyIDElements[0].textContent;
    const registrationName = cbcRegistrationNameElements[0].textContent;
    const parentID = cbcParentDocumentID[0].textContent;
    const Date2 = cbcIssueDate[0].textContent;
    const kind = cbcKind[0].textContent;
    const description = cbcDescription[0].textContent;
    const resultsBody = document.getElementById('results-body');
    const resultRow = document.createElement('tr');

    const companyIDCell = document.createElement('td');
    companyIDCell.innerText = companyID;
    resultRow.appendChild(companyIDCell);

    const registrationNameCell = document.createElement('td');
    registrationNameCell.innerText = registrationName;
    resultRow.appendChild(registrationNameCell);

    const NumberInvoice = document.createElement('td');
    NumberInvoice.innerText = parentID;
    resultRow.appendChild(NumberInvoice);

    const DataInvoice = document.createElement('td');
    DataInvoice.innerText = Date2;
    resultRow.appendChild(DataInvoice);

    const Typekind = document.createElement('td');
    if (kind == "Factura Electrónica de Venta" || kind == "DIAN 2.1: Factura Electrónica de Venta" || kind == "DIAN 2.1") {
      Typekind.innerText = "FT";
    } else if (kind == "Nota Credito") {
      Typekind.innerText = "NC";
    } else {
      Typekind.innerText = "WHAT?";
    }
    resultRow.appendChild(Typekind);

 
    const descriptionXML = new DOMParser().parseFromString(description, 'text/xml');
    const cbcPayableAmount = descriptionXML.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'PayableAmount');
    const cacOrderReference = descriptionXML.getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2', 'OrderReference');

    if (cbcPayableAmount.length > 0) {
      const valuePay = parseFloat(cbcPayableAmount[0].textContent);

      const value = document.createElement('td')
      value.innerText = valuePay;
      resultRow.appendChild(value);
      
  
    } else {
      console.log("Error: No se encontró la etiqueta <cbc:PayableAmount> dentro de <cbc:Description>.");
    }

    const bogotaDate = document.createElement('td');
    const options = { timeZone: 'America/Bogota', year: 'numeric', month: 'numeric', day: 'numeric' };
    const bogotaDateFormatted = new Intl.DateTimeFormat('es-CO', options).format(new Date());
    bogotaDate.innerText = bogotaDateFormatted;
    resultRow.appendChild(bogotaDate);

    if (cacOrderReference.length > 0) {
      const cbcID = cacOrderReference[0].getElementsByTagNameNS('urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2', 'ID');

      if (cbcID.length > 0) {
        const orderReferenceID = cbcID[0].textContent;
        console.log(orderReferenceID)

        const eo = document.createElement('td')
        eo.innerText = orderReferenceID
        resultRow.appendChild(eo)

        // Cargar archivo JSON con Fetch
        fetch('/static/Backend/DataBAse/Owners.json')
          .then(response => response.json())
          .then(responsableData => {
            // Buscar info en el archivo JSON
            console.log(responsableData[orderReferenceID]["NAME"])
            const dvAnalyst = document.createElement('td');
            dvAnalyst.innerText = responsableData[orderReferenceID]["NAME"]
            resultRow.appendChild(dvAnalyst)

            const pdfLink = document.createElement('a');
            pdfLink.href = pdfNote;
            pdfLink.textContent = 'Abrir PDF';

            const pdfCell = document.createElement('td');
            pdfCell.appendChild(pdfLink);
            resultRow.appendChild(pdfCell);

            pdfLink.addEventListener('click', function (event) {
              if (pdfFile) {

                // Codigo de respaldo por si se produce un fallo
                // pdfFile.async('blob').then(function (blob) {
                //   const pdfURL = URL.createObjectURL(blob);
                //   const tempLink = document.createElement('a');
                //   tempLink.href = pdfURL;
                //   tempLink.target = '_blank';
                //   tempLink.download = parentID + '.pdf';
                //   tempLink.click();
      
                //   URL.revokeObjectURL(pdfURL);
                // });

                event.preventDefault();  // Previene la acción por defecto del enlace
                const pdfURL = pdfNote;
                window.open(pdfURL, '_blank');  // Abre el PDF en una nueva ventana o pestaña
              } else {
                alert('No se encontró un archivo PDF dentro del archivo ZIP.');
              }
            });
          })
          .catch(error => {
            console.error('Error al cargar el archivo JSON: ', error)
          })

      } else {
        eo.innerText = "Vacia";
        resultRow.appendChild(eo);
      }
    } else {
      eo.innerText = "Vacia";
      resultRow.appendChild(eo);

      const dvAnalyst = document.createElement('td');
      dvAnalyst.innerText = "Buscar";
      resultRow.appendChild(dvAnalyst);
      
    }


    resultsBody.appendChild(resultRow);

  } else {
    alert('No se encontraron los datos necesarios en el archivo XML.');
  }

  document.querySelector('.modal-empty').style.display = 'none';
  document.querySelector('.section').style.display = 'block';
}