import re

with open('exact_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("HTML length:", len(html))

# Stylesheet links
links = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', html)
for l in links:
    print("Link:", l)

# Style tags
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
print(f"Style tags count: {len(styles)}, Total style length: {sum(len(s) for s in styles)}")

# Save all CSS to a combined file
with open('extracted_styles.css', 'w', encoding='utf-8') as f_out:
    for i, s in enumerate(styles):
        f_out.write(f"/* STYLE BLOCK {i+1} */\n{s}\n\n")
print("Saved extracted_styles.css")

# Check if there is a main container or root
root_match = re.search(r'<div id="root"[^>]*>(.*?)</div>\s*<script', html, re.DOTALL)
if root_match:
    print("Found #root innerHTML length:", len(root_match.group(1)))
    with open('root_content.html', 'w', encoding='utf-8') as f_root:
        f_root.write(root_match.group(1))

# Check script tags
scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\'][^>]*>', html)
print("External scripts:", scripts)
