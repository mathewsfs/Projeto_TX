INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt") 
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Juni', 'admin@junipiercer.com', '$2b$10$F1QdEqjRg3aIreA1cKP0aehU/42djRS/H89hdfnhXvobEn/Lc69MW', 'ADMIN', NOW(), NOW()) 
ON CONFLICT DO NOTHING;
