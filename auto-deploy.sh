#!/bin/bash

# 🚀 Gupta Traders - Auto Deployment Script
# This script automates the entire deployment process

echo "🎯 Gupta Traders - Auto Deployment Script"
echo "=========================================="
echo ""

# Check if required tools are installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ All required tools are installed!"
echo ""

# Step 1: Build the application
echo "📦 Step 1: Building the application..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Application built successfully!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🎉 Build completed successfully!"
echo ""

# Step 2: Create deployment info file
echo "📋 Step 2: Creating deployment information..."
cat > DEPLOYMENT-INFO.txt << EOF
🎯 Gupta Traders - Deployment Information
==========================================

📅 Deployment Date: $(date)
🌐 Application URL: Will be provided by Vercel after deployment

📋 What You Need to Do:
=====================

1. Create Supabase Account:
   - Go to: https://supabase.com
   - Sign up with Google
   - Create new project: "gupta-traders-inventory"

2. Setup Database:
   - Go to SQL Editor in Supabase
   - Copy and run the SQL from DEPLOYMENT-GUIDE.md

3. Get Your Keys:
   - Go to Settings → API in Supabase
   - Copy Project URL and anon key

4. Deploy to Vercel:
   - Go to: https://vercel.com
   - Import this repository
   - Add environment variables:
     * NEXT_PUBLIC_SUPABASE_URL = (your Supabase URL)
     * NEXT_PUBLIC_SUPABASE_ANON_KEY = (your Supabase anon key)

5. Enable Real-time:
   - Go to Database → Replication in Supabase
   - Enable Realtime for both tables

📱 Your App Will Be Available At:
   https://your-app-name.vercel.app

🆘 Need Help?
   - Check DEPLOYMENT-GUIDE.md for detailed instructions
   - Each step has screenshots and examples

EOF

echo "✅ Deployment information created in DEPLOYMENT-INFO.txt!"
echo ""

# Step 3: Create a simple setup script for the user
echo "🔧 Step 3: Creating user setup script..."
cat > setup-for-user.sh << 'EOF'
#!/bin/bash

echo "🎯 Gupta Traders - Quick Setup for Non-Technical Users"
echo "======================================================="
echo ""
echo "This script will guide you through the setup process."
echo "Please follow each step carefully."
echo ""

echo "📋 STEP 1: Create Supabase Account"
echo "====================================="
echo "1. Open your web browser"
echo "2. Go to: https://supabase.com"
echo "3. Click 'Sign up with Google'"
echo "4. Verify your email if asked"
echo "5. Click 'New Project'"
echo "6. Organization name: gupta-traders"
echo "7. Project name: inventory-system"
echo "8. Create a password and save it"
echo "9. Choose your region"
echo "10. Click 'Create new project'"
echo "11. Wait 2-3 minutes for project to be ready"
echo ""
echo "Press Enter when you're ready for Step 2..."
read

echo ""
echo "📋 STEP 2: Setup Database"
echo "=========================="
echo "1. In Supabase, click 'SQL Editor' in the left menu"
echo "2. Click 'New query'"
echo "3. Copy the entire SQL script from DEPLOYMENT-GUIDE.md"
echo "4. Paste it into the editor"
echo "5. Click 'Run'"
echo "6. Wait for 'Success' message"
echo ""
echo "Press Enter when you're ready for Step 3..."
read

echo ""
echo "📋 STEP 3: Get Your Keys"
echo "========================"
echo "1. Click 'Settings' (gear icon) in left menu"
echo "2. Click 'API' in the submenu"
echo "3. Copy the 'Project URL'"
echo "4. Copy the 'anon public' key"
echo "5. Save both keys somewhere safe"
echo ""
echo "Press Enter when you're ready for Step 4..."
read

echo ""
echo "📋 STEP 4: Deploy to Vercel"
echo "=========================="
echo "1. Go to: https://vercel.com"
echo "2. Click 'Sign up with Google'"
echo "3. Click 'New Project'"
echo "4. Click 'Import Git Repository'"
echo "5. Click 'Connect to GitHub'"
echo "6. Click 'Add' on the inventory-pro repository"
echo "7. Add environment variables:"
echo "   - Name: NEXT_PUBLIC_SUPABASE_URL"
echo "   - Value: (paste your Project URL)"
echo "   - Name: NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - Value: (paste your anon key)"
echo "8. Click 'Deploy'"
echo "9. Wait 2-3 minutes"
echo ""
echo "Press Enter when you're ready for Step 5..."
read

echo ""
echo "📋 STEP 5: Enable Real-time"
echo "=========================="
echo "1. Go back to your Supabase project"
echo "2. Click 'Database' in left menu"
echo "3. Click 'Replication' in submenu"
echo "4. Toggle 'Enable Realtime' for both tables"
echo "5. Click 'Save'"
echo ""
echo "🎉 CONGRATULATIONS! Your app is now live!"
echo ""
echo "Your app URL will be shown in your Vercel dashboard."
echo "You can access it from any device - phone, tablet, or computer!"
echo ""

EOF

chmod +x setup-for-user.sh
echo "✅ User setup script created: setup-for-user.sh!"
echo ""

echo "🎉 Auto-deployment preparation completed!"
echo ""
echo "📋 What you have now:"
echo "===================="
echo "✅ Built application ready for deployment"
echo "✅ DEPLOYMENT-GUIDE.md - Step-by-step instructions with screenshots"
echo "✅ DEPLOYMENT-INFO.txt - Quick reference guide"
echo "✅ setup-for-user.sh - Interactive setup script"
echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Share these files with the shop owner"
echo "2. They can follow DEPLOYMENT-GUIDE.md for detailed instructions"
echo "3. Or run setup-for-user.sh for interactive guidance"
echo "4. The app will be live in under 15 minutes!"
echo ""
echo "📱 The shop owner will be able to:"
echo "- Access the app from any device"
echo "- Manage inventory in real-time"
echo "- Process sales from phone or tablet"
echo "- View business analytics"
echo "- All data syncs automatically!"
echo ""
echo "🎯 Perfect for non-technical users!"
