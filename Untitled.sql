SELECT id,name, description, price, images, "showIn" FROM public."Products" where "showIn" = 'Recommended' order by id limit 2 offset 1 

SELECT * FROM public."Products" order by id limit 10 offset 0

select * from "Brands"

select * from "Categories"

select * from "Wishlists"
select * from "Carts"
SELECT c.*,
       CASE 
           WHEN w."productId" IS NOT NULL THEN TRUE
           ELSE FALSE
       END AS "exists_in_wishlist"
FROM "Carts" c
LEFT JOIN "Wishlists" w
ON c."productId" = w."productId"
WHERE c."userId" = '2';
select * from "Products"
UPDATE "Products" 
SET "category" = FLOOR(10 + (RANDOM() * 11)), 
    "brand" = FLOOR(10 + (RANDOM() * 11));

select * from "Users"

select * from "Products"  order by id desc
select * from "Payments"
select * from "Brands" order by id asc
select * from "Categories" order by id asc

SELECT 
    b.brand_name, 
    p."brandId", 
    p.id AS productId, 
    p.name AS productName
FROM 
    "Brands" b
INNER JOIN 
    "Products" p 
ON 
    b.id = p."brandId"::integer
ORDER BY 
    b.brand_name, 
    p.id;



SELECT 
    c."Category_name", 
    c.id as category_id,
    p.name as productName,
	p.id as productId
FROM 
    "Categories" c
INNER JOIN 
    "Products" p 
ON 
    c.id = p."categoryId"::integer
ORDER BY 
    c."Category_name",p.id


SELECT 
    p.*, 
    COALESCE(c.quantity, 0) AS quantity,
    c.id AS cart_id,
    b.brand_name,
    cat."Category_name"
FROM 
    "Products" p
LEFT JOIN 
    "Carts" c 
ON 
    p.id = c."productId"::INTEGER 
    AND c."userId" = $1
LEFT JOIN 
    "Brands" b 
ON 
    p."brandId"::INTEGER = b.id
LEFT JOIN 
    "Categories" cat 
ON 
    p."categoryId"::INTEGER = cat.id
WHERE 
    p.id = $2 
    AND p."isPublished" = true;

SELECT 
    p.*, 
    b.brand_name, 
    cat."Category_name"
FROM 
    "Products" p
LEFT JOIN 
    "Brands" b 
ON 
    p."brandId"::INTEGER = b.id
LEFT JOIN 
    "Categories" cat 
ON 
    p."categoryId"::INTEGER = cat.id
WHERE 
    p.id = '102' 
    AND p."isPublished" = true;



SELECT rating FROM "Products" 


WHERE brand = (SELECT DISTINCT brand FROM "Products" WHERE brand = 'OKM DETECTORS');

select (select "brand_name" from "Brands") from "Products" where brand = 'OKM DETECTORS'

select * from "Categories"
select * from "Brands"
update "Products" set "manual" = '["https://camcapture.smartaihr.com/uploads/productManuals/1737315076238-supraja-certificate.pdf"]'
update "Products" set "product_details"='The ground scanner Rover C4 is an easy-to-use multi-purpose treasure and void detector' where "product_details"='';
select * from "Payments" order by id desc

select * from "Carts" where id = 12 and "userId" = '25'


select * from "Carts"  WHERE "userId" = '25' AND "productId" = '10'

SELECT p.*, c.quantity FROM "Products" p JOIN "Carts" c ON p.id = c."productId"::INTEGER WHERE c."userId" = '25' AND c."productId" ~ '^[0-9]+$';

UPDATE "Carts" SET quantity = quantity + 1 WHERE "userId" = '25' AND "productId" = '10'

SELECT *
FROM "Products" order by "createdAt" desc
WHERE id = 8
  AND id IN (SELECT "productId"::INTEGER FROM "Carts" where "userId"='25');


SELECT *
FROM "Products" order by createdAt desc
WHERE id IN (SELECT "productId"::INTEGER FROM "Carts" where "userId" = '25');

