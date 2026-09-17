import os
import json
import time
import hashlib
import urllib.request
import urllib.parse
import mimetypes
import concurrent.futures

CLOUD_NAME = "sjl1rfvu"
API_KEY = "278911177331486"
API_SECRET = "7UAdol5iOcqAwazN7GVhYXnOuY8"

UPLOAD_URL = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"
MAPPING_FILE = "data/cdn_mapping.json"

def generate_signature(params, api_secret):
    sorted_keys = sorted(params.keys())
    to_sign = "&".join(f"{k}={params[k]}" for k in sorted_keys if params[k] is not None)
    to_sign += api_secret
    return hashlib.sha1(to_sign.encode("utf-8")).hexdigest()

def upload_single_file(file_path, folder="vitasta"):
    if not os.path.exists(file_path):
        print(f"File missing: {file_path}")
        return file_path, None

    timestamp = int(time.time())
    params_to_sign = {
        "folder": folder,
        "timestamp": timestamp
    }
    signature = generate_signature(params_to_sign, API_SECRET)

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    filename = os.path.basename(file_path)
    content_type = mimetypes.guess_type(file_path)[0] or "application/octet-stream"
    boundary = f"----WebKitFormBoundary{int(time.time() * 1000)}"
    body = bytearray()

    fields = {
        "api_key": API_KEY,
        "timestamp": str(timestamp),
        "signature": signature,
        "folder": folder
    }

    for k, v in fields.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode("utf-8"))
        body.extend(f"{v}\r\n".encode("utf-8"))

    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(UPLOAD_URL, data=bytes(body))
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                secure_url = res_data.get("secure_url")
                print(f"[SUCCESS] {file_path} -> {secure_url}")
                return file_path, secure_url
        except Exception as e:
            print(f"[RETRY {attempt+1}] {file_path}: {e}")
            time.sleep(1.5)

    print(f"[FAILED] Could not upload {file_path}")
    return file_path, None

def main():
    # Load existing mapping if any
    mapping = {}
    if os.path.exists(MAPPING_FILE):
        try:
            with open(MAPPING_FILE, "r", encoding="utf-8") as f:
                mapping = json.load(f)
        except Exception:
            mapping = {}

    # Gather all images in assets
    all_files = []
    for root, _, files in os.walk("assets"):
        for file in files:
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                normalized_path = os.path.normpath(os.path.join(root, file)).replace("\\", "/")
                all_files.append(normalized_path)

    print(f"Found {len(all_files)} total image assets.")
    files_to_upload = [f for f in all_files if f not in mapping]
    print(f"{len(files_to_upload)} images need uploading.")

    # Upload in parallel batches
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_file = {
            executor.submit(
                upload_single_file,
                fpath,
                "vitasta/brand" if "brand" in fpath else f"vitasta/products/{fpath.split('/')[2]}" if len(fpath.split('/')) > 2 else "vitasta/products"
            ): fpath for fpath in files_to_upload
        }
        for future in concurrent.futures.as_completed(future_to_file):
            fpath, url = future.result()
            if url:
                mapping[fpath] = url

    # Save mapping
    os.makedirs("data", exist_ok=True)
    with open(MAPPING_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    print(f"Saved CDN mapping to {MAPPING_FILE} ({len(mapping)} images mapped)")

    # Update products.json
    products_path = "data/products.json"
    if os.path.exists(products_path):
        with open(products_path, "r", encoding="utf-8") as f:
            products = json.load(f)

        for p in products:
            orig_prim = p.get("primary_image", "")
            if isinstance(orig_prim, str) and orig_prim:
                norm_prim = orig_prim.replace("\\", "/")
                if norm_prim in mapping:
                    p["primary_image"] = mapping[norm_prim]
            
            for img_item in p.get("images", []):
                if isinstance(img_item, dict):
                    raw_p = img_item.get("asset_path", "")
                    norm_p = raw_p.replace("\\", "/")
                    if norm_p in mapping:
                        cdn_link = mapping[norm_p]
                        img_item["asset_path"] = cdn_link
                        img_item["cdn_url"] = cdn_link
                        if img_item.get("is_primary") and not p.get("primary_image"):
                            p["primary_image"] = cdn_link
                elif isinstance(img_item, str):
                    norm_p = img_item.replace("\\", "/")
                    if norm_p in mapping:
                        img_item = mapping[norm_p]

        with open(products_path, "w", encoding="utf-8") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print("Updated data/products.json with Cloudinary CDN URLs.")

    # Update brand.json
    brand_path = "data/brand.json"
    if os.path.exists(brand_path):
        with open(brand_path, "r", encoding="utf-8") as f:
            brand = json.load(f)

        banner_key = "assets/brand/vitasta_logo_banner.jpg"
        if banner_key in mapping:
            if "hero" in brand:
                brand["hero"]["banner_image"] = mapping[banner_key]
            if "logo" in brand:
                brand["logo"]["image_path"] = mapping[banner_key]

        with open(brand_path, "w", encoding="utf-8") as f:
            json.dump(brand, f, indent=2, ensure_ascii=False)
        print("Updated data/brand.json with Cloudinary CDN URLs.")

    # Update categories.json
    categories_path = "data/categories.json"
    categories = []
    if os.path.exists(categories_path):
        with open(categories_path, "r", encoding="utf-8") as f:
            categories = json.load(f)

    # Re-generate js/data.js
    with open(products_path, "r", encoding="utf-8") as f:
        products = json.load(f)
    with open(brand_path, "r", encoding="utf-8") as f:
        brand = json.load(f)

    vitasta_data = {
        "brand": brand,
        "categories": categories,
        "products": products,
        "stats": {
            "total_sarees": len(products),
            "total_collections": len(categories),
            "price_range": "₹8,000 – ₹25,500",
            "dispatch_timeline": "10-12 business days (Made to Order)",
            "origin": "Jodhpur, Rajasthan, India",
            "cdn_provider": "Cloudinary (Global CDN)"
        }
    }

    js_content = f"""// Vitasta Saree Catalog & Brand Data (Served via Cloudinary Global CDN)
window.VITASTA_DATA = {json.dumps(vitasta_data, indent=2, ensure_ascii=False)};
"""
    with open("js/data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    print("Updated js/data.js with complete Cloudinary CDN URLs.")

if __name__ == "__main__":
    main()
