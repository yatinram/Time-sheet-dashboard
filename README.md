# ⚡ Enterprise Employee Time Tracking & Timesheet Dashboard

> **Practical Selection Task Submission for Meghraj Technosoft**  
> **Candidate:** Patel YatinKumar  
> **Technology Stack:** React.js (Vite) + Supabase Auth & RLS Postgres + Ant Design (v5) + Zod + React Hook Form + Vitest

---

## 📸 Application Screenshots & UI Previews

![Dashboard Overview UI](file:///C:/Users/yatin/.gemini/antigravity/brain/1df18c9d-8cda-4a9c-bd89-d2bcfc519cd6/dashboard_mockup_1786901937959.jpg)

![Authentication & Login UI](file:///C:/Users/yatin/.gemini/antigravity/brain/1df18c9d-8cda-4a9c-bd89-d2bcfc519cd6/login_page_mockup_1786902274772.jpg)

---

## 🌟 Executive Overview

A high-performance, enterprise-grade internal **Employee Time Tracking & Timesheet Dashboard** built to streamline daily work hour logging, track billable progress efficiency, and analyze category distributions. 

Designed with modern SaaS design principles, database-enforced Row Level Security (RLS), custom compound components, real-time Zod validation, dynamic light/dark mode theme system, and responsive touch controls for mobile devices.

---

## 🎯 Feature Requirements & Implementation Mapping

| # | Task Requirement | Implementation Details | Status |
|---|---|---|---|
| 1 | **Auth Screens (Login & Sign Up)** | Split-screen layout with 45% form ratio, smooth page transition animations, high-security password validator (8+ chars, uppercase, lowercase, number, special symbol live checklist), and instant Zod schema feedback. | ✅ Completed |
| 2 | **Protected Routes** | Unauthenticated users trying to access `/dashboard`, `/timesheet`, or `/settings` are automatically redirected to `/login`. | ✅ Completed |
| 3 | **Auth Header** | Renders pill-shaped User Profile Chip (`header-user-chip`) with user email & avatar badge, interactive Sun/Moon Theme Toggle button, and Sign Out action. | ✅ Completed |
| 4 | **Timesheet Log & Debounced Search** | Full time entry management table with a **300ms custom debounced search filter** by description and category dropdown filter (*Development, Design, Client Meeting*). | ✅ Completed |
| 5 | **Hours Tracker & Billable Formula** | Summary progress bar executing the exact formula: $\frac{\text{Logged Billable Hours}}{\text{Weekly Target Hours}} \times 100$. Recalculates automatically using `useMemo` upon entry creation, editing, or deletion. | ✅ Completed |
| 6 | **Log Actions & Modal Confirmation** | Add/Edit time entry modal with Zod validation (`hours > 0`, date, category, description), instant billable toggle switch, and Ant Design `Modal.confirm` dialog for entry deletion. | ✅ Completed |
| 7 | **UI/UX & Bonus Features** | **Loading Skeletons** during data fetch, **Animated Empty State** with floating icon when zero logs exist, **Network Error Alert** with retry trigger, **Dynamic Light/Dark Mode** switch, and **One-Click CSV Export**. | ✅ Completed |
| 8 | **Compound Component Pattern** | Clean component composition pattern utilizing `<Timesheet.Header>`, `<Timesheet.Row>`, and `<Timesheet.Footer>` for modular data flow. | ✅ Completed |

---

## 🛠️ Architecture & Key Code Design Patterns

### 1. Compound Component Architecture (`src/components/timesheet/`)
The main timesheet UI utilizes the Compound Component pattern to cleanly encapsulate state and sub-views:
```jsx
<Timesheet entries={entries}>
  <Timesheet.Header />
  <Timesheet.Row
    onEdit={openEditForm}
    onDelete={handleDelete}
    onToggleBillable={handleToggleBillable}
  />
  <Timesheet.Footer />
</Timesheet>
```

### 2. Automatic Billable Progress Calculation (`useMemo`)
The billable efficiency progress bar is optimized using React's `useMemo` hook to prevent unnecessary re-computations:
```javascript
export function calculateBillableProgress(entries, weeklyTargetHours = 40) {
  const billableHours = entries.reduce(
    (sum, e) => (e.is_billable ? sum + Number(e.hours) : sum),
    0
  );
  const percent = weeklyTargetHours > 0 ? (billableHours / weeklyTargetHours) * 100 : 0;
  return { billableHours, percent };
}
```

### 3. Custom Debounced Search Hook (`useDebounce.js`)
Prevents performance degradation by delaying search execution until 300ms after the user stops typing:
```javascript
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
```

---

## 🎨 Dual Theme System (Light & Dark Slate)

The application features a dynamic Theme Context with `localStorage` persistence and Ant Design design token synchronization:
- **Dark Mode ("Light Dark Blue Slate")**: Deep midnight navy background (`#0F172A`), matching `#0B1120` Header/Sidebar, and elevated slate cards (`#1E293B`).
- **Light Mode ("Soft Executive Off-White")**: Eye-friendly soft off-white slate (`#F8FAFC` cards/sidebar, `#F1F5F9` body) replacing harsh blinding white.
- **Buttons**: Multi-stop vibrant blue gradients (`linear-gradient(135deg, #2563eb, #3b82f6, #4f46e5)`).

---

## 🗄️ Database Schema & Supabase Row Level Security (RLS)

Each user's timesheet data is strictly isolated at the database level using Supabase Postgres RLS policies (`auth.uid() = user_id`).

Run the following DDL script in your Supabase SQL Editor:

```sql
-- Create time_entries table
create table public.time_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null,
  hours numeric(5,2) not null check (hours > 0),
  entry_date date not null,
  category text not null check (category in ('Development','Design','Client Meeting')),
  is_billable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.time_entries enable row level security;

-- Row Level Security Policies
create policy "Users can view their own entries"
  on public.time_entries for select using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on public.time_entries for insert with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on public.time_entries for update using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on public.time_entries for delete using (auth.uid() = user_id);
```

---

## 💻 Local Setup & Installation Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Steps to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/timesheet-dashboard.git
   cd timesheet-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**  
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. **Start the Local Development Server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🧪 Automated Testing Suite (Vitest)

The application includes unit tests for core business logic, utility formulas, and custom hooks.

To execute the test suite:
```bash
npm run test
```

### Test Results:
```bash
 RUN  v2.1.9 E:/Downloads/timesheet-dashboard/timesheet-dashboard

 ✓ src/tests/hoursCalculation.test.js (5 tests)
 ✓ src/tests/useDebounce.test.js (3 tests)

 Test Files  2 passed (2)
      Tests  8 passed (8)
   Duration  1.4s
```

---

## 📦 Production Build

To verify and create the production-ready optimized bundle:
```bash
npm run build
```

---

## 👨‍💻 Candidate Details

- **Name:** Patel YatinKumar
- **Submitted To:** Meghraj Technosoft Selection Team
- **Task:** Employee Time Tracking & Timesheet Dashboard
- **Completion Status:** 100% Core Features + All Bonus UI/UX Features Completed
