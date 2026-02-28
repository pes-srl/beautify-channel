-- Prevent duplicate policy errors by dropping it first if it exists
DROP POLICY IF EXISTS "Allow public and authenticated SELECT" ON storage.objects;

-- Allow ANYONE (including public users) to SELECT/read objects from the 'bucket-assets' bucket.
CREATE POLICY "Allow public and authenticated SELECT"
ON storage.objects FOR SELECT
USING (bucket_id = 'bucket-assets');
