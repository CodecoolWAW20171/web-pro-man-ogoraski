import database_connector
from werkzeug.security import generate_password_hash, check_password_hash


# LOGIN
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


# LOAD DATA
@database_connector.connection_handler
def get_users_boards(cursor, user_id):
    query = """SELECT boards.* FROM boards
             INNER JOIN boards_accounts ON boards.id = boards_accounts.board_id
             WHERE boards_accounts.account_id = %s;"""
    cursor.execute(query, [user_id])
    return cursor.fetchall()


@database_connector.connection_handler
def get_board_cards(cursor, board_id):
    query = """SELECT * FROM cards
               INNER JOIN boards ON boards.id = cards.board_id
               WHERE boards.id = %s;"""
    cursor.execute(query, [board_id])
    return cursor.fetchall()


def load_data(username):
    user_id = get_users_id(username)

    boards = get_users_boards(user_id)
    statuses = [
            {
                "id": 1,
                "name": "New"
            },
            {
                "id": 2,
                "name": "In progress"
            },
            {
                "id": 3,
                "name": "Testing"
            },
            {
                "id": 4,
                "name": "Done"
            }
        ]
    cards = []
    for board in boards:
        board["is_active"] = "false"
        card = get_board_cards(board.id)
        card["order"] = 0
        cards.append(card)

    result = {"boards": boards,
              "statuses": statuses,
              "cards": cards}
    return result


# UPDATE
@database_connector.connection_handler
def update_table(cursor, new_name, table_id):
    cursor.execute("""
                    UPDATE boards
                    SET name = %(newName)s
                    WHERE id = %(table_id)s;
                   """,
                   {'table_id': table_id, 'newName': new_name})


@database_connector.connection_handler
def update_card(cursor, new_name, status_id, card_id):
    cursor.execute("""
                    UPDATE cards
                    SET name = %(new_name)s, status_id = %(status_id)s
                    WHERE id = %(card_id)s;
                   """,
                   {'card_id': card_id, 'new_name': new_name, 'status_id': status_id})


# GET INFO
@database_connector.connection_handler
def get_users_id(cursor, username):
    query = "SELECT * FROM accounts WHERE username = %s;"
    cursor.execute(query, [username])

    return cursor.fetchall()[0]['id']
