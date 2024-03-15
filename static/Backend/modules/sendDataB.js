function initializeGapiClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    
    var token = JSON.parse(sessionStorage.getItem('gapi_token'));
    if (token) {
        gapi.client.setToken(token);
    }
  
    gapiInited = true;
    maybeEnableButtons();
} 

function sendMessage(email, pdfAttachment, vendor, invoice, value, order, date1) {
    var base64Pdf = pdfAttachment.split('base64,')[1];
    var emailLines = [];
    emailLines.push('To: ' + email);
    emailLines.push('Subject: ' + 'TIENES UNA NUEVA ASIGNACIÓN DE PAYMENT REQUEST');
    emailLines.push('Content-Type: multipart/mixed; boundary=blob');
    emailLines.push('');
    emailLines.push('--blob');
    emailLines.push('Content-Type: text/html; charset=UTF-8');
    emailLines.push('');

    // Aquí es donde agregas el código HTML al cuerpo del correo electrónico
    var htmlBody = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0 auto; widht: 100%; height: 100%;">
        <table width="100%" align="center" border="0" cellpadding = "0" cellspacing="0" style="height:100%; font-family: 'Fira Sans', sans-serif;"> 
            <tr align="center">
                <td style="
                
                width: 100%; 
                padding:2%; 
                border-bottom:1px solid #000000;
                font-size: 130%;
                font-weight: 600;
                color:#000000;
    
                ">
                    FACTURA ASIGNADA
                </td>
            </tr>
            <tr align="center" widht="80%" >
                <td style="
                width: 80%; 
                padding: 3%;
                padding-left: 10%;
                padding-right: 10%;
                border-bottom:1px solid #000000;
                font-size: 100%;
                ">
                    <table  widht="100%" align="center" border="0" cellpadding = "0" cellspacing="0" style="height:100%">
                        <tr widht="80%" align="center">
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid #665e5e73;
                            font-size: 90%;
                            text-align:start;
                            ">
                            Vendor
                        </td>
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid #665e5e73;
                            font-size: 90%;
                            text-align:end;
                            ">
                                ${vendor}
                            </td>
                        </tr>
                        <tr>
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid  #665e5e73;
                            font-size: 90%;
                            ">
                                No.Invoice
                            </td>
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid  #665e5e73;
                            font-size: 90%;
                            text-align:end;
                            ">
                                ${invoice}
                            </td>
                        </tr>
                        <tr >
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid  #665e5e73;
                            font-size: 90%;
                            ">
                            Value
                        </td>
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid  #665e5e73;
                            font-size: 90%;
                            text-align:end;
                            ">
                                ${value}
                            </td>
                        </tr>
                        <tr >
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid  #665e5e73;
                            font-size: 90%;
                            ">
                            Purchase Order
                        </td>
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid  #665e5e73;
                            font-size: 90%;
                            text-align:end;
                            ">
                                ${order}
                            </td>
                        </tr>
                        <tr >
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid  #665e5e73;
                            font-size: 90%;
                            ">
                            Expiration Date
                        </td>
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;                        
                            border-bottom:1px solid #665e5e73;
                            font-size: 90%;
                            text-align:end;
                            ">
                                ${date1}
                            </td>
                        </tr>
                        <tr>
                            <td style="
                            width: 40%;
                            height: 10%;
                            padding-top:3%; 
                            padding-bottom: 1.5%;           
                            font-size: 90%;
                            text-align:end;
                            ">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="
                width: 80%; 
                padding: 3%;
                padding-left: 10%;
                padding-right: 10%;
                font-size: 80%;
                padding-top: 5%;
                ">
                    <table  widht="100%" align="center" border="0" cellpadding = "0" cellspacing="0" style="height:100%">
                        <tr>
                            <td style="
                            text-align: center;
                            ">
                                Por favor, ten en cuenta que, al realizar el retorno de esta factura, debes responder a este correo electrónico utilizando la opción de reenvío (FORWARD). Es esencial que adjuntes las evidencias correspondientes. En el asunto del correo, por favor, asigna la etiqueta de retorno de la siguiente manera.
                            </td>
                        </tr>
                        <tr>
                            <td td style="
                            text-align: center; 
                            font-weight: 600;
                            padding-top: 3.5%
                            ">
                                    &lt;RETORNO EVIDENCIAS:NO.INVOICE&gt;
                            </td>
                        </tr>
                        <tr align="center">
                        <td align="center" style=" 
                        padding-top: 5%;                    
                        ">
                            <a href="https://imgbb.com/"><img src="https://i.ibb.co/rffPRvv/icons8-colombia-48.png" width="8%" alt="icons8-colombia-48" border="0"></a>
                        </td>
                        </tr>
                        <tr>
                            <td style="
                            text-align: center; 
                            font-weight: 600;
                            padding-top: 1%;
                            color:rgb(173, 104, 0)
                            ">
                                TREE SUESCA
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    
    `;
    emailLines.push(htmlBody);

    emailLines.push('--blob');
    emailLines.push('Content-Type: application/pdf');
    emailLines.push('Content-Disposition: attachment; filename="Factura.pdf"');
    emailLines.push('Content-Transfer-Encoding: base64');
    emailLines.push('');
    emailLines.push(base64Pdf);
    emailLines.push('--blob--');

    var email = emailLines.join('\r\n').trim();

    var base64EncodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');
    gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': base64EncodedEmail
        }
    }).then(function(response) {
        console.log('Message sent');
        document.querySelector('.modal').style.display = 'flex';
        document.getElementById('sendInvoices').style.display = 'none';
        setTimeout(function() {
            modal.style.display = 'none';
            document.getElementById('saveData').style.display = 'block'
        }, 4000);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);

    });
}