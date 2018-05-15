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
    board_id integer,
    status_id integer,
    name text
);

CREATE TABLE boards_statuses (
    board_id integer,
    status_id integer
);

CREATE TABLE boards_accounts (
    account_id integer,
    board_id integer
);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE ONLY boards_statuses
    ADD CONSTRAINT fk_account_id FOREIGN KEY (board_id) REFERENCES boards(id);
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_statuses_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY boards_accounts
    ADD CONSTRAINT fk_accounts_id FOREIGN KEY (account_id) REFERENCES accounts(id);
ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id);