import json
import os
import shutil

# Directories
WORKSPACE_DIR = r"c:\Users\91636\Desktop\Project"
EXTRACTED_DIR = os.path.join(WORKSPACE_DIR, "extracted_chat")
DATA_DIR = os.path.join(WORKSPACE_DIR, "data")
ASSETS_DIR = os.path.join(WORKSPACE_DIR, "assets", "products")
BRAND_ASSETS_DIR = os.path.join(WORKSPACE_DIR, "assets", "brand")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(BRAND_ASSETS_DIR, exist_ok=True)

# Copy and rename brand logo
logo_src = os.path.join(EXTRACTED_DIR, "00000007-PHOTO-2026-09-07-22-29-29.jpg")
logo_dst = os.path.join(BRAND_ASSETS_DIR, "vitasta_logo_banner.jpg")
if os.path.exists(logo_src):
    shutil.copy2(logo_src, logo_dst)

# Brand Information
brand_data = {
    "name": "Vitasta",
    "full_brand_name": "Vitasta by Smita Saraswat",
    "business_entity": "VITASTA Lifestyle",
    "tagline": "Unfolding Serenity",
    "origin": "Jodhpur, Rajasthan, India",
    "about": {
        "title": "About Vitasta",
        "description": "Vitasta by Smita Saraswat is a premium handcrafted saree brand from Jodhpur, Rajasthan, inspired by the timeless grace and grandeur of the queens and royal women of Rajasthan. Our designs are created keeping that regal heritage in mind—reimagining the richness of traditional royal craftsmanship for the modern woman.",
        "craftsmanship": "Every saree is crafted using carefully selected premium fabrics and detailed handwork such as Aari, Gota Patti, Zardozi, Cutdana, Pitta and sequins. Much of this intricate work is done on a traditional adda, where skilled artisans spend weeks and sometimes even months, patiently working by hand to bring a single saree to life.",
        "philosophy": "From the choice of fabric to the final finishing, each piece reflects precision, patience and craftsmanship. At Vitasta, we aim to preserve the beauty of traditional artistry while creating sarees that feel refined, elegant and timeless.",
        "badge": "Proudly handcrafted in Jodhpur, Rajasthan, India"
    },
    "theme_palette": {
        "primary": "#0B3B60",       # Royal / Heritage Navy Blue
        "primary_dark": "#062238",
        "primary_light": "#1B5585",
        "secondary": "#C1272D",     # Regal Red / Crimson Accent
        "secondary_hover": "#A01B20",
        "neutral_light": "#FFFFFF", # Pure White
        "neutral_cream": "#F9F8F6", # Ivory / Warm White
        "neutral_dark": "#1A1A1A",  # Charcoal / Text Dark
        "accent_gold": "#D4AF37",   # Subtle Gold / Zari tone
        "description": "Primary theme consists strictly of Royal Blue, Classic White, and Regal Red accents as specified."
    },
    "contact_support": {
        "address": {
            "line1": "House No. 10A, Kanti, Paota B Road",
            "line2": "Near Jalam Niwas",
            "city": "Jodhpur",
            "state": "Rajasthan",
            "postal_code": "342001",
            "country": "India"
        },
        "phone": "+91 88240 17443",
        "phone_display": "+91 88240 17443",
        "whatsapp": "918824017443",
        "email": "vitastabysmita@gmail.com",
        "packed_and_marketed_by": "VITASTA Lifestyle, House No. 10A, Kanti, Paota B Road, Near Jalam Niwas, Jodhpur, Rajasthan – 342001",
        "country_of_origin": "India"
    },
    "policies": {
        "crafting_and_shipping": {
            "title": "Handcrafted Timeline & Dispatch",
            "timeline": "15–30 days",
            "description": "Every piece at Vitasta is thoughtfully handcrafted and may take 15–30 days to complete, depending on the intricacy of the work.",
            "quality_assurance": "Before your order is packed and dispatched, our product undergoes multiple thorough quality checks to ensure that it reaches you in perfect condition. A detailed video of the complete product will also be shared before dispatch for complete transparency."
        },
        "return_policy": {
            "title": "Return Policy",
            "accepted": False,
            "policy_text": "As our products are thoughtfully handcrafted, custom-made, and thoroughly inspected with video proof shared prior to dispatch, returns are not accepted.",
            "disclaimer": "Please note: Slight variations in handcrafted details and colour may occur. Product colours may also vary slightly due to photography, lighting, and screen settings."
        },
        "saree_care_guide": {
            "title": "Saree Care Guide",
            "instructions": [
                "Dry Clean Only – Avoid machine wash and regular hand wash.",
                "Store in a clean, dry muslin or cotton bag; avoid plastic covers for long-term storage.",
                "Keep away from moisture and direct sunlight to protect the fabric and colours.",
                "For sarees with Zardozi, Gota Patti, Sequins, Aari, Cutdana or other handwork, fold gently to avoid snagging.",
                "Use a low-heat iron from the reverse side or place a thin cotton cloth over delicate fabrics.",
                "Avoid spraying perfume or deodorant directly on the saree.",
                "After wearing, air it in shade before storing.",
                "Refold silk and Banarasi sarees occasionally to prevent permanent crease lines."
            ],
            "closing_note": "Care for it with love, and your Vitasta saree will become a timeless heirloom—made to be cherished, preserved, and passed down through generations."
        }
    }
}

