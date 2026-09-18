import re

with open('root_content.html', 'r', encoding='utf-8') as f:
    html = f.read()

print(f"Root HTML size: {len(html)}")

# Find sections with ids
ids = re.findall(r'id=["\']([^"\']+)["\']', html)
print("All element IDs:", ids)

# Find all headings
headings = re.findall(r'<h([1-6])[^>]*>(.*?)</h\1>', html, re.DOTALL)
print(f"\nHeadings count: {len(headings)}")
for level, h in headings:
    cleaned = re.sub(r'<[^>]+>', ' ', h)
    cleaned = ' '.join(cleaned.split())
    print(f"  H{level}: {cleaned}")

# Find all buttons
buttons = re.findall(r'<button[^>]*>(.*?)</button>', html, re.DOTALL)
print(f"\nButtons count: {len(buttons)}")
for b in buttons:
    cleaned = re.sub(r'<[^>]+>', ' ', b)
    cleaned = ' '.join(cleaned.split())
    if cleaned:
        print(f"  Button: {cleaned}")

# Find all links
links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
print(f"\nLinks count: {len(links)}")
for href, text in links:
    cleaned = re.sub(r'<[^>]+>', ' ', text)
    cleaned = ' '.join(cleaned.split())
    print(f"  Link ({href}): {cleaned}")
