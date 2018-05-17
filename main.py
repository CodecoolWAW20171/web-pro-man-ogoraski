from flask import Flask, render_template, redirect, request, url_for, session, jsonify
import json
import data_manager

app = Flask(__name__, static_url_path='/static')
app.secret_key = 'Don\'tTellAnyOne'


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    if 'username' in session:
        username = session['username']
        return render_template('boards.html', username=username)
    else:
        return render_template('login.html')


# -------------- USER --------------
@app.route('/signin', methods=['POST'])
def signin():
    new_account = request.form

    if (not data_manager.is_user_in_database(new_account['username'])):
        msg = 'Something went wrong, try again!'
        return render_template('login.html', msg=msg)
    else:
        username = data_manager.signin(new_account['username'], new_account['password'])
        if (username):
            session['username'] = new_account['username']
            return redirect(url_for('boards'))
        else:
            msg = 'Something went wrong, try again!'
            return render_template('login.html', msg=msg)


@app.route('/register', methods=['POST'])
def register():
    new_account = request.form

    if (not data_manager.is_user_in_database(new_account['username'])):
        data_manager.add_user(new_account['username'], new_account['password'])
        session['username'] = new_account['username']
        return redirect(url_for('boards'))
    else:
        msg = 'There is user with "' + new_account['username'] + '" username! Try again'
        return render_template('login.html', msg=msg)


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('boards'))


# --------- XHR FROM JSON ----------
@app.route("/update", methods=['POST'])
def update():
    data = json.loads(request.data.decode('utf-8'))

    data_manager.update_card(data['newTitle'], data['newStatus'], data['id'])
    return 'ok'


# -------------- API ---------------
@app.route('/api/data/<username>')
def get_data(username):
    return jsonify(data_manager.load_data(username))


# -------------- DB ----------------
@app.route('/new-board', methods=['POST'])
def create_board():
    user_id = data_manager.get_users_id(request.form['username'])
    board_title = request.form['title']
    data_manager.insert_board(board_title,user_id)

    return redirect(url_for('boards'))


@app.route('/new-card', methods=['POST'])
def create_card():
    board_id = request.form['board_id']
    card_title = request.form['title']
    status_id = request.form['status_id']
    data_manager.insert_card(board_id, card_title, status_id)

    return redirect(url_for('boards'))


@app.route('/delete-board/<board_id>', methods=['POST'])
def delete_board(board_id):
    data_manager.delete_board(board_id)
    return redirect(url_for('boards'))


@app.route('/delete-card/<card_id>', methods=['POST'])
def delete_card(card_id):
    data_manager.delete_card(card_id)
    return redirect(url_for('boards'))


@app.route('/edit-board/<board_id>', methods=['POST'])
def edit_board():
    data_manager.update_board(board_title, board_id)
    return redirect(url_for('boards'))


@app.route('/edit-card/<card_id>', methods=['POST'])
def edit_card(card_id):
    card_title = request.form['title']
    status_id = request.form['status_id']
    data_manager.update_card(card_title, status_id, card_id)
    return redirect(url_for('boards'))


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
