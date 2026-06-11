-- Create storage bucket for hair diagnosis photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('hair-photos', 'hair-photos', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hair-photos');

-- Policy to allow authenticated users to read
CREATE POLICY "Allow authenticated reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'hair-photos');

-- Policy to allow service role to manage (for API)
CREATE POLICY "Allow service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'hair-photos')
WITH CHECK (bucket_id = 'hair-photos');
