CREATE TABLE accounts (
    id serial NOT NULL PRIMARY KEY,
    username text,
    password text
);

CREATE TABLE boards (
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

CREATE TABLE boards_statuses (
    table_id integer,
    status_id integer
);

CREATE TABLE boards_accounts (
    user_id integer,
    table_id integer
);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_table_id FOREIGN KEY (table_id) REFERENCES boards(id) ON DELETE CASCADE;
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE ONLY boards_statuses
    ADD CONSTRAINT fk_user_id FOREIGN KEY (table_id) REFERENCES boards(id) ON DELETE CASCADE;
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_statuses_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE ONLY boards_accounts
    ADD CONSTRAINT fk_accounts_id FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE;
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_boards_id FOREIGN KEY (table_id) REFERENCES boards(id) ON DELETE CASCADE;