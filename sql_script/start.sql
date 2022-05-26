create database proyecto;

create table proyecto.user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL,
    nrc INT NOT NULL
);

