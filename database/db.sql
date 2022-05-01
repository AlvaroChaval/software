CREATE DATABASE sw1;

USE sw1;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL PRIMARY KEY (id),
  username VARCHAR(30) NOT NULL,
  password VARCHAR(60) NOT NULL,
);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

DESCRIBE users;

INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'john', 'password1', 'John Carter');

SELECT * FROM users;

-- salas TABLE
CREATE TABLE salas (
  id INT(11) NOT NULL PRIMARY KEY (id),
  title VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE salas
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE salas;