import json
import re

with open('replit_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("HTML size:", len(html))

title_match = re.search(r'<title>(.*?)</title>', html, re.DOTALL | re.IGNORECASE)
if title_match:
    print("Page Title:", title_match.group(1))

# Find script __NEXT_DATA__
match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
if match:
    data = json.loads(match.group(1))
    print("Next data page:", data.get('page'))
    with open('next_data.json', 'w', encoding='utf-8') as out:
        json.dump(data, out, indent=2)
    print("Saved next_data.json")

# Find any visible text in body
text_without_scripts = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html, flags=re.DOTALL | re.IGNORECASE)
text_clean = re.sub(r'<[^>]+>', ' ', text_without_scripts)
text_clean = ' '.join(text_clean.split())
print("Text sample (first 1500 chars):")
print(text_clean[:1500])
