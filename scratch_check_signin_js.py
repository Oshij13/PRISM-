import re

file_path = 'd:\\Product Management BITSoM\\Capstone Project Guideline\\PRISM\\SigninView.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for keywords like 'password', 'login', 'sha256', 'hash'
keywords = ['password', 'sha256', 'hash', 'sha-256', 'crypto', 'digest']

print("Searching SigninView.js for keywords...")
for kw in keywords:
    matches = [m.start() for m in re.finditer(kw, content, re.IGNORECASE)]
    print(f"Keyword '{kw}': found {len(matches)} matches.")
    for idx, pos in enumerate(matches[:10]):
        start = max(0, pos - 100)
        end = min(len(content), pos + 100)
        print(f"  Match {idx + 1} at position {pos}:")
        print(f"    ...{repr(content[start:end])}...")
