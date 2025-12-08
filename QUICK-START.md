# 🚀 QUICK GITHUB PUSH GUIDE

## Copy these commands exactly (replace YOUR-USERNAME with your GitHub username)

### STEP 1: Navigate to project
```bash
cd ~/Desktop/valtori-mvp-deploy
```

### STEP 2: Rename main file
```bash
mv valtori-sales-simulator.html index.html
```

### STEP 3: Initialize Git (if needed)
```bash
git init
```

### STEP 4: Add all files
```bash
git add .
```

### STEP 5: Commit
```bash
git commit -m "Initial commit: Valtori AI MVP v0.1.0"
```

### STEP 6: Add remote (CHANGE YOUR-USERNAME!)
```bash
git remote add origin https://github.com/YOUR-USERNAME/valtori-ai.git
```

### STEP 7: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

---

## ✅ WHAT TO DO NEXT

1. **Go to GitHub.com**
2. **Create new repository** called "valtori-ai"
3. **Run commands above** in terminal
4. **Enable GitHub Pages** in repo settings
5. **Visit** `https://YOUR-USERNAME.github.io/valtori-ai/`

---

## 🐛 IF YOU GET ERRORS

### "Permission denied"
You need to authenticate with GitHub:
- Use personal access token as password
- Or set up SSH keys
- See: https://docs.github.com/en/authentication

### "Remote origin already exists"
Remove it first:
```bash
git remote remove origin
# Then try step 6 again
```

### "Branch main doesn't exist"
Use master instead:
```bash
git branch -M main
git push -u origin main
```

---

## 📱 AFTER PUSHING

1. **Check GitHub** - Files should be visible
2. **Enable Pages** - Settings → Pages → Source: main → Save
3. **Wait 2-5 minutes** for deployment
4. **Test live site** - Visit the URL
5. **Share!** 🎉
