-- Hey Team--

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


CREATE TABLE booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    request_date DATE NOT NULL,
    what_you_need TEXT,
    createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    committed BOOLEAN DEFAULT FALSE
    Requstedservice TEXT,
);




-- CREATE TABLE Vendor_Reviews (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     vendor_id INT NOT NULL,
--     review TEXT NOT NULL,
--     rating INT CHECK (rating >= 1 AND rating <= 5),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     FOREIGN KEY (vendor_id) REFERENCES Vendor(id) ON DELETE CASCADE
-- );  

CREATE TABLE `vendor_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendor_id` int NOT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `portfolio_documents` text,
  `years_in_business` int DEFAULT NULL,
  `business_registration_number` varchar(100) DEFAULT NULL,
  `tax_identification_number` varchar(50) DEFAULT NULL,
  `social_media_links` text,
  `certifications` text,
  `profile_completion_percentage` tinyint DEFAULT '0',
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending',
  `verification_notes` text,
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `fk_vendor_profiles_vendor_id` FOREIGN KEY (`vendor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
