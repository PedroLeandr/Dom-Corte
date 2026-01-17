-- Migração: Adicionar coluna user_id à tabela bookings
-- Execute este script no seu banco de dados PostgreSQL

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);

-- Criar índice para melhor performance nas buscas por user_id
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name = 'user_id';
