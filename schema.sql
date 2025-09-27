CREATE DATABASE IF NOT EXISTS grid_app;
USE grid_app;

CREATE TABLE IF NOT EXISTS selections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS selection_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    selection_id INT NOT NULL,
    num INT NOT NULL,
    event ENUM(
        'right',
        'left',
        'up',
        'down',
        'back',
        'upRight',
        'upLeft',
        'downRight',
        'downLeft'
    ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (selection_id) REFERENCES selections(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_selection_num (selection_id, num) -- evita duplicar número na mesma seleção
);
