-- OPTIONAL demo products. Delete them in Admin > Products when you add your own.
insert into public.products (slug,name,brand,category,price,original_price,description,sizes,colors,is_new,is_featured,is_best_seller,published,popularity) values
('demo-runner','[DEMO] Court Runner','DEMO','shoes',450,520,'Demo product. Delete me.','{"41":2,"42":3,"43":1,"44":0}','{"White","Black"}',true,true,false,true,5),
('demo-hoodie','[DEMO] Heavy Hoodie','DEMO','clothing',280,null,'Demo product. Delete me.','{"S":2,"M":4,"L":3,"XL":1}','{"Grey"}',true,false,true,true,9),
('demo-cap','[DEMO] Washed Cap','DEMO','accessories',90,null,'Demo product. Delete me.','{"One size":8}','{"Black"}',false,true,true,true,3),
('demo-jacket','[DEMO] Shell Jacket','DEMO','clothing',520,650,'Demo product. Delete me.','{"M":1,"L":2}','{"Black"}',false,true,false,true,2)
on conflict do nothing;
