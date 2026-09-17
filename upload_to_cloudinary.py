import os
import json
import time
import hashlib
import urllib.request
import urllib.parse
import mimetypes

CLOUD_NAME = "sjl1rfvu"
API_KEY = "278911177331486"
API_SECRET = "7UAdol5iOcqAwazN7GVhYXnOuY8"

UPLOAD_URL = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"

def generate_signature(params, api_secret):
    # Sort params alphabetically by key
    sorted_keys = sorted(params.keys())
    to_sign = "&".join(f"{k}={params[k]}" for k in sorted_keys if params[k] is not None)
    to_sign += api_secret
    return hashlib.sha1(to_sign.encode("utf-8")).hexdigest()

def upload_image(file_path, folder="vitasta", public_id=None):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return None

    timestamp = int(time.time())
    params_to_sign = {
        "folder": folder,
        "timestamp": timestamp
    }
    if public_id:
        params_to_sign["public_id"] = public_id

    signature = generate_signature(params_to_sign, API_SECRET)

    # Read file data
    with open(file_path, "rb") as f:
        file_bytes = f.read()

    filename = os.path.basename(file_path)
    content_type = mimetypes.guess_type(file_path)[0] or "application/octet-stream"

    # Create multipart form data
    boundary = f"----WebKitFormBoundary{int(time.time() * 1000)}"
    body = bytearray()

    fields = {
        "api_key": API_KEY,
        "timestamp": str(timestamp),
        "signature": signature,
        "folder": folder
    }
    if public_id:
        fields["public_id"] = public_id

    for k, v in fields.items():
        body.extend(f"--{boundary}\r\n".encode("utf-8"))
        body.extend(f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode("utf-8"))
        body.extend(f"{v}\r\n".encode("utf-8"))

    # File field
    body.extend(f"--{boundary}\r\n".encode("utf-8"))
    body.extend(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n'.encode("utf-8"))
    body.extend(f"Content-Type: {content_type}\r\n\r\n".encode("utf-8"))
    body.extend(file_bytes)
    body.extend(b"\r\n")
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    req = urllib.request.Request(UPLOAD_URL, data=bytes(body))
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            res_data = json.loads(resp.read().decode("utf-8"))
            secure_url = res_data.get("secure_url")
            print(f"Uploaded: {filename} -> {secure_url}")
            return secure_url
    except Exception as e:
        print(f"Error uploading {file_path}: {e}")
        return None

if __name__ == "__main__":
    # Test with brand banner
    banner_path = os.path.join("assets", "brand", "vitasta_logo_banner.jpg")
    url = upload_image(banner_path, folder="vitasta/brand", public_id="vitasta_logo_banner")
    print("Test upload result:", url)
