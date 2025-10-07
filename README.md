# Caffeine ☕ - Professional Coffee Shop Website

A complete, professional coffee shop website with modern design and full e-commerce functionality. Built with HTML, CSS, JavaScript, and Node.js/Express backend with Stripe payment integration.

![Caffeine Coffee Shop](https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200)

## 🌟 Features

### Frontend
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with brown color scheme
- **Advanced Animations**: Scroll-triggered animations, hover effects, and smooth transitions
- **Swipe Gestures**: Touch-enabled swipe gestures for mobile (swipe right to favorite, left to dismiss)
- **Interactive Menu**: Filterable and searchable product catalog
- **Shopping Cart**: Full cart functionality with add/remove/update quantity
- **User Authentication**: Login and registration with multiple options
- **Image Gallery**: Beautiful photo gallery with lightbox functionality
- **Contact Form**: Fully validated contact form with multiple inquiry types
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Backend
- **RESTful API**: Express.js backend with organized route structure
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Payment Processing**: Stripe integration for secure payments
- **Order Management**: Complete order creation and tracking system
- **Data Validation**: Comprehensive input validation and error handling

## 📁 Project Structure

```
Caffeine/
├── index.html              # Homepage
├── menu.html               # Menu page with categories
├── about.html              # About us page
├── contact.html            # Contact page with form
├── gallery.html            # Image gallery
├── login.html              # User login page
├── register.html           # User registration page
├── cart.html               # Shopping cart & checkout
├── css/
│   ├── styles.css          # Main stylesheet (brown theme)
│   └── animations.css      # Advanced animations & effects
├── js/
│   ├── main.js             # Core functionality
│   ├── cart.js             # Shopping cart logic
│   ├── auth.js             # Authentication handling
│   ├── menu.js             # Menu filtering & search
│   ├── gallery.js          # Gallery & lightbox
│   ├── contact.js          # Contact form handling
│   ├── checkout.js         # Checkout & Stripe integration
│   └── animations.js       # Animations & swipe gestures
├── api/
│   ├── server.js           # Express server
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── orders.js       # Order management endpoints
│   │   └── payment.js      # Stripe payment endpoints
│   └── middleware/         # Custom middleware
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Stripe account (for payment processing)
- Modern web browser

### Deployment

**📦 Deploy to Vercel (Recommended)**

See complete deployment guide: **[DEPLOYMENT.md](DEPLOYMENT.md)**

Quick deploy:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables and deploy to production
vercel --prod
```

### Local Installation

1. **Clone or download the project**
   ```bash
   cd Caffeine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   - `JWT_SECRET`: Generate a random string for JWT signing
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

4. **Update Stripe key in frontend**

   Edit `js/checkout.js` and replace the Stripe publishable key:
   ```javascript
   const stripe = Stripe('pk_test_YOUR_ACTUAL_KEY');
   ```

5. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

6. **Serve the frontend**

   Option A - Using Python:
   ```bash
   python -m http.server 8080
   ```

   Option B - Using Node.js:
   ```bash
   npx http-server -p 8080
   ```

   Option C - Using Live Server in VS Code:
   - Install "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

7. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🎨 Design & Color Scheme

The website uses a warm, inviting brown color palette:

- **Primary Brown**: `#6F4E37` - Main brand color
- **Dark Brown**: `#4A332A` - Headers and accents
- **Light Brown**: `#A67C52` - Highlights
- **Cream**: `#F5E6D3` - Backgrounds
- **Gold**: `#D4AF37` - Call-to-action elements

Typography:
- Headings: Playfair Display (serif)
- Body: Lato (sans-serif)

## 💳 Stripe Integration

### Testing Stripe Payments

Use these test card numbers:

**Success**:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Declined**:
- Card: `4000 0000 0000 0002`

### Setting up Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `http://your-domain.com/api/payment/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy webhook signing secret to `.env`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Payments
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment
- `POST /api/payment/refund` - Process refund
- `POST /api/payment/webhook` - Stripe webhook handler

## 📱 Features Breakdown

### Homepage
- Hero section with call-to-action
- Featured products showcase
- Testimonials section
- Values and benefits display

### Menu Page
- Category filtering (Hot Coffee, Iced Coffee, Specialty, Food, Pastries)
- Real-time search functionality
- Add to cart from menu
- Detailed product information

