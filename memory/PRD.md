# Diesel Media - PRD

## Original Problem Statement
Build a videography landing page and scheduling system for "Diesel Media".
- Phone: 541-844-8263
- Email: shelovexo9898@gmail.com
- Instagram: @diesel_media25
- TikTok: @diesel.media2

## User Choices
- Dark/cinematic theme
- Online appointment booking
- Admin dashboard to view bookings (no email/SMS notifications)
- All videography services (weddings, events, commercials, social media, real estate)
- Portfolio/gallery section
- Social media links integrated
- No payment integration

## User Personas
1. **Client** - Potential customers looking to book videography services
2. **Admin** - Business owner managing bookings and inquiries

## Core Requirements
- [x] Landing page with hero, services, portfolio, booking, contact sections
- [x] Online booking system with calendar and time slot selection
- [x] Admin dashboard at /admin to view and manage bookings
- [x] Contact form for general inquiries
- [x] Social media integration (Instagram, TikTok)
- [x] Dark cinematic "Diesel Noir" theme

## What's Been Implemented (January 20, 2025)

### Backend (FastAPI + MongoDB)
- POST /api/bookings - Create booking
- GET /api/bookings - List all bookings
- GET /api/bookings/{id} - Get booking details
- PATCH /api/bookings/{id} - Update booking status
- DELETE /api/bookings/{id} - Delete booking
- GET /api/available-times - Get available time slots for date
- POST /api/contact - Submit contact message
- GET /api/contact - List all contact messages

### Frontend (React + Tailwind + Shadcn UI)
- Navigation with smooth scroll
- Hero section with cinematic background
- Services section (5 services with images)
- Portfolio gallery section
- Booking section with CTA
- Contact section with form
- Footer with social links
- Booking modal (3-step wizard)
- Admin dashboard with booking/message management

## Prioritized Backlog

### P0 (Completed)
- [x] Full booking flow
- [x] Admin dashboard
- [x] Contact form

### P1 (Future Enhancements)
- [ ] Admin authentication/login
- [ ] Email notifications (SendGrid/Resend)
- [ ] SMS notifications (Twilio)
- [ ] Booking calendar view in admin

### P2 (Nice to Have)
- [ ] Package/pricing display
- [ ] Client portal (view their bookings)
- [ ] Embedded video portfolio (YouTube/Vimeo)
- [ ] Testimonials section

## Next Tasks
1. Add admin authentication if needed
2. Integrate email/SMS notifications when ready
3. Add actual portfolio videos from client's content
