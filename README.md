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
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Charts:** Chart.js
- **Icons:** Lucide React

## 🚀 **Quick Deploy to Vercel (Recommended)**

### **Step 1: Firebase Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "gupta-traders-inventory"
3. Enable Authentication → Sign-in method → Enable Email/Password + Google
4. Create Firestore Database
5. Copy your Firebase config

### **Step 2: Deploy to Vercel**
1. Push this code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Add environment variables in Vercel:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```
5. Deploy! 🎉

### **Step 3: Firestore Security Rules**
Add these rules in Firebase Console → Firestore → Rules:
```javascript
rules firestore {
  match /databases/{database}/documents {
    match /inventoryItems/{itemId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    match /sales/{saleId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 📱 **How to Use**

1. **Sign up** for a new account
2. **Add products** to your inventory
3. **Process sales** through the POS system
4. **View analytics** to track performance
5. **Manage stock** with real-time updates

## 🌟 **Key Benefits for Gupta Traders**

- **Real-time inventory tracking** - Never run out of stock
- **Professional POS system** - Fast checkout process
- **Business insights** - Track revenue and profit
- **Mobile friendly** - Manage from anywhere
- **Secure data** - Each user sees only their data
- **Easy to use** - Intuitive interface

## 📞 **Support**

For support or questions:
- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
- Create an issue in this repository

---

**Built with ❤️ for Gupta Traders**
