-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PASSWORD RESETS
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_resets_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_token_hash (token_hash),
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DONATIONS
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  note VARCHAR(255) NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'GHS',
  status ENUM('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_donations_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,

  INDEX idx_user_id (user_id),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PAYMENTS (transaction history)
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donation_id INT NULL,
  method ENUM('paystack','mobile_money','card') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'GHS',
  reference VARCHAR(120) NOT NULL,
  status ENUM('pending','success','failed') NOT NULL DEFAULT 'pending',
  provider VARCHAR(60) NULL,
  provider_response JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_payments_donation
    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE SET NULL,

  UNIQUE KEY uq_reference (reference),
  INDEX idx_donation_id (donation_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(64) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(30) NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_public_id (public_id),
  INDEX idx_email (email),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;