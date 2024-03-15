    document.getElementById('saveData').addEventListener('click', async function() {
        console.log("Ok")
        // Obtén todas las filas de la tabla
        const rows = document.getElementById('table').rows;

        // Recorre todas las filas de la tabla
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];

            data = {
                // Obtén la información necesaria de cada fila
                'company_id' : row.cells[0].innerText,
                'registration_name' : row.cells[1].innerText,
                'parent_id' : row.cells[2].innerText,
                'date' : row.cells[3].innerText,
                'type_kind' : row.cells[4].innerText,
                'value' : row.cells[5].innerText,
                'bogota_date' : row.cells[6].innerText,
                'eo' : row.cells[7].innerText,
                'dv_analyst' : row.cells[8].innerText
                
            }
            

            
            const response = await fetch('http://127.0.0.1:5000/static/api/invoices', {
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data)
            });       
            document.querySelector('.section').style.display = 'none';
            window.location.href = '/static/Frontend/html/index.html'; 
        }
    });
