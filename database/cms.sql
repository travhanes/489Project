
CREATE TABLE IF NOT EXISTS User ( userid INTEGER PRIMARY KEY NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL );

CREATE TABLE IF NOT EXISTS Product ( productid: INTEGER PRIMARY KEY NOT NULL, publisherid: INTEGER NOT NULL, productname STRING NOT NULL, productimage STRING NOT NULL, productdesc TEXT, productprice FLOAT NOT NULL );

CREATE TABLE IF NOT EXISTS Publisher ( publisherid: INTEGER PRIMARY KEY NOT NULL, publishername STRING NOT NULL, publisherdesc TEXT );

CREATE TABLE IF NOT EXISTS Library ( userid INTEGER PRIMARY KEY NOT NULL, productid INTEGER PRIMARY KEY NOT NULL, dateAdded DATE );

CREATE TABLE IF NOT EXISTS Order ( orderid INTEGER PRIMARY KEY NOT NULL, userid INTEGER NOT NULL, productid INTEGER NOT NULL, dateOrdered DATE, dateDelivered DATE );

CREATE TABLE IF NOT EXISTS ShoppingCart ( userid INTEGER NOT NULL, productid INTEGER NOT NULL, quantity INTEGER NOT NULL, dateAdded DATE );

CREATE TABLE IF NOT EXISTS Wishlist ( userid INTEGER NOT NULL, productid INTEGER NOT NULL, dateAdded DATE );

DELETE FROM User;
DELETE FROM Product;
DELETE FROM Publisher;
DELETE FROM Library;
DELETE FROM Order;
DELETE FROM ShoppingCart;
DELETE FROM Wishlist;

--INSERT INTO USER VALUES ('subu', '1234');

--INSERT INTO COURSE VALUES ('CPTS_489', 'Web Development', 'Spring', 'course about web development', 80, 'subu');
--INSERT INTO PRODUCT VALUES (0, 0, 'Blank', 'Blank', 0);