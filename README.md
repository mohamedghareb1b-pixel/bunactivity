# BunActivity

## Phase 1 — Project Scaffold
- Next.js 14 App Router + TypeScript
- Tailwind مع CSS Variables لألوان البراند (Ivory / Coffee Light / Coffee Dark / Beige)
- Prisma schema كامل حسب نموذج قاعدة البيانات في القسم 54 (Artist, Event, EventArtist, Venue, City, Admin, SiteSettings)
- هيكل الصفحات العامة: `/`, `/concerts`, `/artists/[slug]`, `/events/[slug]`, `/cities/[slug]`, `/about`, `/contact`, `/faq`, `/affiliate-disclosure`, `/privacy`, `/terms`
- `sitemap.ts` و `robots.ts` ديناميكيين + صفحة 404 مخصصة

## Phase 2 — Admin Dashboard + Auth
- تسجيل دخول Admin بجلسة موقّعة بـHMAC في cookie (بدون مكتبات Auth خارجية) — `src/lib/session.ts`, `src/lib/password.ts`
- `middleware.ts` بيحمي كل `/admin/*` و `/api/admin/*` ما عدا صفحة اللوجين
- Dashboard بالأرقام المطلوبة في القسم 63: Total Events, Total Artists, Upcoming Events, Total Clicks, Top Events
- Artists CRUD كامل: `/admin/artists`, `/admin/artists/new`, `/admin/artists/[id]` + API routes
- Events CRUD كامل مع اختيار Multiple Artists، وحساب الـStatus (Upcoming/Past) تلقائيًا من التاريخ حسب القسم 41 — مفيش تغيير يدوي للحالة
- `prisma/seed.ts` لإنشاء أول Admin user

## Phase 3 — Public Pages Wired to Real Data
- `EventCard`, `ArtistCard`, `CityCard` components (`src/components/public/`)
- الصفحة الرئيسية بقت بتجيب Upcoming Events, Trending Artists, Popular Cities, This Week, Featured Event من Prisma فعليًا (بتعرض القسم لو فيه بيانات بس)
- صفحة `/concerts` بتعرض كل الأحداث المنشورة
- صفحة الفنان (`/artists/[slug]`) كاملة: Header, About, Popular Songs, Next Concert (بيتحسب تلقائيًا من التاريخ), Upcoming Concerts, Related Artists (فنانين شاركوا في نفس الحدث)
- صفحة الحدث (`/events/[slug]`) كاملة: التفاصيل، Get Tickets، Affiliate disclosure note، Related Events (نفس الفنانين)
- صفحة المدينة (`/cities/[slug]`) كاملة: Upcoming Events, This Week, Artists Performing
- `/go/[slug]` — رابط تتبع النقرات: بيزود عداد `clicks` بتاع الحدث في الخلفية وبعدين يعمل redirect لـ `ticketUrl` (القسم 62). كل أزرار "Get Tickets" بقت بتستخدمه بدل الرابط المباشر
- `sitemap.ts` بقى بيسحب slugs حقيقية من Artists/Events/Cities

## Phase 4 — Search, Advanced Filters & Structured Data
- **Global Search** (`/search`): بيدور في Artist name, Event name, Venue name, وأسماء الفنانين المرتبطين بالحدث — زي القسم 20 بالظبط. الـSearch bar في الهيدر وفي الصفحة الرئيسية بيوديك هناك
- **Advanced Filters** على `/concerts`: Date (Today/Tomorrow/This Week/This Weekend/This Month/Custom)، City، Artist — كل ده بيتحط في الـURL كـquery params (`?date=this-week&city=new-york`) عشان يفضل SEO-friendly ومفيش اعتماد على Client State بس
- **Structured Data (JSON-LD)** كامل:
  - `Event` schema (مع Location, Performer, Offers) في صفحة الحدث
  - `MusicGroup` schema في صفحة الفنان
  - `BreadcrumbList` في صفحات الفنان/الحدث/المدينة (مع Breadcrumbs UI ظاهرة كمان)
  - `Organization` و `WebSite` (مع SearchAction) في كل صفحات الموقع عبر الـroot layout
- كل الـSchema builders في `src/lib/structured-data.ts` — سهل تضيف عليهم لو احتجت أنواع تانية

## Phase 5 — Header/Footer, Legal Content, SEO Settings, Venue Dedupe
- **Header** (Logo + Concerts/Artists/Cities/About/Contact nav + Search link) و**Footer** (Nav + TikTok + Legal links) ظاهرين في كل صفحات الموقع العام، ومختفيين تلقائيًا في `/admin` (عبر `ChromeVisibility`)
- صفحات `/artists` و `/cities` index جديدة (كان عندنا بس `[slug]` dynamic قبل كده) — الهيدر بيربط عليهم دلوقتي
- **محتوى حقيقي** بدل الـplaceholder في: About, Contact, FAQ, Affiliate Disclosure — Privacy و Terms عندهم محتوى أساسي + تنبيه TODO إنهم محتاجين مراجعة قانونية قبل الإطلاق
- **SEO Settings admin page** (`/admin/settings`): General SEO, Google (Search Console verification + Analytics ID + Tag Manager ID), Social (TikTok), Affiliate — كله بيتخزن في جدول `SiteSettings` وبيتقرأ في الـroot layout: verification meta tag، GA4/GTM scripts، TikTok في الفوتر، كله بيتحدث من غير لمس الكود
- **إصلاح تكرار الـVenue:** حفظ حدث بنفس اسم المكان والمدينة بقى بيستخدم نفس الـVenue بدل ما يعمل واحد جديد كل مرة

## خطوات التشغيل

```bash
npm install
cp .env.example .env   # حط DATABASE_URL و ADMIN_SESSION_SECRET بتوعك
npm run db:push        # أو db:migrate
npm run db:seed        # يعمل أول Admin (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD من .env)
npm run dev
```

بعد كده افتح `/admin/login`، سجل دخول، روح `/admin/settings` وحط الـTikTok/Analytics بتوعك، وابدأ تضيف Artists و Events.

## MVP Status (مقابل القسم 64 في الـPRD)
كل بنود الـMVP الأساسية موجودة دلوقتي: Homepage, Artists, Artist Page, Events, Event Page, Cities, Search, Filters, Admin Login, Artist CRUD, Event CRUD, Multiple Artists per Event, Ticket/Affiliate URL + click tracking, Automatic Next Concert, About, Contact, FAQ, Affiliate Disclosure, Privacy, Terms, Sitemap, Robots, Metadata, Structured Data, Google Search Console support, Analytics support, TikTok links, Responsive design, SEO-friendly URLs.

## قبل ما تنشر فعليًا (مش MVP بلوكرز بس مهمين)
- مراجعة قانونية حقيقية لصفحتي Privacy و Terms
- Image upload/optimization pipeline (دلوقتي بيتحط Image URL يدوي بس — مفيش رفع مباشر لصورة)
- Contact page لسه بتستخدم mailto links بدل فورم فعلي بيبعت إيميل
- Phase 2 (من القسم 65 في الـPRD): Newsletter, Event submission, More affiliate networks, Related Events algorithm أذكى, Trending Events, User favorites
