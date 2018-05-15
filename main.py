from flask import Flask, render_template, request, url_for, session, jsonify
import data_manager

app = Flask(__name__, static_url_path='/static')
app.secret_key = 'Don\'tTellAnyOne'


@app.route("/")
def boards():
    ''' this is a one-pager which shows all the boards and cards '''
    return render_template('boards.html')


# -------------- USER --------------
@app.route('/user')
def user():
    return render_template('boards.html')


@app.route('/signin', methods=['POST'])
def signin():
    new_account = request.form

    if (not data_manager.is_user_in_database(new_account['username'])):
        msg = 'Something went wrong, try again!'
        return render_template('boards.html', msg=msg)
    else:
        username = data_manager.signin(new_account['username'], new_account['password'])
        if (username):
            session['username'] = username
            return render_template('boards.html', username=username)
        else:
            msg = 'Something went wrong, try again!'
            return render_template('boards.html', msg=msg)


@app.route('/register', methods=['POST'])
def register():
    new_account = request.form

    if (not data_manager.is_user_in_database(new_account['username'])):
        data_manager.add_user(new_account['username'], new_account['password'])
        session['username'] = new_account['username']
        return render_template('boards.html', username=new_account['username'])
    else:
        msg = 'There is user with "' + new_account['username'] + '" username! Try again'
        return render_template('boards.html', msg=msg)


@app.route('/logout')
def logout():
    session.pop('username', None)
    return render_template('boards.html')


# -------------- API --------------


@app.route('/api/get_boards/<username>')
def get_boards(username):
    boards = data_manager.get_users_boards(username)
    boards = jsonify(boards)
    return boards

def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
