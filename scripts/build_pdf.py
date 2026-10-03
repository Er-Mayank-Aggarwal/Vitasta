import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

def build_pdf():
    project_root = Path(__file__).resolve().parent.parent
    html_file = project_root / "Vitasta_Production_Setup_Guide.html"
    pdf_file = project_root / "Vitasta_Production_Setup_Guide.pdf"

    if not html_file.exists():
        print(f"Error: {html_file} does not exist.")
        sys.exit(1)

    print(f"Converting {html_file.name} to {pdf_file.name}...")
    
    with sync_playwright() as p:
        chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        if not os.path.exists(chrome_path):
            chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
            
        browser = p.chromium.launch(
            executable_path=chrome_path,
            headless=True,
            args=["--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox"]
        )
        page = browser.new_page()
        
        # Navigate to local file URL
        page.goto(html_file.as_uri(), wait_until="networkidle")
        page.wait_for_timeout(2000)  # Ensure Google Fonts & Cloudinary images finish rendering
        
        page.pdf(
            path=str(pdf_file),
            format="A4",
            print_background=True,
            margin={
                "top": "0px",
                "bottom": "0px",
                "left": "0px",
                "right": "0px"
            },
            prefer_css_page_size=True
        )
        browser.close()
        
    size_kb = os.path.getsize(pdf_file) / 1024
    print(f"[SUCCESS] Successfully built {pdf_file.name} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    build_pdf()