# Categories
categories_data = [
    {
        "id": "riwaayat-e-chiffon",
        "name": "Riwaayat-e-Chiffon",
        "fabric": "Pure Premium Chiffon",
        "tagline": "Feather-Light Elegance & Fluid Drapes",
        "description": "Crafted in pure premium-quality chiffon, known for its feather-light feel, fluid drape and effortless grace. Soft, airy and beautifully flowy, it falls elegantly on the body, making it perfect for refined festive and occasion wear."
    },
    {
        "id": "georgette-reet",
        "name": "Georgette Reet",
        "fabric": "Khaddi & Satin Georgette",
        "tagline": "Graceful Fall & Intricate Handwork",
        "description": "Our premium georgette is loved for its soft texture, graceful fall and subtle structure. Lightweight yet beautifully draped, it holds intricate handwork exceptionally well while remaining comfortable and easy to carry."
    },
    {
        "id": "silk-noorani",
        "name": "Silk Noorani",
        "fabric": "Habutai Silk, Dupion Silk & Satin Silk",
        "tagline": "Rich Luster & Regal Splendor",
        "description": "Rich, lustrous and timeless, our premium silk brings natural elegance to every drape. Its smooth texture, graceful sheen and luxurious feel make it ideal for sarees designed to look regal yet sophisticated."
    },
    {
        "id": "organza-adaa",
        "name": "Organza Adaa",
        "fabric": "Pure Organza Silk",
        "tagline": "Delicate Sheer & Statement Silhouette",
        "description": "Delicate yet structured, our premium organza silk is known for its sheer texture, crisp fall and subtle luminous finish. It creates a graceful, statement silhouette while beautifully highlighting fine embroidery and handwork."
    },
    {
        "id": "banarasi-virasat",
        "name": "Banarasi Virasat",
        "fabric": "Banarasi Khaddi Georgette & Weaves",
        "tagline": "Rooted in Royal Heritage & Festive Grandeur",
        "description": "Rooted in heritage, our premium Banarasi fabric reflects the richness of traditional Indian weaving. Known for its intricate motifs, luxurious texture and regal appeal, every drape carries a timeless sense of craftsmanship and celebration."
    }
]

