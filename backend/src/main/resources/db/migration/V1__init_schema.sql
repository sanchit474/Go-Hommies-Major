CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER','SERVICEPROVIDER','ADMIN'),
    verify_otp VARCHAR(255),
    account_verified BIT NOT NULL,
    verify_otp_expire_at BIGINT,
    reset_otp VARCHAR(255),
    reset_otp_expire_at BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE doctors (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    average_consultation_time INT,
    specialty VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    about VARCHAR(1000) NOT NULL,
    available BIT NOT NULL,
    fees DOUBLE NOT NULL,
    image_url VARCHAR(255),
    CONSTRAINT pk_doctors PRIMARY KEY (id),
    CONSTRAINT uk_doctors_user UNIQUE (user_id),
    CONSTRAINT fk_doctors_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE patients (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    gender ENUM('MALE','FEMALE','OTHER'),
    birthday DATE,
    image_url VARCHAR(512),
    CONSTRAINT pk_patients PRIMARY KEY (id),
    CONSTRAINT uk_patients_user UNIQUE (user_id),
    CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE appointments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_id BIGINT,
    doctor_id BIGINT,
    appointment_date DATE,
    token_number INT,
    status ENUM('CANCELLED','COMPLETED','IN_PROGRESS','PENDING','WAITING'),
    created_at DATETIME(6),
    start_time DATETIME(6),
    end_time DATETIME(6),
    rating INT,
    feedback VARCHAR(1000),
    CONSTRAINT pk_appointments PRIMARY KEY (id),
    CONSTRAINT uq_doctor_date_token UNIQUE (doctor_id, appointment_date, token_number),
    CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patients (id),
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);

CREATE INDEX idx_appointments_doctor_date_status
    ON appointments (doctor_id, appointment_date, status);

CREATE INDEX idx_appointments_patient_created
    ON appointments (patient_id, created_at);
