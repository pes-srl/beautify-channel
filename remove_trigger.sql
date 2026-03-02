-- BEAUTIFY CHANNEL: REMOVE TRIGGER FOR TESTING

-- Drops the trigger entirely from the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
