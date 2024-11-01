-- Purely in here to show the function used on Supabase for Searching Companies in a Radius

-- Enable PostGIS if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the search function
CREATE OR REPLACE FUNCTION search_companies_in_radius(
  lat double precision,
  lng double precision,
  radius_km double precision,
  service_category text
)
RETURNS SETOF companies
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT c.*
  FROM companies c
  INNER JOIN service_areas sa ON sa.company_id = c.id
  INNER JOIN services s ON sa.service_id = s.id
  WHERE s.category = service_category
  AND sa.is_active = true
  AND ST_DWithin(
    ST_GeomFromGeoJSON(sa.geojson),
    ST_SetSRID(ST_MakePoint(lng, lat), 4326),
    radius_km * 1000
  );
$$;

-- Create spatial index on geojson column
CREATE INDEX IF NOT EXISTS idx_service_areas_geom 
ON service_areas USING GIST (ST_GeomFromGeoJSON(geojson));

-- Create regular indexes for common filters
CREATE INDEX IF NOT EXISTS idx_service_areas_active 
ON service_areas (is_active);

CREATE INDEX IF NOT EXISTS idx_services_category 
ON services (category);

-- Grant access to the function
GRANT EXECUTE ON FUNCTION search_companies_in_radius TO authenticated;
GRANT EXECUTE ON FUNCTION search_companies_in_radius TO anon;