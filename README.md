# Gupta Traders - Inventory Management System

A complete, modern inventory and sales management system built for Gupta Traders to manage products, process sales, and track business performance.

## 🚀 **Live Demo**

**Deploy your application here:** [Your Live URL will appear after deployment]

## ✨ **Features**

### 🔐 **Authentication**
- Email/Password sign-in and sign-up
- Google Sign-In integration
- Secure user sessions
- Protected routes

### 📊 **Dashboard**
- Real-time business statistics
- Today's revenue and profit tracking
- 7-day sales performance charts
- Low stock alerts
- Quick action buttons

### 📦 **Inventory Management**
- View all products in sortable table
- **Inline stock editing** - click stock numbers to edit instantly
- Add new products with validation
- Delete items with confirmation
- Stock status badges (In Stock, Low Stock, Out of Stock)
- Search and filter functionality

### 💳 **Point of Sale (POS)**
- Modern product grid interface
- Shopping cart with quantity management
- Real-time stock checking
- Mobile-responsive cart drawer
- Atomic checkout process

### 📈 **Analytics & Reports**
- Time-based filtering (Today, 7 days, 30 days, All time)
- Revenue and profit tracking
- Top products by revenue and units sold
- Interactive charts
- Sales data management

### 🎨 **Design**
- Dark purple theme inspired by byhook.com
- Responsive design for all devices
- Modern UI with sharp borders
- Space Grotesk + Inter fonts

## 🛠 **Technology Stack**

- **Frontend:** Next.js 14 with TypeScript
- **UI:** ShadCN UI + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Charts:** Chart.js
- **Icons:** Lucide React

## 🚀 **Quick Deploy to Vercel (Recommended)**

### **Step 1: Supabase Setup**
1. Go to [Supabase](https://supabase.com)
2. Click "Start your project" → Create new organization
3. Create new project: "gupta-traders-inventory"
4. Wait for project to be ready (2-3 minutes)

### **Step 2: Create Database Tables**
Go to Supabase → SQL Editor → Run these queries:

```sql
-- Create inventory_items table
CREATE TABLE inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  stock_level INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  last_sold_date TIMESTAMP,
  user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sales table
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  profit DECIMAL(10,2) NOT NULL,
  date TIMESTAMP NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own inventory items" ON inventory_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory items" ON inventory_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory items" ON inventory_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory items" ON inventory_items
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sales" ON sales
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sales" ON sales
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales" ON sales
  FOR DELETE USING (auth.uid() = user_id);
```

### **Step 3: Setup Authentication**
1. Go to Supabase → Authentication → Settings
2. Enable "Email" provider
3. Enable "Google" provider (optional)
4. Add your site URL to "Site URL" and "Redirect URLs"

### **Step 4: Get Supabase Keys**
1. Go to Supabase → Project Settings → API
2. Copy the Project URL and anon public key

### **Step 5: Deploy to Vercel**
1. Push this code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Add environment variables in Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
5. Deploy! 🎉

### **Step 6: Setup Real-time**
1. Go to Supabase → Database → Replication
2. Enable "Realtime" for both tables
3. Your app will now sync instantly across all devices!

## 📱 **How to Use**

1. **Sign up** for a new account
2. **Add products** to your inventory
3. **Process sales** through the POS system
4. **View analytics** to track performance
5. **Manage stock** with real-time updates

## 🌟 **Key Benefits for Gupta Traders**

- **Real-time synchronization** - Instant updates across phone, tablet, computer
- **Fast performance** - Optimized for low user count
- **Professional POS system** - Fast checkout process
- **Business insights** - Track revenue and profit
- **Mobile friendly** - Manage from anywhere
- **Secure data** - Each user sees only their data
- **Easy to use** - Intuitive interface
- **Free hosting** - Supabase + Vercel free tiers

## 📞 **Support**

For support or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Create an issue in this repository

---

**Built with ❤️ for Gupta Traders**
