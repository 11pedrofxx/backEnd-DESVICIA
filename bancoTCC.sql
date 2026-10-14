CREATE DATABASE IF NOT EXISTS desviciatcc;
USE desviciatcc;

CREATE TABLE usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
);

CREATE TABLE conquistas (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    dias_meta INT DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE vicios (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE gatilhos (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    personalizado TINYINT(1) DEFAULT NULL,
    usuario_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY usuario_id (usuario_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE estrategias_enfrentamento (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    personalizado TINYINT(1) DEFAULT NULL,
    usuario_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    KEY usuario_id (usuario_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE checkins_diarios (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    data_checkin DATE NOT NULL,
    nivel_humor INT NOT NULL,
    nivel_fissura INT NOT NULL,
    foi_dia_dificil TINYINT(1) DEFAULT NULL,
    notas TEXT,
    PRIMARY KEY (id),
    UNIQUE KEY usuario_data (usuario_id, data_checkin),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE contatos_emergencia (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    KEY usuario_id (usuario_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE checkin_gatilhos (
    checkin_id INT NOT NULL,
    gatilho_id INT NOT NULL,
    PRIMARY KEY (checkin_id, gatilho_id),
    KEY gatilho_id (gatilho_id),
    FOREIGN KEY (checkin_id) REFERENCES checkins_diarios(id) ON DELETE CASCADE,
    FOREIGN KEY (gatilho_id) REFERENCES gatilhos(id) ON DELETE CASCADE
);

CREATE TABLE usuarios_conquistas (
    usuario_id INT NOT NULL,
    conquista_id INT NOT NULL,
    PRIMARY KEY (usuario_id, conquista_id),
    KEY conquista_id (conquista_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (conquista_id) REFERENCES conquistas(id) ON DELETE CASCADE
);

CREATE TABLE usuarios_vicios (
    usuario_id INT NOT NULL,
    vicio_id INT NOT NULL,
    data_inicio DATE NOT NULL,
    PRIMARY KEY (usuario_id, vicio_id),
    KEY vicio_id (vicio_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (vicio_id) REFERENCES vicios(id)
);