SELECT p.*, p.id as product_id, c.id FROM "Products" p JOIN "Wishlists" c ON p.id = c."productId"::INTEGER WHERE c."userId" = '2' AND c."productId" ~ '^[0-9]+$'


UPDATE "Products"
SET 
    "price_in_usd" = ROUND(CAST(RANDOM() * 10 + 1 AS NUMERIC), 2), -- Random price between 1.00 and 100.00
    "price_in_inr" = ROUND(CAST((RANDOM() * 10 + 1) * 82.0 AS NUMERIC), 2); -- Assume 1 USD = 82 INR

select * from "billing_addresses"

select id,brand_name from "Brands"

select id,"Category_name" from "Categories"

UPDATE "Products"
SET brand = CASE 
    WHEN id % 5 = 0 THEN 'OKM Detectors'
    WHEN id % 5 = 1 THEN 'Proton Detectors'
    WHEN id % 5 = 2 THEN 'Nokta-Makro Detectors'
    WHEN id % 5 = 3 THEN 'Ger Detectors'
    WHEN id % 5 = 4 THEN 'Geo Ground Detectors'
END;

UPDATE "Products"
SET category = CASE 
    WHEN id % 5 = 0 THEN 'Metal Detectors'
    WHEN id % 5 = 1 THEN 'Gold Metal Detectors'
    WHEN id % 5 = 2 THEN '3D Metal Detectors'
    WHEN id % 5 = 3 THEN '3D Ground Scanners'
    WHEN id % 5 = 4 THEN 'Long Range Gold Locators'
END;

select * from "Orders" where "userId" = '2'
select "categoryId","brandId" from "Products"
SELECT o.*, 
       p.name AS product_name, 
       p.description AS product_description, 
       p.price_in_usd AS price_in_usd,
	   P.price_in_inr AS price_in_inr,
       p.images AS product_image
FROM "Orders" o
JOIN "Products" p ON o."productId" = p.id::text
WHERE o."userId" = '2'and o.id = '1'::integer


UPDATE "Products"
SET "showIn" = CASE
                  WHEN RANDOM() < 0.2 THEN 'Featured'::"enum_Products_showIn"
                  WHEN RANDOM() < 0.4 THEN 'BestSelling'::"enum_Products_showIn"
                  WHEN RANDOM() < 0.6 THEN 'Recommended'::"enum_Products_showIn"
                  WHEN RANDOM() < 0.8 THEN 'NewArrival'::"enum_Products_showIn"
                  ELSE 'All'::"enum_Products_showIn"
               END
WHERE "showIn" != 'All'::"enum_Products_showIn"; -- Optional condition

select * from "Orders"
select * from "Users" where "cat"= 'data' limit 10 
select paypal_response from "Payments" order by created_at desc


truncate "Payments"

selecT * from "Carts"

SELECT "order_id", COUNT(*) AS "Count"
FROM "Payments"
GROUP BY "order_id"
HAVING COUNT(*) > 1;

select features from "Products" limit 3 offset 1

SELECT o.*, p.name AS product_name, p.description AS product_description, p.price_in_usd AS price_in_usd,P.price_in_inr AS price_in_inr, p.images AS product_image FROM "Orders" o JOIN "Products" p ON o."productId" = p.id::text WHERE o."userId" = '2'

select * from "Products" order by id desc
select * from "Orders"
select * from "Payments"
truncate "Orders"
SELECT o.*, p.name AS product_name, p.description AS product_description, p.price_in_usd AS price_in_usd,P.price_in_inr AS price_in_inr, p.images AS product_image FROM "Orders" o JOIN "Products" p ON o."productId" = p.id::text WHERE o."userId" = '2';
select * from "Payments"
truncate "Orders"
SELECT o.*, p.* FROM "Orders" o JOIN "Products" p ON o."productId" = p.id::text WHERE o."userId" = '2' and o.id = 1::integer

ALTER TABLE Orders
MODIFY COLUMN paymentStatus ENUM('PENDING', '', 'Failed', 'Refunded');


select * from "billing_addresses"

UPDATE "Payments" 
SET 
    created_at = NOW(),
    updated_at = NOW();