import database_connector
from werkzeug.security import generate_password_hash, check_password_hash


@database_connector.connection_handler
def is_user_in_database(cursor, username):
    cursor.execute("""
                    SELECT username FROM accounts
                    WHERE LOWER(username) = LOWER(%(username)s);
                   """,
                   {'username': username})
    if(cursor.fetchall()):
        return True
    return False


@database_connector.connection_handler
def add_user(cursor, username, password):
    cursor.execute("""
                    INSERT INTO accounts (username, password)
                    VALUES (%(username)s, %(password)s);
                   """,
                   {'username': username, 'password': generate_password_hash(password)})


@database_connector.connection_handler
def signin(cursor, username, password):
    cursor.execute("""
                    SELECT username, password FROM accounts
                    WHERE LOWER(username) = LOWER(%(username)s);
                   """,
                   {'username': username})
    db_user = cursor.fetchall()[0]

    if (check_password_hash(db_user['password'], password)):
        return db_user['username']
    else:
        return None

@database_connector.connection_handler
def update_table(cursor, newName, table_id):
    cursor.execute("""
                    UPDATE boards
                    SET name = %(newName)s
                    WHERE id = %(table_id)s;
                   """,
                   {'table_id': table_id, 'newName': newName})

@database_connector.connection_handler
def update_card(cursor, new_name, status_id, card_id):
    cursor.execute("""
                    UPDATE cards
                    SET name = %(new_name)s, status_id = %(status_id)s
                    WHERE id = %(card_id)s;
                   """,
                   {'card_id': card_id, 'new_name': new_name, 'status_id' : status_id})