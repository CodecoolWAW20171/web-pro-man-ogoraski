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
def get_users_boards(cursor, username):
    query="SELECT * FROM accounts WHERE username = %s;"
    cursor.execute(query,[username])
    user_id = cursor.fetchall()[0]['id']
    query="""SELECT boards.* FROM boards 
             INNER JOIN boards_accounts ON boards.id = boards_accounts.board_id
             WHERE boards_accounts.account_id = %s;"""
    cursor.execute(query,[user_id])
    return cursor.fetchall()