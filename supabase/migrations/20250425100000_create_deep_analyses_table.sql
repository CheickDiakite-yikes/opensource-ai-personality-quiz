-- supabase/migrations/20250425100000_create_deep_analyses_table.sql

-- Create the deep_analyses table
CREATE TABLE public.deep_analyses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id uuid NOT NULL, -- Assuming you have an 'assessments' table or similar to link to
    user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    analysis_data jsonb NOT NULL,

    -- Add foreign key constraint if you have an assessments table (replace 'assessments' if needed)
    -- CONSTRAINT fk_assessment
    --   FOREIGN KEY(assessment_id)
    --   REFERENCES public.assessments(id)
    --   ON DELETE CASCADE

    -- Add potential future constraint if assessment_id should be unique per user
    -- CONSTRAINT unique_user_assessment UNIQUE (user_id, assessment_id)
);

-- Add indexes for common query patterns
CREATE INDEX idx_deep_analyses_user_id ON public.deep_analyses(user_id);
CREATE INDEX idx_deep_analyses_assessment_id ON public.deep_analyses(assessment_id);
-- Optional: Index specific paths within the JSONB if needed later
-- CREATE INDEX idx_deep_analyses_data_trait_score ON public.deep_analyses USING gin ((analysis_data -> 'traits' ->> 'score'));

-- Add comments to table and columns
COMMENT ON TABLE public.deep_analyses IS 'Stores the detailed analysis results from the 100-question deep assessment.';
COMMENT ON COLUMN public.deep_analyses.id IS 'Unique identifier for the deep analysis result.';
COMMENT ON COLUMN public.deep_analyses.assessment_id IS 'Identifier linking to the specific assessment instance.';
COMMENT ON COLUMN public.deep_analyses.user_id IS 'Identifier linking to the user who took the assessment.';
COMMENT ON COLUMN public.deep_analyses.created_at IS 'Timestamp when the analysis was created.';
COMMENT ON COLUMN public.deep_analyses.analysis_data IS 'JSONB blob containing the full AI-generated analysis report.';

-- Enable Row Level Security (RLS)
ALTER TABLE public.deep_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Allow users to select their own deep analyses
CREATE POLICY "Allow individual user select access"
ON public.deep_analyses
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Allow users to insert their own deep analyses
-- Note: Ensure assessment_id and user_id passed from the function match auth context
CREATE POLICY "Allow individual user insert access"
ON public.deep_analyses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to update their own deep analyses (optional, consider if needed)
-- CREATE POLICY "Allow individual user update access"
-- ON public.deep_analyses
-- FOR UPDATE
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own deep analyses (optional, consider if needed)
-- CREATE POLICY "Allow individual user delete access"
-- ON public.deep_analyses
-- FOR DELETE
-- USING (auth.uid() = user_id);

-- Grant usage permissions for the table to authenticated users
GRANT SELECT, INSERT ON TABLE public.deep_analyses TO authenticated;

-- Grant usage on the sequence (if any auto-incrementing PK was used, not needed for UUID)
-- GRANT USAGE, SELECT ON SEQUENCE public.deep_analyses_id_seq TO authenticated; 