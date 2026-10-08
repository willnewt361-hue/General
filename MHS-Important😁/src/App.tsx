import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { RouterProvider, useRouter } from "./router";
import { AppProvider, useApp } from "./lib/store";

// marketing
import { Home } from "./pages/Home";
import { Learners } from "./pages/Learners";
import { Teachers } from "./pages/Teachers";
import { Uneb } from "./pages/Uneb";
import { FeaturesPage } from "./pages/FeaturesPage";
import { PricingPage } from "./pages/PricingPage";
import { FaqPage } from "./pages/FaqPage";
import { About } from "./pages/About";
import { Login } from "./pages/Login";

// portal
import { AppShell } from "./app/AppShell";
import { Dashboard, Labs, SubjectDetail, Subjects, TopicDetail } from "./app/pages/Learn";
import { Assignments, Certificates, Leaderboard, Mocks, Performance, Planner, Practice } from "./app/pages/Study";
import { Announcements, Community, Tutor } from "./app/pages/Social";
import { Analytics, Classes, Gradebook, ManageAssignments, TeacherDashboard } from "./app/pages/Teach";
import { AdminDashboard, ExamsBoard, Finance, People, Settings } from "./app/pages/Admin";
import { Empty } from "./app/Kit";

const MARKETING: Record<string, () => React.JSX.Element> = {
  "": Home,
  learners: Learners,
  teachers: Teachers,
  uneb: Uneb,
  features: FeaturesPage,
  pricing: PricingPage,
  faq: FaqPage,
  about: About,
};

const TITLES: Record<string, string> = {
  "": "Mengo Hub System — The Smart School Platform for Learners, Teachers & UNEB",
  learners: "For Learners — Mengo Hub System",
  teachers: "For Teachers — Mengo Hub System",
  uneb: "For UNEB & Assessment — Mengo Hub System",
  features: "Features — Mengo Hub System",
  pricing: "Pricing — Mengo Hub System",
  faq: "FAQ — Mengo Hub System",
  about: "About & Contact — Mengo Hub System",
  login: "Sign in — Mengo Hub System",
  app: "Dashboard — Mengo Hub System",
};

function Portal() {
  const { segments } = useRouter();
  const { user } = useApp();
  if (!user) return null;

  const [, section, param] = segments; // segments[0] === "app"
  const role = user.role;

  let page: React.ReactNode;

  switch (section) {
    case undefined:
      page = role === "admin" ? <AdminDashboard /> : role === "teacher" ? <TeacherDashboard /> : <Dashboard />;
      break;
    case "subjects":
      page = <Subjects />;
      break;
    case "subject":
      page = <SubjectDetail subjectId={param} />;
      break;
    case "topic":
      page = <TopicDetail topicId={param} />;
      break;
    case "labs":
      page = <Labs />;
      break;
    case "practice":
      page = <Practice />;
      break;
    case "assignments":
      page = <Assignments />;
      break;
    case "mocks":
      page = <Mocks />;
      break;
    case "tutor":
      page = <Tutor />;
      break;
    case "performance":
      page = <Performance />;
      break;
    case "planner":
      page = <Planner />;
      break;
    case "leaderboard":
      page = <Leaderboard />;
      break;
    case "certificates":
      page = <Certificates />;
      break;
    case "community":
      page = <Community />;
      break;
    case "announcements":
      page = <Announcements />;
      break;
    case "classes":
      page = <Classes />;
      break;
    case "gradebook":
      page = <Gradebook />;
      break;
    case "analytics":
      page = <Analytics />;
      break;
    case "manage-assignments":
      page = <ManageAssignments />;
      break;
    case "users":
      page = <People />;
      break;
    case "finance":
      page = <Finance />;
      break;
    case "exams-board":
      page = <ExamsBoard />;
      break;
    case "settings":
      page = <Settings />;
      break;
    default:
      page = <Empty title="Page not found" body="That page does not exist in your portal." />;
  }

  return <AppShell>{page}</AppShell>;
}

function Site() {
  const { segments, navigate, path } = useRouter();
  const { user } = useApp();
  const root = segments[0] ?? "";

  useEffect(() => {
    document.title = TITLES[root] ?? "Mengo Hub System";
  }, [root]);

  // guard the portal
  useEffect(() => {
    if (root === "app" && !user) navigate("login");
  }, [root, user, navigate]);

  if (root === "app") {
    return user ? <Portal /> : null;
  }

  if (root === "login" || root === "signup") return <Login />;

  const Page = MARKETING[root] ?? Home;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={path} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <Page />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <Site />
      </AppProvider>
    </RouterProvider>
  );
}
