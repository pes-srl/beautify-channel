-- Enable inserting into the 'bucket-assets' bucket for authenticated users
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'bucket-assets' );

-- Ensure they can also delete their own uploads or we can allow admins to delete anything
CREATE POLICY "Allow authenticated deletes" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'bucket-assets' );

-- Ensure they can update (overwrite) existing files
CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'bucket-assets' );
