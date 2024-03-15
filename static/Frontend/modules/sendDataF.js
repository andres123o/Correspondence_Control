
document.getElementById('sendInvoices').addEventListener('click', async function() {
    // Obtén todas las filas de la tabla
    const rows = document.getElementById('table').rows;

    // Carga la base de datos de responsables
    const response = await fetch('/static/Backend/DataBAse/Owners.json');
    const DataBase = await response.json();

    // Recorre todas las filas de la tabla
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];

        // Obtén la información necesaria de cada fila
        const companyID = row.cells[0].innerText;
        const registrationName = row.cells[1].innerText;
        const parentID = row.cells[2].innerText;
        const Date2 = row.cells[3].innerText;
        const Typekind = row.cells[4].innerText;
        const eo = row.cells[7].innerText;
        const value = row.cells[5].innerText;
        const bogotaDate = row.cells[6].innerText;
        const dvAnalyst = row.cells[8].innerText;

        console.log(eo)

        // Busca el correo electrónico del responsable en tu base de datos JSON
        const emailResponsable = DataBase[eo]["MAIL"];
        console.log(emailResponsable)

        const original = registrationName.split(' ');
        var firstThreeWords = original.slice(0, 4);

        // Une las primeras tres palabras en una cadena
        var vendor2 = firstThreeWords.join(' ');

        // Obtén el valor como un número
        var valueNumber = Number(value.replace(/[^0-9.-]+/g,""));



        // Define el asunto y el cuerpo del correo electrónico
        const invoice = parentID;
        const vendor = vendor2
        const valueIn = valueNumber.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        const order = eo
        const dateExpiration = Date2

        // Obtén el archivo PDF de la factura
        const pdfLink = row.cells[9].querySelector('a');
        const pdfURL = pdfLink.href;
        console.log(pdfURL)
        const pdfResponse = await fetch(pdfURL);

        if (!pdfResponse.ok) {
            throw new Error('Error al obtener el archivo PDF: ' + pdfResponse.statusText);
        }

        const blob = await pdfResponse.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {

            if (!reader.result) {
                throw new Error('Error al convertir el Blob Data URL')
            }
            const base64data = reader.result; 
            // Envía la factura al responsable
           
            sendMessage(emailResponsable, base64data, vendor, invoice, valueIn, order, dateExpiration);
        }
    }
});