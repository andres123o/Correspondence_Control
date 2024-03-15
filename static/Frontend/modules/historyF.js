var searchElement = document.querySelector('.search');
var searchBoxElement = document.querySelector('.search-box');
var backButtom = document.querySelector('.back');

async function chageSerch(placeholder, title, column) {

    
    searchElement.style.animation = 'slideOutLeft 1s';

    document.querySelector('input[name="search"]').placeholder = placeholder;


    // Esto se ejecutará cuando la animación haya terminado
    searchElement.style.display = 'none';
    searchElement.style.animation = '';

    searchBoxElement.style.animation = 'slideInRight 1s';
    searchBoxElement.style.display = 'block';

    backButtom.style.animation = 'slideInRight 1s';
    backButtom.style.display = 'flex';

    document.querySelector('.info').innerHTML = title;


    document.querySelector('form').addEventListener('submit', async function(event) {
        // previene la recarga de la pagina
        event.preventDefault();

        var searchValue = document.querySelector('input[name="search"]').value;

        try {
            const response = await fetch('http://127.0.0.1:5000/static/api/history?query=' + encodeURIComponent(searchValue) + '&column=' + encodeURIComponent(column), {
                'method' : 'GET'
            });
            const data = await response.json();
            console.log(data);
            document.querySelector('.modal-empty2').style.display = 'none'
            document.querySelector('.section2').style.display = 'block'


            const dataOrigin = data.map(row => {
                return row.map(text => {
                    if (new Date(text) != 'Invalid Date') {
                        var date = new Date(text)

                        var fortmattedDate = date.toString().split('').slice(0, 15).join('')

                        return fortmattedDate
                    } else {
                        return text
                    }
                })
            })

            console.log(dataOrigin)

            var resultsBody = document.getElementById('results-body')

            // Eliminamos filas existente
            while (resultsBody.firstChild) {
                resultsBody.removeChild(resultsBody.firstChild)
            }

            dataOrigin.forEach(row => {
                var tr = document.createElement('tr');
    
                // Crea una nueva celda de tabla para cada columna de datos
                row.forEach(text => {
                    var td = document.createElement('td');
                    td.textContent = text;
                    tr.appendChild(td);
                });
    
                resultsBody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error:', error);
        }
    })

}


const company_id = document.getElementById('company_id')
const registration_name = document.getElementById('registration_name')
const eo =  document.getElementById('eo')
const parent_id = document.getElementById('parent_id')
const value = document.getElementById('value')

company_id.addEventListener('click', () => {
    chageSerch('Tax identification number', 'Insert the vendor code (NIT)', 'company_id')
})

registration_name.addEventListener('click', () => {
    chageSerch('Vendor name', 'Insert the vendor name', 'registration_name')
})

eo.addEventListener('click', () => {
    chageSerch('Purchase Orde', 'Insert the purchase order number', 'eo')
})

parent_id.addEventListener('click', () => {
    chageSerch('Invoice number', 'Insert the invoice number', 'parent_id')
})

value.addEventListener('click', () => {
    chageSerch('Invoice value', 'Insert the invoice value', 'value')
})


// Función para revertir la búsqueda
function revertSearch() {
    var searchElement = document.querySelector('.search');
    var searchBoxElement = document.querySelector('.search-box');
    var backButtom = document.querySelector('.back');

    searchBoxElement.style.animation = 'slideOutLeft 1s';
    backButtom.style.animation = 'slideOutLeft 1s';

    // Agregamos un evento de una sola vez para asegurarnos de que los estilos se establezcan al final de la animación
    searchBoxElement.addEventListener('animationend', function animationEndCallback() {
        // Eliminamos el evento para evitar múltiples ejecuciones
        searchBoxElement.removeEventListener('animationend', animationEndCallback);

        searchBoxElement.style.display = 'none';
        searchBoxElement.style.animation = '';

        backButtom.style.animation = '';
        backButtom.style.display = 'none';

        // Inicia la animación slideInRight del elemento .search después de que las otras animaciones hayan terminado
        searchElement.style.animation = 'slideInRight 1s';
        searchElement.style.display = 'block';

        document.querySelector('.info').innerHTML = 'Select an item to perform the best search.';
    }, { once: true });
}


// Evento de clic en el botón de retroceso
backButtom.addEventListener('click', () => {
    revertSearch();
});



