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


# --------------xhr from js --------------
@app.route("/update", methods=['POST'])
def update():
    data = json.loads(request.data.decode('utf-8'))
    print(data['newTitle'])
    print(data['newStatus'])
    print(data['id'])

    data_manager.update_card(data['newTitle'], data['newStatus'], data['id'])
    return 'ok'


# -------------- API --------------
@app.route('/api/data/<username>')
def get_data(username):
    print(data_manager.load_data(username))
    return jsonify(data_manager.load_data(username))


def main():
    app.run(debug=True)


if __name__ == '__main__':
    main()
