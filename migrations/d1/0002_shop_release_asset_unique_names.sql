-- Prevent concurrent uploads from associating the same WAV filename twice for one release.
-- Existing production rows were checked for duplicates before this index was applied.
CREATE UNIQUE INDEX IF NOT EXISTS idx_shop_release_assets_upc_filename
ON shop_release_assets(release_upc, lower(file_name));
