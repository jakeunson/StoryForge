import os
import subprocess
import shutil

def run_cmd(cmd):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True)

# 1. Move everything from frontend to root
frontend_items = os.listdir('frontend')
for item in frontend_items:
    # Use git mv for version-controlled files
    src = f"frontend/{item}"
    dest = f"{item}"
    if item == "dist" or item == "node_modules":
        continue
    # If the file exists in root (like .gitignore), we need to handle it.
    if os.path.exists(dest):
        if item == ".gitignore":
            # merge gitignores
            with open(dest, "a") as f1, open(src, "r") as f2:
                f1.write("\n" + f2.read())
            run_cmd(f"git rm -f {src}")
            continue
    run_cmd(f'git mv "{src}" "{dest}"')

# 2. Move backend/app to api/
# Make sure api folder exists
if not os.path.exists('api'):
    os.makedirs('api')

backend_app_items = os.listdir('backend/app')
for item in backend_app_items:
    src = f"backend/app/{item}"
    dest = f"api/{item}"
    if item == "__pycache__":
        continue
    if os.path.exists(dest):
        run_cmd(f'git rm -f "{dest}"')
    run_cmd(f'git mv "{src}" "{dest}"')

# 3. Move backend/requirements.txt to root
if os.path.exists('backend/requirements.txt'):
    run_cmd('git mv backend/requirements.txt requirements.txt')

# 4. Remove empty directories
run_cmd('git rm -r frontend')
run_cmd('git rm -r backend')

print("Restructure complete!")
