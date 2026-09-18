import re

# Load root_content.html
with open('root_content.html', 'r', encoding='utf-8') as f:
    root_html = f.read()

# Strip data-replit-metadata
clean_html = re.sub(r'\s*data-replit-metadata="[^"]*"', '', root_html)

# Also ensure UTF-8 characters are clean (e.g. quote marks, dots)
# Check quote marks
clean_html = clean_html.replace('“', '&ldquo;').replace('”', '&rdquo;').replace('’', '&rsquo;').replace('—', '&mdash;')

print("Clean HTML length:", len(clean_html))
with open('clean_root_fixed.html', 'w', encoding='utf-8') as f:
    f.write(clean_html)
print("Saved clean_root_fixed.html")
