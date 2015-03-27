<?php 

include('../core_functions.php');

$param_arr = array();

$db->executeCleanQuery("
        CREATE TABLE users(
                user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(150),
                cred_src INT NOT NULL,
                create_date DATETIME,
                last_login DATETIME,
                activated BOOLEAN
        );",$param_arr
);

$db->executeCleanQuery("
        CREATE TABLE users(
                user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(150),
                cred_src INT NOT NULL,
                create_date DATETIME,
                last_login DATETIME,
                activated BOOLEAN
        );",$param_arr
);

$db->executeCleanQuery("
        CREATE TABLE credential_sources(
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL
        );",$param_arr
);

$db->executeCleanQuery("
        CREATE TABLE access_lvls(
                access_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                cost DOUBLE
        );",$param_arr
);

$db->executeCleanQuery("
        CREATE TABLE user_access_link(
                ua_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                access_id INT NOT NULL,
                paid BOOLEAN NOT NULL
        );",$param_arr
);

$db->executeCleanQuery("
        CREATE TABLE recovery_tokens(
                rt_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                create_date DATETIME NOT NULL,
                used BOOLEAN NOT NULL
        );",$param_arr
);

$db->executeCleanQuery("
        CREATE TABLE projects(
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                create_date DATETIME NOT NULL
        );",$param_arr
);

$db->executeCleanQuery("
        CREATE TABLE project_user_link(
                pu_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                user_id INT NOT NULL
        );",$param_arr
);

$db->executeCleanQuery("
        INSERT INTO credential_sources(name) VALUES('Google');
        INSERT INTO credential_sources(name) VALUES('Facebook');
        INSERT INTO credential_sources(name) VALUES('LinkedIn');
        INSERT INTO credential_sources(name) VALUES('Wyzzi');",$param_arr
);

$db->executeCleanQuery("
        INSERT INTO access_lvls(name,cost) VALUES ('Demo',0.00);
        INSERT INTO access_lvls(name,cost) VALUES ('Basic',20.00);
        INSERT INTO access_lvls(name,cost) VALUES ('Advanced',40.00);
        INSERT INTO access_lvls(name,cost) VALUES ('Enterprise',120.00);",$param_arr
);
?>