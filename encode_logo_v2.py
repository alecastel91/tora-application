import os
import base64

# Use the COPY directory as confirmed by lsof
base_path = '/Users/themac/Documents/tora-landing-page copy'
# We have logo_original.png or logo_v2.png. Let's use logo_v2.png since we copied it.
# Actually, wait, previous command failed to move it. Let's use logo_original.png if it exists, or check.
logo_path = os.path.join(base_path, 'public/logo_original.png')

if not os.path.exists(logo_path):
    # Fallback to verify if maybe v2 exists
    logo_path = os.path.join(base_path, 'public/logo_v2.png')

if not os.path.exists(logo_path):
    print(f"Error: Logo file not found at {logo_path}")
    exit(1)

with open(logo_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

# Write to a file first to be safe
with open(os.path.join(base_path, 'public/logo_base64_fresh.txt'), 'w') as f:
    f.write(encoded_string)
    
print(f"Successfully encoded {logo_path} to base64.")
