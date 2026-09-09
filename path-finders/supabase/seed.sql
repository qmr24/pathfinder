insert into public.subjects(code,name) values
('ACC','Accounting'),('ECO','Economics'),('ICT','ICT'),('BS','Business Studies')
on conflict (code) do nothing;

insert into public.subject_combinations(code,name) values
('commerce_ict','Accounting + Economics + ICT'),
('commerce_bs','Accounting + Economics + Business Studies')
on conflict (code) do nothing;

insert into public.resource_categories(name) values ('Notes'),('Past Papers'),('Model Papers'),('Revision Materials'),('Other Documents') on conflict do nothing;
