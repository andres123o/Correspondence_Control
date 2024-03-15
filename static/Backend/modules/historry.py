from flask import Blueprint, request, jsonify
import psycopg2

getHistory = Blueprint('search', __name__)



@getHistory.route('/api/history', methods = ['GET'])
def search():
    query = request.args.get('query')
    column = request.args.get('column')
    
    allowed_columns = ['company_id', 'registration_name', 'parent_id', 'value', 'eo']
    
    if column not in allowed_columns:
        return 'Invalid column', 400

    
     # Nos conectamos a la base de datos en PostgreSQL
    conn = psycopg2.connect(
        dbname = 'samsung_test',
        user = 'postgres',
        password = 'smeogs95O@',
        host = 'localhost',       
    )
    cur = conn.cursor()
    
    cur.execute(f"SELECT * FROM invoice WHERE {column} = %s", (query,))

    rows = cur.fetchall()

    return jsonify(rows)