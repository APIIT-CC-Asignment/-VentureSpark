-- Make Vendor table fields nullable
ALTER TABLE Vendor
    MODIFY service_name VARCHAR(255) NULL,
    MODIFY years_of_excellence INT NULL,
    MODIFY contact_number VARCHAR(20) NULL,
    MODIFY address TEXT NULL,
    MODIFY selected_services TEXT NULL,
    MODIFY type ENUM('Consulting', 'Services') NULL DEFAULT 'Services',
    MODIFY expertise_in VARCHAR(30) NULL; 