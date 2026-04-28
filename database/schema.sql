-- Run this once in SSMS before starting the app.
-- Create the database first if it doesn't exist:
--   CREATE DATABASE AuthPractice;
-- Then select it and run the table below.

CREATE TABLE Users (
  id         INT IDENTITY(1,1) PRIMARY KEY,
  name       NVARCHAR(100)  NOT NULL,
  email      NVARCHAR(255)  NOT NULL UNIQUE,
  password   NVARCHAR(255)  NOT NULL,
  created_at DATETIME       DEFAULT GETDATE()
);
