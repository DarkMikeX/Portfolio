"""Fix .env file - combine split Stripe keys into single lines"""
import re
from pathlib import Path

env_file = Path(__file__).parent / '.env'

if not env_file.exists():
    print("No .env file found")
    exit(1)

# Read the file
content = env_file.read_text()

# Fix STRIPE_SECRET_KEY - combine split lines
stripe_secret_pattern = r'STRIPE_SECRET_KEY=sk_test_([^\n]+)\s*\n\s*([^\n]+)'
stripe_secret_match = re.search(stripe_secret_pattern, content)
if stripe_secret_match:
    combined_key = f"STRIPE_SECRET_KEY=sk_test_{stripe_secret_match.group(1)}{stripe_secret_match.group(2)}"
    content = re.sub(stripe_secret_pattern, combined_key, content)
    print("Fixed STRIPE_SECRET_KEY")

# Fix STRIPE_PUBLISHABLE_KEY - combine split lines
stripe_pub_pattern = r'STRIPE_PUBLISHABLE_KEY=pk_test_([^\n]+)\s*\n\s*([^\n]+)'
stripe_pub_match = re.search(stripe_pub_pattern, content)
if stripe_pub_match:
    combined_key = f"STRIPE_PUBLISHABLE_KEY=pk_test_{stripe_pub_match.group(1)}{stripe_pub_match.group(2)}"
    content = re.sub(stripe_pub_pattern, combined_key, content)
    print("Fixed STRIPE_PUBLISHABLE_KEY")

# Remove duplicate MONGO_URL if exists
lines = content.split('\n')
seen = set()
new_lines = []
for line in lines:
    if line.startswith('MONGO_URL='):
        if 'MONGO_URL' not in seen:
            seen.add('MONGO_URL')
            new_lines.append(line)
    else:
        new_lines.append(line)
content = '\n'.join(new_lines)

# Write back
env_file.write_text(content)
print("SUCCESS: .env file fixed! Please restart your backend server.")
