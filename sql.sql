-- Hey Fucking Team--

CREATE TABLE Vendor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    years_of_excellence INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    selected_services TEXT NOT NULL,
    type ENUM('Consulting', 'Services') NOT NULL DEFAULT 'Services',
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE Vendor
ADD COLUMN file_data LONGBLOB,   -- For storing the PDF file as binary data
ADD COLUMN expertise_in VARCHAR(30);  -- To store the original file name




-- CREATE TABLE Vendor_Reviews (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     vendor_id INT NOT NULL,
--     review TEXT NOT NULL,
--     rating INT CHECK (rating >= 1 AND rating <= 5),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (vendor_id) REFERENCES Vendor(id) ON DELETE CASCADE
-- );  
