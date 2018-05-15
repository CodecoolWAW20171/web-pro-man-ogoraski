CREATE TABLE users (
id serial NOT NULL PRIMARY KEY,
username text,
password text
);

CREATE TABLE tables (
id serial NOT NULL PRIMARY KEY,
name text
);

CREATE TABLE statuses (
id serial NOT NULL PRIMARY KEY,
name text
);

CREATE TABLE cards (
id serial NOT NULL PRIMARY KEY,
table_id integer,
status_id integer,
name text
);

CREATE TABLE tables_statuses (
table_id integer,
status_id integer
);

CREATE TABLE tables_users (
user_id integer,
table_id integer
);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_table_id FOREIGN KEY (table_id) REFERENCES tables(id);
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY tables_statuses
    ADD CONSTRAINT fk_user_id FOREIGN KEY (table_id) REFERENCES tables(id);
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_statuses_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY tables_users
    ADD CONSTRAINT fk_users_id FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_tables_id FOREIGN KEY (table_id) REFERENCES tables(id);