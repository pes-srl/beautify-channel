-- Add card_image_url to radio_channels
ALTER TABLE radio_channels 
ADD COLUMN IF NOT EXISTS card_image_url text;
