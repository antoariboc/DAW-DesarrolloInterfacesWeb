CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);

INSERT INTO users (name, email, password) VALUES
('Alice', 'alice@example.com','aaaaaa'),
('Bob', 'bob@example.com','bbbbbbbbb');
