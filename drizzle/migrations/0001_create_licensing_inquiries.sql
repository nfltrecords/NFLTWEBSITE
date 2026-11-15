CREATE TABLE public.licensing_inquiries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 created_at timestamptz NOT NULL DEFAULT now(),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
 organization text NOT NULL DEFAULT '' CHECK (char_length(organization) <= 150),
 inquiry_type text NOT NULL CHECK (inquiry_type IN ('availability', 'licensing')),
 release_upc text CHECK (release_upc IS NULL OR release_upc IN ('199955740199','199956554184','199956222809','199955715135','199955742094','199955701558','199955715203','199751511160','199751512501','199751514697','199751613871','199751508283','199751168234','199751170992','199956557857','199954147302','199951252436','821440674572')),
 usage text NOT NULL CHECK (usage IN ('audiovisual','advertising','film','creator','game','other')),
 territory text NOT NULL DEFAULT '' CHECK (char_length(territory) <= 150),
 duration text NOT NULL DEFAULT '' CHECK (char_length(duration) <= 150),
 message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 3000),
 locale text NOT NULL CHECK (locale IN ('fr','en')),
 intended_recipient text NOT NULL DEFAULT 'nfltrecords@nflt-records.com' CHECK (intended_recipient = 'nfltrecords@nflt-records.com')
);
GRANT INSERT ON public.licensing_inquiries TO anon, authenticated;
GRANT ALL ON public.licensing_inquiries TO service_role;
ALTER TABLE public.licensing_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit licensing inquiries" ON public.licensing_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);