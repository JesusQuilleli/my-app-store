USE STORE_DATABASE;

-- Tabla ROLES
CREATE TABLE ROLES (
    ID_ROL INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE_ROL VARCHAR(25) NOT NULL,
    DESCRIPCION_ROL VARCHAR(150)
);

INSERT INTO ROLES IF NOT EXISTS (NOMBRE_ROL, DESCRIPCION_ROL) VALUES ('Administrador', 'Acceso al Completo');

-- Tabla ADMINISTRADORES
CREATE TABLE ADMINISTRADORES (
    ID_ADMINISTRADOR INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL,
    PASSWORD VARCHAR(150) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL,
    ROL_ID INT,
    FOREIGN KEY (ROL_ID) REFERENCES ROLES(ID_ROL) ON DELETE SET NULL
);