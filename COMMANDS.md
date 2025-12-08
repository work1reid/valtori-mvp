# ⚡ QUICK COMMAND REFERENCE

## 🚀 Push to GitHub (Copy-Paste These Commands)

```bash
# 1. Navigate to folder
cd valtori-mvp-deploy

# 2. Initialize git
git init

# 3. Configure git (change to your info)
git config user.email "your.email@example.com"
git config user.name "Your Name"

# 4. Add all files
git add .

# 5. Commit
git commit -m "Initial commit: Valtori MVP"

# 6. Create repo on GitHub (manual step):
#    https://github.com/new
#    Name: valtori-mvp
#    Click "Create repository"

# 7. Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/valtori-mvp.git

# 8. Push
git branch -M main
git push -u origin main
```

---

## 🔑 Vercel Environment Variables (Copy-Paste These)

```
ANTHROPIC_API_KEY
YOUR_ANTHROPIC_API_KEY_HERE

NEXT_PUBLIC_SUPABASE_URL
https://aqzjxlxdjhegypnhsdcp.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
YOUR_SUPABASE_KEY_HERE
```

---

## 📊 Important Links

- **Supabase SQL Editor**: https://supabase.com/dashboard/project/aqzjxlxdjhegypnhsdcp/sql/new
- **Supabase Tables**: https://supabase.com/dashboard/project/aqzjxlxdjhegypnhsdcp/editor
- **GitHub New Repo**: https://github.com/new
- **Vercel Deploy**: https://vercel.com/new
- **Anthropic Console**: https://console.anthropic.com/
