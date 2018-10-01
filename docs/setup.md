# Localhost Setup
Clone the kiva-pricing-tool repository onto your computer.

## Frontend
If you don't node-gyp installed globally, do so now
```
npm install -g node-gyp
```
In your terminal, cd into the frontend folder and type in
```
 npm install
```
To run your program, type in
```
npm start
```
The site will be displayed on: http://localhost:3000


## Backend
Open a new tab and in your terminal, cd into the backend folder

### Running Development Server

First, install virtualenv, create and activate the environment called **venv**:

```bash
$ pip3 install virtualenv
$ virtualenv -p python3 venv
$ source venv/bin/activate
```
You will then have a ```(venv)``` before the ```$```, meaning that you are now in your virtual environment. Then, install the python package dependencies, which include Flask.
```
(venv)$ pip install -r requirements.txt
```

To install Postgres with Homebrew([postgresapp](http://postgresapp.com/) also works). If you are using linux, use your linux distributon's package manager to install postgres (**do this in new terminal**):
```
$ brew install postgresql
$ brew link postgresql
```
This should start your postgres server:
```
$ brew services start postgresql
```
To stop:
```
$ brew services stop postgresql
```
On a separate CLI, check whether you can access the database. Your postgres server must be on in order for this to work. For mac:
```
$ createdb
$ psql -h localhost
# \q
```
For windows:
```
$ psql -p 5432 -h localhost -U postgres
# \q
```
After installing Postgres, create a user(with name 'testusr' and password 'password') and a database called 'testdb' then grant privileges. We will do this in your CLI (run the `psql` command below using the command above corresponding to your OS):
```
$ psql
# create user testusr with password 'password';
# create database testdb owner testusr encoding 'utf-8';
# GRANT ALL PRIVILEGES ON DATABASE testdb TO testusr;
```
Note: Please replace the user name and password and database name to what you want in your own application. You must change those configurations in ```config.py``` and in ```.env```
<br>
(**go back to the terminal with your virtual environment running**)
<br>
To populate the database type in:
```
(venv)$ python manage.py recreate_db
```
Then, to run the server type in:
```
(venv)$ python manage.py runserver
```
To deactivate when you're using it:
```
(venv)$ deactivate venv
```
If you are using pip, your command line will have `(venv)$` in front instead of the `(flask......) bash-3.2$` Now look above for instructions to run the server.

The API should be at http://127.0.0.1:3453/
