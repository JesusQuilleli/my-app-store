CREATE DATABASE STORE_DATABASE;

USE STORE_DATABASE;

SHOW TABLES; --VER TABLAS
SHOW DATABASES; --VER BASE DE DATOS


CREATE TABLE ADMINISTRADORES (
    ID_ADMINISTRADOR INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL,
    PASSWORD VARCHAR(150) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL,
);

CREATE TABLE CATEGORIAS (
    ID_CATEGORIA INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(100) NOT NULL,
    ADMINISTRADOR_ID INT,
    FOREIGN KEY (ADMINISTRADOR_ID) REFERENCES ADMINISTRADORES(ID_ADMINISTRADOR) ON DELETE CASCADE
);

CREATE TABLE CLIENTES (
    ID_CLIENTE INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(100) NOT NULL,
    TELEFONO VARCHAR(20),
    EMAIL VARCHAR(100),
    DIRECCIÓN VARCHAR(255),
    FECHA_REGISTRO DATE,
    ADMINISTRADOR_ID INT,
    FOREIGN KEY (ADMINISTRADOR_ID) REFERENCES ADMINISTRADORES(ID_ADMINISTRADOR) ON DELETE CASCADE
);

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

CREATE TABLE VENTAS (
    ID_VENTA INT AUTO_INCREMENT PRIMARY KEY,
    CLIENTE_ID INT,
    MONTO_TOTAL DECIMAL(10, 2),
    MONTO_PENDIENTE DECIMAL(10, 2),
    FECHA_VENTA DATE,
    ESTADO_PAGO ENUM('PAGADO', 'PENDIENTE') DEFAULT 'PENDIENTE',
    TIPO_PAGO ENUM('AL CONTADO', 'POR ABONO') DEFAULT 'AL CONTADO',
    ADMINISTRADOR_ID INT,
    FOREIGN KEY (CLIENTE_ID) REFERENCES CLIENTES(ID_CLIENTE) ON DELETE CASCADE,
    FOREIGN KEY (ADMINISTRADOR_ID) REFERENCES ADMINISTRADORES(ID_ADMINISTRADOR) ON DELETE CASCADE
);

CREATE TABLE VENTAS_PRODUCTOS (
        VENTA_ID INT,
        PRODUCTO_ID INT,
        CANTIDAD INT,
        PRIMARY KEY (VENTA_ID, PRODUCTO_ID),
        FOREIGN KEY (VENTA_ID) REFERENCES VENTAS(ID_VENTA) ON DELETE CASCADE,
        FOREIGN KEY (PRODUCTO_ID) REFERENCES PRODUCTOS(ID_PRODUCTO) ON DELETE CASCADE
    );


    CREATE TABLE TASAS_CAMBIO (
        ID INT AUTO_INCREMENT PRIMARY KEY,
        MONEDA VARCHAR(50) NOT NULL,      -- Ej. "DOLAR", "BOLIVAR", "PESO"
        TASA DECIMAL(10, 4) NOT NULL,     -- La tasa de cambio (ej. 1, 30.5, 3800)
        ADMINISTRADOR_ID INT,
        FOREIGN KEY (ADMINISTRADOR_ID) REFERENCES ADMINISTRADORES(ID_ADMINISTRADOR) ON DELETE CASCADE
    );

  ---------------------------------------------------------------------------------
    --TABLA PAGOS
    CREATE TABLE PAGOS (
        ID_PAGO INT AUTO_INCREMENT PRIMARY KEY,
        VENTA_ID INT,
        MONTO_ABONADO DECIMAL(10, 2),
        FECHA_PAGO DATE,
        MANERA_PAGO ENUM('EFECTIVO', 'PAGO_MOVIL/TRANSFERENCIA') NOT NULL DEFAULT 'EFECTIVO',
        NUMERO_REFERENCIA VARCHAR(50),
        FOREIGN KEY (VENTA_ID) REFERENCES VENTAS(ID_VENTA) ON DELETE CASCADE
    );

    --TRIIGER USADO
        DELIMITER //

        CREATE TRIGGER actualizar_monto_pendiente
            AFTER INSERT ON PAGOS
                FOR EACH ROW
                    BEGIN
                    UPDATE VENTAS
                    SET MONTO_PENDIENTE = MONTO_PENDIENTE - NEW.MONTO_ABONADO
                    WHERE ID_VENTA = NEW.VENTA_ID;
            END //

        DELIMITER ;



-- Tabla intermedia VENTAS_PRODUCTOS (relación muchos a muchos)
    

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

--CAMPOS SELECCIONADOS DE VENTAS
--CLIENTE
--FECHA
--ESTADO DE PAGO

--PARA LA INFORMACION DETALLADA
--CLIENTE
--FECHA
--ESTADO DE PAGO
--MONTO TOTAL
--MONTO PENDIENTE
--LISTA DE LOS PRODUCTOS VENDIDOS

--Y EL ID_ADMINISTRADOR DE LA TABLA VENTAS PARA MOSTRARLE LA INFORMACION AL ADMINISTRADOR QUE ESTE EN LA APLICACION

--Consulta para la Información Resumida
--Esta consulta te da los campos CLIENTE, FECHA, y ESTADO_PAGO:
SELECT 
    c.NOMBRE AS CLIENTE,
    v.FECHA_VENTA AS FECHA,
    v.ESTADO_PAGO
FROM 
    VENTAS v
JOIN 
    CLIENTES c ON v.CLIENTE_ID = c.ID_CLIENTE
WHERE 
    v.ADMINISTRADOR_ID = 26; 

--INFORMACION DETALLADA
SELECT 
    c.NOMBRE AS CLIENTE,
    v.FECHA_VENTA AS FECHA,
    v.ESTADO_PAGO,
    v.MONTO_TOTAL,
    v.MONTO_PENDIENTE,
    GROUP_CONCAT(p.NOMBRE SEPARATOR ', ') AS LISTA_PRODUCTOS,
    v.ADMINISTRADOR_ID
FROM 
    VENTAS v
JOIN 
    CLIENTES c ON v.CLIENTE_ID = c.ID_CLIENTE
LEFT JOIN 
    VENTAS_PRODUCTOS vp ON v.ID_VENTA = vp.VENTA_ID
LEFT JOIN 
    PRODUCTOS p ON vp.PRODUCTO_ID = p.ID_PRODUCTO
WHERE 
    v.ADMINISTRADOR_ID = 26
GROUP BY 
    v.ID_VENTA;
------------------------------------------------------
SELECT 
    c.NOMBRE AS CLIENTE,
    v.FECHA_VENTA AS FECHA,
    v.ESTADO_PAGO,
    v.MONTO_TOTAL,
    v.MONTO_PENDIENTE,
    GROUP_CONCAT(p.NOMBRE SEPARATOR ', ') AS LISTA_PRODUCTOS,
    v.ADMINISTRADOR_ID
FROM 
    VENTAS v
JOIN 
    CLIENTES c ON v.CLIENTE_ID = c.ID_CLIENTE
LEFT JOIN 
    VENTAS_PRODUCTOS vp ON v.ID_VENTA = vp.VENTA_ID
LEFT JOIN 
    PRODUCTOS p ON vp.PRODUCTO_ID = p.ID_PRODUCTO
WHERE 
    v.ADMINISTRADOR_ID = 26
    AND v.ID_VENTA = 7
GROUP BY 
    v.ID_VENTA;