# All 21 Products
products_raw = [
    {
        "id": 1,
        "slug": "sunset-ombre-chiffon-cutdana-moti-sequin-saree",
        "title": "Sunset Ombré Chiffon cutdana Moti Sequin Saree With Italian Crepe Blouse",
        "price": 16999,
        "currency": "INR",
        "price_formatted": "₹16,999",
        "category_id": "riwaayat-e-chiffon",
        "category_name": "Riwaayat-e-Chiffon",
        "description": "A vibrant sunset ombré pure premium-quality chiffon saree, transitioning beautifully through golden yellow, tangerine orange, coral and soft peach tones. Paired with a golden yellow Italian crepe blouse, the saree and blouse are intricately adorned with cutdana, Moti and Sequin work. Delicate floral motifs and shimmering embellishments add an elegant, festive charm to the fluid chiffon drape.\n\nPerfect for weddings, festive occasions and celebrations.",
        "specifications": {
            "product_category": "Chiffon Saree",
            "fabric": "Pure Premium Quality Chiffon",
            "blouse_fabric": "Italian Crepe",
            "work": "Kardana, Moti & Sequin Work",
            "design": "Delicate Floral Motifs & Shimmering Embellishments",
            "color": "Sunset Ombré – Golden Yellow, Tangerine Orange, Coral & Soft Peach",
            "blouse_color": "Golden Yellow",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000039-PHOTO-2026-09-16-16-35-07.jpg",
            "00000041-PHOTO-2026-09-16-16-36-21.jpg",
            "00000043-PHOTO-2026-09-16-16-36-42.jpg",
            "00000044-PHOTO-2026-09-16-16-36-43.jpg",
            "00000045-PHOTO-2026-09-16-16-36-43.jpg"
        ]
    },
    {
        "id": 2,
        "slug": "emerald-green-bandhani-banarasi-khadi-georgette-cutdana-saree",
        "title": "Emerald Green Bandhani Banarasi Khadi Georgette Cutdana Saree With Matching Blouse",
        "price": 26999,
        "currency": "INR",
        "price_formatted": "₹26,999",
        "category_id": "banarasi-virasat",
        "category_name": "Banarasi Virasat",
        "description": "A regal emerald green pure premium-quality Bandhani Banarasi Khaddi Georgette saree, paired with a matching blouse. The saree beautifully combines the richness of Banarasi weaving with traditional Bandhani detailing, enhanced with intricate Cutdana handwork across the saree and blouse. The all-over handcrafted embellishment and luxurious texture give it a rich festive appeal, making it perfect for weddings, festive occasions and traditional celebrations.",
        "specifications": {
            "product_category": "Bandhani Banarasi Saree",
            "fabric": "Pure Premium Quality Khaddi Georgette",
            "blouse_fabric": "Matching Khaddi Georgette",
            "work": "Cutdana Handwork",
            "design": "Bandhani with Banarasi Weave & Gold Detailing",
            "color": "Emerald Green with Gold Detailing",
            "blouse_color": "Emerald Green",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000051-PHOTO-2026-09-16-16-40-14.jpg",
            "00000052-PHOTO-2026-09-16-16-40-16.jpg",
            "00000053-PHOTO-2026-09-16-16-40-18.jpg",
            "00000054-PHOTO-2026-09-16-16-40-20.jpg"
        ]
    },
    {
        "id": 3,
        "slug": "wine-mauve-ombre-chiffon-pitta-aari-tari-sequin-saree",
        "title": "Wine & Mauve Ombré Chiffon Pitta Aari-Tari Sequin Saree With Italian Crepe Blouse",
        "price": 15999,
        "currency": "INR",
        "price_formatted": "₹15,999",
        "category_id": "riwaayat-e-chiffon",
        "category_name": "Riwaayat-e-Chiffon",
        "description": "An exquisite wine and mauve ombré pure premium-quality chiffon saree, paired with an Italian crepe blouse. The saree is beautifully handcrafted with intricate Pitta, Aari-Tari and Sequin work, featuring delicate rose motifs and an ornate floral border. The rich transition from deep wine to soft mauve adds depth and elegance to the fluid chiffon drape, making it perfect for weddings, festive occasions and elegant celebrations.",
        "specifications": {
            "product_category": "Chiffon Saree",
            "fabric": "Pure Premium Quality Chiffon",
            "blouse_fabric": "Italian Crepe",
            "work": "Pitta, Aari-Tari & Sequin Work",
            "design": "Rose & Floral Motifs with Ornate Border",
            "color": "Wine & Mauve Ombré",
            "blouse_color": "Mauve",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000059-PHOTO-2026-09-16-16-43-33.jpg",
            "00000060-PHOTO-2026-09-16-16-43-35.jpg",
            "00000061-PHOTO-2026-09-16-16-43-36.jpg",
            "00000062-PHOTO-2026-09-16-16-43-36.jpg"
        ]
    },
    {
        "id": 4,
        "slug": "ivory-off-white-chiffon-gota-patti-pitta-sequin-saree",
        "title": "Ivory Off-White Chiffon Gota Patti, Pitta work Sequin Saree With Italian Crepe Blouse",
        "price": 19999,
        "currency": "INR",
        "price_formatted": "₹19,999",
        "category_id": "riwaayat-e-chiffon",
        "category_name": "Riwaayat-e-Chiffon",
        "description": "An exquisite ivory off-white pure premium-quality chiffon saree, paired with an Italian crepe blouse. The saree features intricate Gota Patti, Sequin and Pitta work throughout, with graceful trailing vine and leaf motifs delicately spread across the entire drape. The subtle metallic detailing and soft shimmer beautifully complement the elegant ivory base, creating a timeless and sophisticated look perfect for weddings, festive occasions and elegant celebrations.",
        "specifications": {
            "product_category": "Chiffon Saree",
            "fabric": "Pure Premium Quality Chiffon",
            "blouse_fabric": "Italian Crepe",
            "work": "Gota Patti, Pitta work & Sequin Work",
            "design": "All-Over Vine & Leaf Motifs",
            "color": "Ivory Off-White",
            "blouse_color": "Ivory Off-White",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000067-PHOTO-2026-09-16-16-46-07.jpg",
            "00000068-PHOTO-2026-09-16-16-46-07.jpg"
        ]
    },
    {
        "id": 5,
        "slug": "peacock-teal-emerald-green-chiffon-pitta-cutdana-sequin-saree",
        "title": "Peacock Teal & Emerald Green Chiffon Pitta Cutdana Sequin Saree With Italian Crepe Blouse",
        "price": 22999,
        "currency": "INR",
        "price_formatted": "₹22,999",
        "category_id": "riwaayat-e-chiffon",
        "category_name": "Riwaayat-e-Chiffon",
        "description": "A striking peacock teal and emerald green ombré pure premium-quality chiffon saree, paired with an Italian crepe blouse. The saree is beautifully adorned with intricate Pitta work, Cutdana detailing and delicate Sequin accents, featuring elegant peacock and feather motifs throughout. The rich jewel-toned colour transition combined with shimmering handcrafted details gives the saree a regal yet graceful appeal, perfect for weddings, festive occasions and celebrations.",
        "specifications": {
            "product_category": "Chiffon Saree",
            "fabric": "Pure Premium Quality Chiffon",
            "blouse_fabric": "Italian Crepe",
            "work": "Pitta, Cutdana & Sequin Work",
            "design": "Peacock & Feather Motifs",
            "color": "Peacock Teal & Emerald Green Ombré",
            "blouse_color": "Peacock Teal",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000073-PHOTO-2026-09-16-16-49-28.jpg",
            "00000074-PHOTO-2026-09-16-16-49-28.jpg",
            "00000075-PHOTO-2026-09-16-16-49-29.jpg",
            "00000076-PHOTO-2026-09-16-16-49-29.jpg",
            "00000077-PHOTO-2026-09-16-16-49-30.jpg"
        ]
    },
    {
        "id": 6,
        "slug": "turquoise-teal-organza-silk-aari-sequin-saree",
        "title": "Turquoise Teal Organza Silk Aari Sequin Saree With Raw Silk Blouse",
        "price": 24999,
        "currency": "INR",
        "price_formatted": "₹24,999",
        "category_id": "organza-adaa",
        "category_name": "Organza Adaa",
        "description": "An elegant turquoise teal pure premium-quality organza silk saree, paired with a raw silk blouse. The saree is beautifully adorned with intricate Aari embroidery and delicate sequin work, featuring graceful floral and leafy motifs across the drape. The sheer organza texture combined with shimmering handcrafted details gives it a refined and sophisticated appeal, perfect for weddings, festive occasions and celebrations.",
        "specifications": {
            "product_category": "Organza Silk Saree",
            "fabric": "Pure Premium Quality Organza Silk",
            "blouse_fabric": "Raw Silk",
            "work": "Aari & Sequin Work",
            "design": "Graceful Floral and Leafy Motifs",
            "color": "Turquoise Teal",
            "blouse_color": "Turquoise Teal",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000082-PHOTO-2026-09-16-16-51-11.jpg",
            "00000083-PHOTO-2026-09-16-16-51-12.jpg"
        ]
    },
    {
        "id": 7,
        "slug": "dusty-taupe-blush-pink-chiffon-knot-kashida-sequin-saree",
        "title": "Dusty Taupe & Blush Pink Chiffon Knot Kashida Sequin Saree With Italian Crepe Blouse",
        "price": 19999,
        "currency": "INR",
        "price_formatted": "₹19,999",
        "category_id": "riwaayat-e-chiffon",
        "category_name": "Riwaayat-e-Chiffon",
        "description": "An elegant dusty taupe and blush pink pure premium-quality chiffon saree, paired with a coral pink Italian crepe blouse. The saree is beautifully adorned with intricate Knot Kashida embroidery and delicate sequin work, featuring graceful floral motifs and an embroidered border. Its soft colour transition and fluid chiffon drape lend it a refined, sophisticated appeal, making it perfect for weddings, festive occasions and elegant celebrations.",
        "specifications": {
            "product_category": "Chiffon Saree",
            "fabric": "Pure Premium Quality Chiffon",
            "blouse_fabric": "Italian Crepe",
            "work": "Knot Kashida & Sequin Work",
            "design": "Graceful Floral Motifs and Embroidered Border",
            "color": "Dusty Taupe & Blush Pink",
            "blouse_color": "Coral Pink",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000088-PHOTO-2026-09-16-16-55-03.jpg",
            "00000089-PHOTO-2026-09-16-16-55-04.jpg",
            "00000090-PHOTO-2026-09-16-16-55-05.jpg",
            "00000091-PHOTO-2026-09-16-16-55-05.jpg"
        ]
    },
    {
        "id": 8,
        "slug": "onion-pink-pure-chiffon-zero-sequins-cutdana-jaal-saree",
        "title": "Onion Pink Pure Chiffon Zero Sequins, Cutdana & Jaal Work Saree with Italian Crepe Blouse",
        "price": 21999,
        "currency": "INR",
        "price_formatted": "₹21,999",
        "category_id": "riwaayat-e-chiffon",
        "category_name": "Riwaayat-e-Chiffon",
        "description": "A graceful Onion Pink Pure Chiffon Saree crafted in premium-quality chiffon, featuring delicate zero sequins, cutdana and all-over jaal work that adds a soft, elegant shimmer to the drape.\n\nThe saree comes with a premium Italian crepe blouse, beautifully complementing the fluid fall and refined look of the chiffon. The intricate detailing across the saree gives it a sophisticated festive appeal, making it perfect for weddings, celebrations, festive occasions and elegant evening wear.",
        "specifications": {
            "product_category": "Chiffon Saree",
            "fabric": "Premium Pure Chiffon",
            "blouse_fabric": "Premium Italian Crepe",
            "work": "Zero Sequins, Cutdana & All-Over Jaal Work",
            "design": "Delicate Jaal Shimmer Handwork",
            "color": "Onion Pink",
            "blouse_color": "Matching Onion Pink",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "finish": "Lightweight, flowy and delicately handcrafted",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000096-PHOTO-2026-09-16-16-57-25.jpg",
            "00000097-PHOTO-2026-09-16-16-57-25.jpg"
        ]
    },
    {
        "id": 9,
        "slug": "coral-pink-chiffon-aari-tari-cutdana-jaal-saree",
        "title": "Coral Pink Chiffon Aari-Tari Cutdana Jaal Saree With Rani Pink Italian Crepe Blouse",
        "price": 20999,
        "currency": "INR",
        "price_formatted": "₹20,999",
        "category_id": "riwaayat-e-chiffon",
        "category_name": "Riwaayat-e-Chiffon",
        "description": "A vibrant coral pink pure premium-quality chiffon saree, paired with a contrasting rani pink Italian crepe blouse. The saree and blouse are beautifully handcrafted with intricate Aari-Tari and Cutdana work, featuring an elegant all-over floral jaal design. The rich pink tones combined with delicate metallic detailing create a graceful yet festive look, perfect for weddings, festive occasions and celebrations.",
        "specifications": {
            "product_category": "Chiffon Saree",
            "fabric": "Pure Premium Quality Chiffon",
            "blouse_fabric": "Italian Crepe",
            "work": "Aari-Tari & Cutdana Work",
            "design": "All-Over Floral Jaal Work",
            "color": "Coral Pink",
            "blouse_color": "Rani Pink",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000102-PHOTO-2026-09-16-17-13-44.jpg",
            "00000103-PHOTO-2026-09-16-17-13-45.jpg"
        ]
    },
    {
        "id": 10,
        "slug": "parrot-green-turquoise-banarasi-bandhej-khaddi-georgette-meena-saree",
        "title": "Parrot Green & Turquoise Banarasi Bandhej Khaddi Georgette Meena Saree with Khaddi Georgette Blouse",
        "price": 18999,
        "currency": "INR",
        "price_formatted": "₹18,999",
        "category_id": "banarasi-virasat",
        "category_name": "Banarasi Virasat",
        "description": "A stunning double-tone Banarasi Bandhej Khaddi Georgette saree, crafted in pure premium-quality Khaddi Georgette and paired with a matching Khaddi Georgette blouse. The saree features intricate Meena work, beautifully highlighted across its woven Bandhej-inspired pattern and ornate Banarasi border.\n\nThe striking blend of parrot green and turquoise blue creates a vibrant dual-tone effect, while the detailed Meena accents add richness and traditional elegance. Graceful yet statement-making, this saree is an ideal choice for weddings, festive occasions, traditional celebrations, poojas and special gatherings.",
        "specifications": {
            "product_category": "Banarasi Bandhej Khaddi Georgette Saree",
            "fabric": "Pure Premium Quality Khaddi Georgette",
            "blouse_fabric": "Khaddi Georgette",
            "work": "Meena Work with Banarasi Weaving & Bandhej Detailing",
            "design": "Bandhej Patterns with Ornate Banarasi Border",
            "color": "Parrot Green & Turquoise Blue",
            "blouse_color": "Turquoise Blue",
            "style": "Double-Tone Saree",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000108-PHOTO-2026-09-16-17-23-18.jpg",
            "00000109-PHOTO-2026-09-16-17-23-18.jpg",
            "00000110-PHOTO-2026-09-16-17-23-18.jpg"
        ]
    },
    {
        "id": 11,
        "slug": "pista-green-turquoise-khaddi-georgette-meena-saree",
        "title": "Pista Green & Turquoise Khaddi Georgette Meena Saree with Khaddi Georgette Blouse",
        "price": 18999,
        "currency": "INR",
        "price_formatted": "₹18,999",
        "category_id": "georgette-reet",
        "category_name": "Georgette Reet",
        "description": "A graceful Pista Green and Turquoise Blue saree crafted in pure premium-quality Khaddi Georgette, paired with a matching Khaddi Georgette blouse. Adorned with intricate Meena work and detailed woven motifs throughout, the saree beautifully blends traditional craftsmanship with a fresh and contemporary colour palette.\n\nThe soft pista green base flows seamlessly into vibrant turquoise blue accents, creating a striking yet refined contrast. Its delicate detailing and elegant drape make it a beautiful choice for weddings, festive occasions, traditional celebrations, day functions and intimate gatherings.",
        "specifications": {
            "product_category": "Khaddi Georgette Saree",
            "fabric": "Pure Premium Quality Khaddi Georgette",
            "blouse_fabric": "Khaddi Georgette",
            "work": "Meena Work with Woven Detailing",
            "design": "Intricate Woven Motifs & Contrast Accents",
            "color": "Pista Green & Turquoise Blue",
            "blouse_color": "Turquoise Blue",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000115-PHOTO-2026-09-16-17-27-18.jpg",
            "00000116-PHOTO-2026-09-16-17-27-19.jpg"
        ]
    },
    {
        "id": 12,
        "slug": "off-white-habutai-silk-aari-saree",
        "title": "Off-White Habutai Silk Aari Saree With Wine Raw Silk Blouse",
        "price": 17999,
        "currency": "INR",
        "price_formatted": "₹17,999",
        "category_id": "silk-noorani",
        "category_name": "Silk Noorani",
        "description": "An elegant off-white pure premium-quality Habutai silk saree, paired with a contrasting wine raw silk blouse. The saree is beautifully detailed with delicate Aari work, adding a subtle handcrafted charm to its graceful drape. The soft off-white tone paired with the rich wine blouse creates a timeless and sophisticated contrast, making it a perfect choice for festive occasions, intimate celebrations and elegant gatherings.",
        "specifications": {
            "product_category": "Habutai Silk Saree",
            "fabric": "Pure Premium Quality Habutai Silk",
            "blouse_fabric": "Raw Silk",
            "work": "Aari Work",
            "design": "Subtle Handcrafted Delicate Motif Accents",
            "color": "Off-White",
            "blouse_color": "Wine",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000121-PHOTO-2026-09-16-17-30-04.jpg",
            "00000122-PHOTO-2026-09-16-17-30-04.jpg",
            "00000123-PHOTO-2026-09-16-17-30-04.jpg"
        ]
    },
    {
        "id": 13,
        "slug": "peach-crush-slate-blue-double-tone-bandhani-banarasi-khaddi-georgette-saree",
        "title": "Peach Crush & Slate Blue Double-Tone Bandhani Banarasi Khaddi Georgette Saree with Khaddi Georgette Blouse",
        "price": 19999,
        "currency": "INR",
        "price_formatted": "₹19,999",
        "category_id": "banarasi-virasat",
        "category_name": "Banarasi Virasat",
        "description": "A graceful double-tone Bandhani Banarasi saree crafted in pure premium-quality Khaddi Georgette, paired with a matching Khaddi Georgette blouse. Woven with rich Banarasi detailing and traditional Bandhani-inspired patterns, this saree beautifully reflects timeless craftsmanship and festive elegance.\n\nThe soft blend of Peach Crush and slate blue-grey tones creates a refined double-tone effect, while the intricate woven motifs and rich border add a luxurious charm to the overall look. Elegant, graceful, and versatile, this saree is a perfect choice for weddings, festive celebrations, traditional functions, poojas, and special gatherings.",
        "specifications": {
            "product_category": "Double-Tone Bandhani Banarasi Saree",
            "fabric": "Pure Premium Quality Khaddi Georgette",
            "blouse_fabric": "Khaddi Georgette",
            "work": "Banarasi Weaving with Bandhani Detailing",
            "design": "Bandhani Patterns with Rich Banarasi Border",
            "color": "Peach Crush & Slate Blue-Grey",
            "blouse_color": "Peach Crush",
            "style": "Double-Tone Saree",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000128-PHOTO-2026-09-16-17-33-16.jpg",
            "00000129-PHOTO-2026-09-16-17-33-17.jpg"
        ]
    },
    {
        "id": 14,
        "slug": "royal-blue-banarasi-khaddi-georgette-lace-cutwork-saree",
        "title": "Royal Blue Banarasi Khaddi Georgette Saree with Border Lace Cutwork & Khaddi Georgette Blouse",
        "price": 19999,
        "currency": "INR",
        "price_formatted": "₹19,999",
        "category_id": "banarasi-virasat",
        "category_name": "Banarasi Virasat",
        "description": "A striking Royal Blue Banarasi saree crafted in pure premium-quality Khaddi Georgette, paired with a matching Khaddi Georgette blouse. The saree features intricate Banarasi woven motifs throughout and is beautifully finished with border lace cutwork, giving it a refined and distinctive look.\n\nThe rich royal blue base, highlighted with elegant gold-toned Banarasi weaving and delicate coral floral lace accents, brings together traditional craftsmanship with a fresh, statement appeal. Perfect for weddings, festive occasions, traditional functions, evening celebrations and special gatherings.",
        "specifications": {
            "product_category": "Banarasi Khaddi Georgette Saree",
            "fabric": "Pure Premium Quality Khaddi Georgette",
            "blouse_fabric": "Khaddi Georgette",
            "work": "Banarasi Weaving with Border Lace Cutwork",
            "design": "Gold-Toned Weaving & Coral Floral Cutwork Lace",
            "color": "Royal Blue",
            "blouse_color": "Royal Blue",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000134-PHOTO-2026-09-16-17-37-12.jpg",
            "00000135-PHOTO-2026-09-16-17-37-13.jpg",
            "00000136-PHOTO-2026-09-16-17-37-13.jpg"
        ]
    },
    {
        "id": 15,
        "slug": "mint-green-dupion-silk-zari-saree",
        "title": "Mint Green Dupion Silk Saree With Zari Motif Pure Silk Blouse",
        "price": 12999,
        "currency": "INR",
        "price_formatted": "₹12,999",
        "category_id": "silk-noorani",
        "category_name": "Silk Noorani",
        "description": "A graceful mint green pure premium-quality Dupion silk saree, paired with a pure silk blouse featuring delicate zari motifs. With its fresh pastel tone, clean silhouette and subtle sheen, this saree has a beautifully young, chic and contemporary feel while still keeping the elegance of traditional silk.\n\nIt is the kind of saree that feels perfect for young women who love minimal, sophisticated styling—effortless, graceful and modern without looking too heavy. Ideal for weddings, festive occasions, engagement functions, intimate celebrations and elegant day events.",
        "specifications": {
            "product_category": "Dupion Silk Saree",
            "fabric": "Pure Premium Quality Dupion Silk",
            "blouse_fabric": "Pure Silk",
            "work": "Zari Motifs on Blouse",
            "design": "Minimalist Chic with Delicate Zari",
            "color": "Mint Green",
            "blouse_color": "Mint Green",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000141-PHOTO-2026-09-16-17-41-22.jpg",
            "00000142-PHOTO-2026-09-16-17-41-24.jpg"
        ]
    },
    {
        "id": 16,
        "slug": "pista-green-satin-silk-saree",
        "title": "Pista Green Satin Silk Saree With Matching Silk Blouse",
        "price": 13999,
        "currency": "INR",
        "price_formatted": "₹13,999",
        "category_id": "silk-noorani",
        "category_name": "Silk Noorani",
        "description": "A sophisticated pista green pure premium-quality satin silk saree, paired with a matching silk blouse. With its soft pastel hue, fluid drape and luxurious satin sheen, this saree has a beautifully young, polished and effortlessly glamorous feel.\n\nIt is perfect for women who love a minimal yet striking look—elegant enough for a wedding or festive occasion, but modern enough to feel fresh and easy to style. Pair it with delicate jewellery and a sleek blouse for a refined contemporary look.",
        "specifications": {
            "product_category": "Satin Silk Saree",
            "fabric": "Pure Premium Quality Satin Silk",
            "blouse_fabric": "Silk",
            "design": "Glossy Satin Sheen & Modern Minimalist Draping",
            "color": "Pista Green",
            "blouse_color": "Pista Green",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000147-PHOTO-2026-09-16-17-43-03.jpg",
            "00000148-PHOTO-2026-09-16-17-43-03.jpg"
        ]
    },
    {
        "id": 17,
        "slug": "pink-peach-ombre-satin-georgette-saree",
        "title": "Pink Peach Ombre Satin Georgette Saree with Signature Georgette Blouse",
        "price": 11999,
        "currency": "INR",
        "price_formatted": "₹11,999",
        "category_id": "georgette-reet",
        "category_name": "Georgette Reet",
        "description": "A dreamy ombre saree crafted in pure premium-quality satin georgette, paired with a beautifully coordinated signature georgette blouse. The saree features a soft and fluid drape with a graceful sheen, while its multi-tone ombre effect brings together a refreshing blend of vibrant and delicate hues.\n\nThe beautiful play of fuchsia pink, blush pink, peach, apricot and soft lemon-yellow tones gives this saree a fresh, feminine and elegant appeal. Paired with a statement signature georgette blouse in a complementary patterned design, this ensemble is perfect for festive occasions, intimate celebrations, day functions, pre-wedding events and special gatherings.",
        "specifications": {
            "product_category": "Satin Georgette Saree",
            "fabric": "Pure Premium Quality Satin Georgette",
            "blouse_fabric": "Signature Georgette",
            "work": "Ombre Finish with Patterned Blouse",
            "design": "Multi-tone Ombré Shading",
            "color": "Fuchsia Pink, Blush Pink, Peach, Apricot & Soft Lemon Yellow",
            "blouse_color": "Pink, Peach & Orange Tones",
            "style": "Ombre Saree",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000158-PHOTO-2026-09-16-17-48-45.jpg",
            "00000160-PHOTO-2026-09-16-17-48-47.jpg",
            "00000161-PHOTO-2026-09-16-17-48-48.jpg"
        ]
    },
    {
        "id": 18,
        "slug": "mustard-gold-ombre-satin-georgette-saree",
        "title": "Mustard Gold Ombre Satin Georgette Saree with Banarasi Silk Blouse",
        "price": 11999,
        "currency": "INR",
        "price_formatted": "₹11,999",
        "category_id": "georgette-reet",
        "category_name": "Georgette Reet",
        "description": "A luxurious ombre saree crafted in pure premium-quality satin georgette, paired with a rich Banarasi silk blouse. The saree features a fluid drape with a soft satin sheen, beautifully transitioning through warm shades of mustard yellow, muted gold and champagne beige for an elegant ombre effect.\n\nThe lustrous satin georgette lends the saree a graceful fall and sophisticated finish, while the Banarasi silk blouse adds a touch of traditional richness. Refined yet statement-making, this ensemble is perfect for weddings, festive occasions, pre-wedding celebrations, evening functions and special gatherings.",
        "specifications": {
            "product_category": "Satin Georgette Saree",
            "fabric": "Pure Premium Quality Satin Georgette",
            "blouse_fabric": "Banarasi Silk",
            "design": "Warm Sunset Shaded Ombré & Woven Blouse",
            "color": "Mustard Yellow, Muted Gold & Champagne Beige",
            "blouse_color": "Mustard Yellow / Gold",
            "style": "Ombre Saree",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000163-PHOTO-2026-09-16-17-49-41.jpg",
            "00000164-PHOTO-2026-09-16-17-49-50.jpg"
        ]
    },
    {
        "id": 19,
        "slug": "blue-ombre-satin-georgette-saree",
        "title": "Blue Ombre Satin Georgette Saree with Tussar Silk Blouse",
        "price": 11999,
        "currency": "INR",
        "price_formatted": "₹11,999",
        "category_id": "georgette-reet",
        "category_name": "Georgette Reet",
        "description": "A graceful ombre saree crafted in pure premium-quality satin georgette, paired with a beautifully coordinated Tussar silk blouse. The saree features a soft, fluid drape with a subtle satin sheen, creating an elegant and refined look for every occasion.\n\nThe soothing blend of aqua blue, steel blue and deep slate blue gives the saree a beautiful ombre effect, adding depth and sophistication to its overall appeal. Paired with a statement Tussar silk blouse in a multicolour patterned design, this ensemble strikes the perfect balance between contemporary charm and timeless elegance. Ideal for festive occasions, intimate celebrations, day functions, pre-wedding gatherings and special events.",
        "specifications": {
            "product_category": "Satin Georgette Saree",
            "fabric": "Pure Premium Quality Satin Georgette",
            "blouse_fabric": "Tussar Silk",
            "work": "Ombre Finish with Patterned Blouse",
            "design": "Serene Ocean Blue Gradient Tones",
            "color": "Aqua Blue, Steel Blue & Deep Slate Blue",
            "blouse_color": "Multicolour Blue Tones",
            "style": "Ombre Saree",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000169-PHOTO-2026-09-16-17-51-49.jpg",
            "00000170-PHOTO-2026-09-16-17-51-49.jpg"
        ]
    },
    {
        "id": 20,
        "slug": "rani-pink-habutai-silk-saree",
        "title": "Rani Pink Habutai Silk Saree with Banarasi Silk Blouse",
        "price": 9999,
        "currency": "INR",
        "price_formatted": "₹9,999",
        "category_id": "silk-noorani",
        "category_name": "Silk Noorani",
        "description": "A striking Rani Pink saree crafted in pure premium-quality Habutai Silk, paired with a rich Banarasi Silk blouse. The saree features a smooth, fluid drape with a soft natural sheen, giving it an elegant and luxurious appeal.\n\nThe vibrant Rani Pink hue adds a bold yet graceful charm, while the Banarasi silk blouse brings in a touch of traditional richness and festive elegance. Refined, feminine, and statement-making, this saree is perfect for weddings, festive occasions, family celebrations, evening functions and special gatherings.",
        "specifications": {
            "product_category": "Habutai Silk Saree",
            "fabric": "Pure Premium Quality Habutai Silk",
            "blouse_fabric": "Banarasi Silk",
            "design": "Vibrant Monochrome with Rich Royal Blouse",
            "color": "Rani Pink / Fuchsia Pink",
            "blouse_color": "Rani Pink",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000175-PHOTO-2026-09-16-17-54-44.jpg",
            "00000176-PHOTO-2026-09-16-17-54-44.jpg"
        ]
    },
    {
        "id": 21,
        "slug": "dusty-onion-pink-habutai-silk-saree",
        "title": "Dusty Onion Pink Habutai Silk Saree with Gaji Silk Blouse",
        "price": 9999,
        "currency": "INR",
        "price_formatted": "₹9,999",
        "category_id": "silk-noorani",
        "category_name": "Silk Noorani",
        "description": "A graceful Dusty Onion Pink saree crafted in pure premium-quality Habutai Silk, paired with a beautifully coordinated Gaji Silk blouse. The saree features a smooth, fluid drape with a soft natural sheen, giving it an understated yet luxurious appeal.\n\nThe muted dusty onion pink hue lends the saree a refined and sophisticated charm, while the textured Gaji silk blouse with delicate woven detailing adds depth and richness to the ensemble. Elegant and versatile, this saree is perfect for weddings, festive occasions, intimate celebrations, day functions and special gatherings.",
        "specifications": {
            "product_category": "Habutai Silk Saree",
            "fabric": "Pure Premium Quality Habutai Silk",
            "blouse_fabric": "Gaji Silk",
            "design": "Soft Pastel Elegance with Woven Gaji Silk Blouse",
            "color": "Dusty Onion Pink",
            "blouse_color": "Dusty Onion Pink with Multicolour Woven Detailing",
            "saree_length": "5.5 Metres",
            "blouse_length": "1 Metre",
            "material_care": "Dry Clean Only",
            "country_of_origin": "India"
        },
        "image_files": [
            "00000181-PHOTO-2026-09-16-17-56-42.jpg",
            "00000182-PHOTO-2026-09-16-17-56-44.jpg"
        ]
    }
]

