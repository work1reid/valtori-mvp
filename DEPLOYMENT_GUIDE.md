# 🚀 VALTORI MVP - DEPLOYMENT INSTRUCTIONS

## 📁 YOUR PROJECT IS READY!

This folder contains everything you need to deploy Valtori MVP.

---

## 🎯 STEP 1: SETUP SUPABASE DATABASE (3 minutes)

### Copy & Run This SQL:

1. Go to: https://supabase.com/dashboard/project/aqzjxlxdjhegypnhsdcp/sql/new

2. Copy the contents of `supabase/schema.sql` or copy this:

```sql
CREATE TABLE IF NOT EXISTS calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    duration INTEGER NOT NULL,
    call_state VARCHAR(20) NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    conversation JSONB NOT NULL,
    feedback JSONB,
    user_id UUID
);

CREATE INDEX IF NOT EXISTS calls_created_at_idx ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS calls_user_id_idx ON calls(user_id);
CREATE INDEX IF NOT EXISTS calls_score_idx ON calls(score);

ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for now" ON calls
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE OR REPLACE VIEW call_analytics AS
SELECT 
    DATE(created_at) as call_date,
    COUNT(*) as total_calls,
    ROUND(AVG(score)::numeric, 2) as avg_score,
    ROUND(AVG(duration)::numeric, 2) as avg_duration,
    MAX(score) as highest_score,
    MIN(score) as lowest_score
FROM calls
WHERE score IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY call_date DESC;

GRANT SELECT ON call_analytics TO anon, authenticated;
```

3. Click **RUN** (or Cmd/Ctrl + Enter)

4. ✅ You should see: "Success. No rows returned"

---

## 🎯 STEP 2: PUSH TO GITHUB (5 minutes)

### Commands to Run:

```bash
# 1. Navigate to this folder
cd valtori-mvp-deploy

# 2. Initialize git
git init

# 3. Configure git (use your email and name)
git config user.email "your.email@example.com"
git config user.name "Your Name"

# 4. Add all files
git add .

# 5. Create first commit
git commit -m "Initial commit: Valtori MVP - AI sales training app"

# 6. Create repo on GitHub:
#    Go to: https://github.com/new
#    Name: valtori-mvp
#    Don't initialize with anything
#    Click "Create repository"

# 7. Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/valtori-mvp.git

# 8. Push to GitHub
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🎯 STEP 3: DEPLOY TO VERCEL (5 minutes)

### Deploy Steps:

1. **Go to**: https://vercel.com/new

2. **Import** your GitHub repository `valtori-mvp`

3. **Add Environment Variables** (click "Environment Variables"):

   **Variable 1:**
   ```
   Name: ANTHROPIC_API_KEY
   Value: YOUR_ANTHROPIC_API_KEY_HERE
   ```

   **Variable 2:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://aqzjxlxdjhegypnhsdcp.supabase.co
   ```

   **Variable 3:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: YOUR_SUPABASE_KEY_HERE
   ```

4. **Click "Deploy"**

5. **Wait 2-3 minutes** ☕

6. ✅ Done! Your app is live!

---

## 🎯 STEP 4: TEST YOUR APP (2 minutes)

When Vercel deployment finishes:

1. ✅ Click the deployment URL (e.g., `https://valtori-mvp.vercel.app`)
2. ✅ Click "Start Call"
3. ✅ Allow microphone access when prompted
4. ✅ Speak to Alex (the AI customer)
5. ✅ End the call
6. ✅ Check your score and feedback
7. ✅ Verify it saved in Supabase: https://supabase.com/dashboard/project/aqzjxlxdjhegypnhsdcp/editor

---

## 📊 MONITORING

### View Call History
- Supabase Dashboard: https://supabase.com/dashboard/project/aqzjxlxdjhegypnhsdcp/editor
- Click "calls" table to see all recordings

### Check API Usage
- Anthropic Console: https://console.anthropic.com/settings/usage

### Monitor Deployments
- Vercel Dashboard: https://vercel.com/dashboard

---

## 🐛 TROUBLESHOOTING

### Microphone doesn't work
- ✅ Make sure you're using **HTTPS** (Vercel auto-enables this)
- ✅ Use **Chrome or Edge** browser (best compatibility)
- ✅ Check browser settings: Site Settings → Microphone → Allow

### AI doesn't respond
- ✅ Check Vercel logs: Project → Deployments → Latest → Logs
- ✅ Verify environment variables are set correctly
- ✅ Open browser console (F12) and check for errors

### Database not saving
- ✅ Confirm you ran the SQL schema in Supabase
- ✅ Check Supabase logs in dashboard
- ✅ Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct

---

## 🎉 YOU'RE DONE!

Your Valtori MVP is now:
- ✅ Secured (API key hidden in backend)
- ✅ Deployed to Vercel (live on the internet)
- ✅ Saving to Supabase (persistent call history)
- ✅ Ready for users to test

---

## 📞 SUPPORT

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Anthropic API**: https://docs.anthropic.com

Good luck! 🚀
