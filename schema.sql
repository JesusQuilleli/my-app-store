CREATE DATABASE STORE_DATABASE;

USE STORE_DATABASE;

SHOW TABLES; --VER TABLAS
SHOW DATABASES; --VER BASE DE DATOS

-- Tabla ROLES
CREATE TABLE ROLES (
    ID_ROL INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE_ROL VARCHAR(25) NOT NULL,
    DESCRIPCION_ROL VARCHAR(150)
);

-- Tabla ADMINISTRADORES
CREATE TABLE ADMINISTRADORES (
    ID_ADMINISTRADOR INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL,
    PASSWORD VARCHAR(150) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL,
    ROL_ID INT,
    FOREIGN KEY (ROL_ID) REFERENCES ROLES(ID_ROL) ON DELETE SET NULL
);

--INSERCIONES EN TABLAS FUERTES
INSERT INTO ROLES (NOMBRE_ROL, DESCRIPCION_ROL) VALUES ('Administrador', 'Acceso al Completo');
INSERT INTO ROLES (NOMBRE_ROL, DESCRIPCION_ROL) VALUES ('Ayudante', 'Acceso Limitado');

--INSERCIONES EN TABLAS DEBILES
INSERT INTO ADMINISTRADORES (NOMBRE, PASSWORD, EMAIL, ROL_ID) VALUES ('Jesus', '12345', 'correo@correo.com', 1);

--PRUEBA DE TABLAS DE PRODUCTOS y CATEGORIAS

-- Tabla CATEGORIAS
CREATE TABLE CATEGORIAS (
    ID_CATEGORIA INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(100) NOT NULL,
    DESCRIPCION TEXT,
    ADMINISTRADOR_ID INT,
    FOREIGN KEY (ADMINISTRADOR_ID) REFERENCES ADMINISTRADORES(ID_ADMINISTRADOR) ON DELETE CASCADE
);

-- Tabla PRODUCTOS
CREATE TABLE PRODUCTOS (
    ID_PRODUCTO INT AUTO_INCREMENT PRIMARY KEY,
    CATEGORIA_ID INT,
    NOMBRE VARCHAR(100) NOT NULL,
    DESCRIPCION TEXT,
    PRECIO DECIMAL(10, 2),
    CANTIDAD INT,
    IMAGEN VARCHAR(255),
    ADMINISTRADOR_ID INT,
    FOREIGN KEY (CATEGORIA_ID) REFERENCES CATEGORIAS(ID_CATEGORIA) ON DELETE SET NULL,
    FOREIGN KEY (ADMINISTRADOR_ID) REFERENCES ADMINISTRADORES(ID_ADMINISTRADOR) ON DELETE CASCADE
);

--EJEMPLO DE LO QUE SE DEBE HACER PARA QUE CADA ADMINISTRADOR TENGA SU PROPIA INFORMACION
ALTER TABLE CLIENTES ADD COLUMN ADMINISTRADOR_ID INT;
ALTER TABLE CLIENTES ADD FOREIGN KEY (ADMINISTRADOR_ID) REFERENCES ADMINISTRADORES(ID_ADMINISTRADOR) ON DELETE CASCADE;

--INSERCIONES CATEGORIAS EJEMPLO
INSERT INTO CATEGORIAS (NOMBRE, DESCRIPCION, ADMINISTRADOR_ID) VALUES ('Zapatos', 'Variedad de Zapatos', 1);
INSERT INTO CATEGORIAS (NOMBRE, DESCRIPCION, ADMINISTRADOR_ID) VALUES ('Zapatos', 'Talla 40', 26);

--INSERCIONES PRODUCTOS EJEMPLO
INSERT INTO PRODUCTOS (CATEGORIA_ID, NOMBRE, DESCRIPCION, PRECIO, CANTIDAD, IMAGEN) VALUES (1, 'Campus', 'CASUALES', 49.99, 15, 'IMAGEN_CAMPUS');
INSERT INTO PRODUCTOS (CATEGORIA_ID, NOMBRE, DESCRIPCION, PRECIO, CANTIDAD, IMAGEN) VALUES (1, 'Nike Jordan', 'DEPORTIVOS', 59.99, 20, 'IMAGEN_NIKE');
INSERT INTO PRODUCTOS (CATEGORIA_ID, NOMBRE, DESCRIPCION, PRECIO, CANTIDAD, IMAGEN) VALUES (2, 'Argollas', 'PARA SALIR A EVENTOS', 29.99, 20, 'IMAGEN_ARGOLLAS');

--EJEMPLO PARA VER LAS PRODUCTOS POR CATEGORIAS
SELECT 
    P.ID_PRODUCTO,
    C.NOMBRE AS CATEGORIA,
    P.NOMBRE AS PRODUCTO,
    P.DESCRIPCION,
    P.PRECIO,
    P.CANTIDAD,
    P.IMAGEN AS FOTO
FROM 
    PRODUCTOS P
JOIN 
    CATEGORIAS C
ON 
    P.CATEGORIA_ID = C.ID_CATEGORIA
WHERE 
    P.CATEGORIA_ID = 1;

--EJEMPLO PARA VER TODOS LOS PRODUCTOS DE TODAS LAS CATEGORIAS
SELECT 
    P.ID_PRODUCTO,
    C.NOMBRE AS CATEGORIA,
    P.NOMBRE AS PRODUCTO,
    P.DESCRIPCION,
    P.PRECIO,
    P.CANTIDAD,
    P.IMAGEN AS FOTO
FROM 
    PRODUCTOS P
JOIN 
    CATEGORIAS C
ON 
    P.CATEGORIA_ID = C.ID_CATEGORIA


