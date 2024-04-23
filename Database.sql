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


-- 1. **Users**
--    - `user_id` (Primary Key): Unique identifier for each user.
--    - `username`: User's chosen username.
--    - `email`: User's email address.
--    - `password_hash`: Hashed password for security.
--    - `created_at`: Timestamp of account creation.

-- 2. **Locations**
--    - `location_id` (Primary Key): Unique identifier for each location.
--    - `city_name`: Name of the city.
--    - `country_code`: ISO country code.
--    - `latitude`: Latitude of the location.
--    - `longitude`: Longitude of the location.

-- 3. **User_Favorites**
--    - `favorite_id` (Primary Key): Unique identifier for each favorite.
--    - `user_id` (Foreign Key): References `user_id` in the Users table.
--    - `location_id` (Foreign Key): References `location_id` in the Locations table.
--    - `created_at`: Timestamp when the location was favorited.

-- 4. **Weather_Records**
--    - `record_id` (Primary Key): Unique identifier for each weather record.
--    - `location_id` (Foreign Key): References `location_id` in the Locations table.
--    - `temperature`: Current temperature.
--    - `weather_description`: Short description of the current weather.
--    - `recorded_at`: Timestamp of the weather record.

-- ### Relationships

-- - **Users to User_Favorites**: One-to-Many (One user can have many favorite locations).
-- - **Locations to User_Favorites**: One-to-Many (One location can be favorited by many users).
-- - **Locations to Weather_Records**: One-to-Many (One location can have many weather records).