### About Page
- Company origin story
- Mission and values
- Team member profiles
- Community impact statistics
- Awards and recognition

### Contact Page
- Validated contact form
- Multiple inquiry types
- Google Maps integration
- Business hours and location
- FAQ section

### Gallery Page
- Filterable image gallery
- Lightbox for full-size viewing
- Keyboard navigation support
- Instagram feed integration

### Authentication
- Email/password login
- Social login options (Google, Facebook, Apple)
- Password strength indicator
- Remember me functionality
- Form validation

### Shopping Cart
- Add/remove items
- Quantity adjustment
- Promo code support
- Delivery/pickup options
- Real-time price calculation

### Checkout
- Multi-step checkout process
- Stripe card payment
- Order summary review
- Customer information collection
- Order confirmation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- XSS protection
- CSRF token support ready
- Secure payment processing with Stripe

## 🎨 Animations & Gestures

The website includes advanced animations and touch gestures for an engaging user experience:

### Animation Features
- **Scroll-triggered animations**: Elements fade in as you scroll
- **Staggered animations**: Items animate in sequence with delays
- **Hover effects**: Lift, bounce, shake, wiggle, glow, and float
- **Loading states**: Spinners, skeleton loading, progress bars
- **Card flip**: Interactive card flip animations
- **Icon animations**: Pulse, bounce, rotate, float effects
- **Page transitions**: Smooth transitions between pages
- **Parallax scrolling**: Depth effect on scroll

### Touch Gestures (Mobile)
- **Swipe Right →**: Add items to favorites with ❤️ feedback
- **Swipe Left ←**: Dismiss items with 👈 feedback
- **Visual feedback**: Real-time transform and rotation while swiping
- **Indicators**: Emoji indicators on swipe complete

### Demo & Documentation
- **[Live Demo](animations-demo.html)**: See all animations in action
- **[Full Documentation](ANIMATIONS.md)**: Complete guide to animations and gestures
- **Performance optimized**: GPU-accelerated, respects `prefers-reduced-motion`

## ♿ Accessibility

- WCAG 2.1 compliant
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Proper heading hierarchy
- Alt text for images
- Focus indicators
- Skip navigation links

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📈 Future Enhancements

Potential features to add:

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Admin dashboard for order management
- [ ] Email notifications for orders
- [ ] User profile and order history
- [ ] Loyalty rewards program
- [ ] Product reviews and ratings
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA)
- [ ] Push notifications
- [ ] Gift card functionality
- [ ] Subscription service
- [ ] Mobile app (React Native)

## 🛠️ Customization

### Changing Colors

Edit `css/styles.css` and update the CSS variables:

```css
:root {
    --primary-brown: #6F4E37;
    --dark-brown: #4A332A;
    /* ... other colors */
}
```

### Adding Menu Items

Edit the menu page and duplicate product cards:

```html
<article class="menu-item" data-category="hot-coffee">
    <div class="menu-item-image">
        <img src="your-image.jpg" alt="Product name">
    </div>
    <div class="menu-item-content">
        <h3>Product Name</h3>
        <p>Description</p>
        <span class="price">$X.XX</span>
        <button class="btn-add-cart" data-product="Product Name" data-price="X.XX">
            Add to Cart
        </button>
    </div>
</article>
```

### Modifying Content

All content is in the HTML files. Simply edit the text, images, or structure as needed.

## 🐛 Troubleshooting

### Cart not updating
- Check browser console for JavaScript errors
- Ensure localStorage is enabled
- Clear browser cache

### Payment failing
- Verify Stripe keys are correct
- Check Stripe Dashboard for error details
- Ensure test mode is enabled for testing

### Backend not starting
- Verify Node.js version (16+)
- Check if port 3000 is available
- Review `.env` file configuration

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Created with ☕ by Claude Code

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

**Note**: This is a demonstration project. For production use:
1. Add a real database (PostgreSQL, MongoDB, etc.)
2. Implement proper error logging
3. Add rate limiting
4. Use environment-specific configurations
5. Set up proper deployment (AWS, Heroku, Vercel, etc.)
6. Add comprehensive testing
7. Implement proper security headers
8. Use a CDN for static assets
9. Add monitoring and analytics
10. Implement backup and recovery procedures