# Process products and copy images to structured asset paths
products_data = []
all_image_count = 0

for p in products_raw:
    prod_images = []
    prod_dir = os.path.join(ASSETS_DIR, p["slug"])
    os.makedirs(prod_dir, exist_ok=True)
    
    for idx, img_filename in enumerate(p["image_files"]):
        src_img = os.path.join(EXTRACTED_DIR, img_filename)
        dest_filename = f"{p['slug']}-{idx+1}.jpg"
        dest_img = os.path.join(prod_dir, dest_filename)
        
        if os.path.exists(src_img):
            shutil.copy2(src_img, dest_img)
            # Relative paths for web use
            web_path = f"assets/products/{p['slug']}/{dest_filename}"
            prod_images.append({
                "original_filename": img_filename,
                "asset_path": web_path,
                "is_primary": (idx == 0)
            })
            all_image_count += 1
        else:
            print(f"Warning: image {src_img} not found!")
            
    p_copy = dict(p)
    p_copy["images"] = prod_images
    p_copy["primary_image"] = prod_images[0]["asset_path"] if prod_images else None
    del p_copy["image_files"]
    products_data.append(p_copy)

# Master Data Object
master_data = {
    "brand": brand_data,
    "categories": categories_data,
    "products_count": len(products_data),
    "total_images_processed": all_image_count,
    "products": products_data
}

# Write JSON files
with open(os.path.join(DATA_DIR, "site_data.json"), "w", encoding="utf-8") as f:
    json.dump(master_data, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_DIR, "products.json"), "w", encoding="utf-8") as f:
    json.dump(products_data, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_DIR, "brand.json"), "w", encoding="utf-8") as f:
    json.dump(brand_data, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_DIR, "categories.json"), "w", encoding="utf-8") as f:
    json.dump(categories_data, f, indent=2, ensure_ascii=False)

print(f"Successfully processed {len(products_data)} products and {all_image_count} product images into JSON.")
