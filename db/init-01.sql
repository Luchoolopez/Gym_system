-- Creación de la base de datos (mismo nombre que MYSQL_DATABASE en .env)
CREATE DATABASE IF NOT EXISTS gym_db;
USE gym_db;

-- 1. Roles (Admin, Profesor, User)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE, -- Identificación para la credencial digital / check-in en recepción
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. Tokens de recuperación de contraseña (flujo autónomo del usuario)
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Catálogo de Actividades (Musculación, Funcional, Spinning, etc.)
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Catálogo de Membresías (Los planes que crea el Admin)
CREATE TABLE membership_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INT NOT NULL, -- ej: 30 para un pase mensual
    class_limit INT DEFAULT NULL, -- NULL = pase libre; número = clases incluidas en el período
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Suscripciones de Usuarios (La membresía activa de cada persona)
CREATE TABLE user_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    classes_used INT NOT NULL DEFAULT 0, -- Solo relevante si el plan tiene class_limit
    payment_status ENUM('PENDING', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES membership_plans(id)
);

-- 7. Pagos (registro real de cada cobro de una suscripción)
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('CASH', 'TRANSFER', 'CARD', 'MERCADOPAGO') NOT NULL,
    payment_date DATE NOT NULL,
    registered_by INT, -- Admin que registró el pago; NULL si fue un pago online automático
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Horarios del Gimnasio / Clases (grilla semanal recurrente)
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    day_of_week ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    professor_id INT, -- Puede ser nulo si es horario libre
    room VARCHAR(100), -- ej: "Sala Musculación", "Salón 2"
    capacity INT DEFAULT NULL, -- Nulo si no hay límite de cupo
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Reservas de Clases (Control de Cupos)
CREATE TABLE class_reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    schedule_id INT NOT NULL,
    reservation_date DATE NOT NULL, -- La fecha específica de la clase (ej. 2026-07-20)
    status ENUM('RESERVED', 'CANCELLED', 'ATTENDED', 'NO_SHOW') DEFAULT 'RESERVED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
    -- Restricción para que un usuario no pueda reservar dos veces la misma clase el mismo día
    UNIQUE KEY unique_user_reservation (user_id, schedule_id, reservation_date)
);

-- 10. Control de Asistencia (Check-in)
CREATE TABLE check_ins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registered_by INT, -- Admin que registró la entrada
    notes VARCHAR(255), -- Opcional, por si el admin quiere anotar algo (ej. "olvidó toalla")
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. Rutinas Personalizadas
CREATE TABLE routines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL, -- Acá podrías guardar JSON si querés estructurar ejercicios, series y repeticiones
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES users(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserción de roles básicos
INSERT INTO roles (name) VALUES ('Admin'), ('Profesor'), ('User');

-- Actividades iniciales de ejemplo
INSERT INTO activities (name, description) VALUES
    ('Musculación', 'Sala de musculación y cardio'),
    ('Funcional', 'Entrenamiento funcional grupal'),
    ('Spinning', 'Clase de ciclismo indoor');
