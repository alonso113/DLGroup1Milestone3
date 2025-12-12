# Git LFS Setup for Team Members

## What is Git LFS?

Git Large File Storage (LFS) is used to store our trained ML model (`bestmodel_3_run5.pt`, ~250MB) efficiently. Without it, the model won't download correctly.

## Installation

### Windows

**Option 1: Download Installer**
1. Go to https://git-lfs.github.com/
2. Download the Windows installer
3. Run the installer
4. Open PowerShell/Command Prompt and run: `git lfs install`

**Option 2: Chocolatey**
```bash
choco install git-lfs
git lfs install
```

### Mac

```bash
brew install git-lfs
git lfs install
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install git-lfs
git lfs install
```

## Clone Repository (First Time)

If Git LFS is installed **BEFORE** cloning:

```bash
git clone https://github.com/alonso113/DLGroup1Milestone3.git
cd DLGroup1Milestone3
```

The model will automatically download! ✅

## Already Cloned Without Git LFS?

If you cloned the repo before installing Git LFS:

```bash
# 1. Install Git LFS (see above)

# 2. In your repo folder:
cd DLGroup1Milestone3
git lfs install
git lfs pull

# 3. Verify the model downloaded
ls -lh backend/ml/bestmodel_3_run5.pt
# Should show ~250MB
```

## Troubleshooting

### Model file is only 130 bytes

**Problem:** The file is a pointer, not the actual model.

**Solution:**
```bash
git lfs install
git lfs pull
```

### "git lfs: command not found"

**Problem:** Git LFS is not installed.

**Solution:** Install Git LFS (see Installation section above)

### "Error downloading object"

**Problem:** Network issues or GitHub LFS quota.

**Solution:**
1. Check your internet connection
2. Try again: `git lfs fetch --all`
3. If persistent, contact the repo owner

### Verify Installation

```bash
# Check if Git LFS is installed
git lfs version
# Should output: git-lfs/3.x.x

# Check if model is tracked
git lfs ls-files
# Should show: bestmodel_3_run5.pt

# Check model size
ls -lh backend/ml/bestmodel_3_run5.pt
# Should be ~250MB, NOT 130 bytes
```

## For Future Commits

If you modify the model file:

```bash
# Git LFS will automatically handle it
git add backend/ml/bestmodel_3_run5.pt
git commit -m "Update model"
git push
```

No special commands needed! Git LFS works automatically once set up.

## Why We Use Git LFS

- ✅ GitHub limits files to 100MB
- ✅ Our model is ~250MB
- ✅ Git LFS stores large files efficiently
- ✅ Git repo stays small and fast
- ✅ Team members get the model automatically

---

**Questions?** Ask in the team Discord/Slack!
