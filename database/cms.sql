
CREATE TABLE IF NOT EXISTS User ( userid INTEGER PRIMARY KEY NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL );

CREATE TABLE IF NOT EXISTS Product ( productid: INTEGER PRIMARY KEY NOT NULL, publisherid: INTEGER NOT NULL, productname STRING NOT NULL, productdesc TEXT, productprice FLOAT NOT NULL );

CREATE TABLE IF NOT EXISTS Publisher ( publisherid: INTEGER PRIMARY KEY NOT NULL, publishername STRING NOT NULL, publisherdesc TEXT );


DELETE FROM User;
DELETE FROM Product;
DELETE FROM Publisher;

INSERT INTO USER VALUES ('subu', '1234');

INSERT INTO COURSE VALUES ('CPTS_489', 'Web Development', 'Spring', 'course about web development', 80, 'subu');