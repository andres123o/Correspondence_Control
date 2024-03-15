from flask import Blueprint, request
from flask_cors import CORS, cross_origin
import psycopg2
import base64




main = Blueprint('main', __name__)
CORS(main, origins=['http://127.0.0.1:5000'])

@main.route('/api/invoices', methods = ['POST'])
@cross_origin()
def add_invoices():
    data = request.get_json()
    print(data)
    
    # Nos conectamos a la base de datos en PostgreSQL
    conn = psycopg2.connect(
        dbname = 'samsung_test',
        user = 'postgres',
        password = 'smeogs95O@',
        host = 'localhost',       
    )
    cur = conn.cursor()
    
    # inserta los datos en la base de datos 
    cur.execute(
        """
            INSERT INTO invoice (
                company_id,
                registration_name,
                parent_id,
                date,
                type_kind,
                value,
                bogota_date,
                eo,
                dv_analyst
            ) VALUES (
                %s, 
                %s, 
                %s, 
                %s, 
                %s, 
                %s, 
                %s, 
                %s, 
                %s
            )
        
        """, (
            data['company_id'],
            data['registration_name'],
            data['parent_id'],
            data['date'],
            data['type_kind'],
            data['value'],
            data['bogota_date'],
            data['eo'],
            data['dv_analyst']
        )
    )
    
    # Confirmar los cambios y cerrar la conexión
    conn.commit()
    cur.close()
    conn.close()
    
    return {'message': 'Invoice added successfully'}, 200




