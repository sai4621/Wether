CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(255) NOT NULL,
    country_code CHAR(2) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL
);

CREATE TABLE User_Favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    location_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

CREATE TABLE Weather_Records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    location_id INT,
    temperature DECIMAL(5, 2) NOT NULL,
    weather_description VARCHAR(255) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);
