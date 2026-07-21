import { Routes, Route, Outlet } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import WeddingHallPage from './pages/WeddingHall/WeddingHallPage';
import SeudeuimePage from './pages/Seudeume/SeudeuimePage';
import HoneymoonPage from './pages/Honeymoon/HoneymoonPage';
import BuilderPage from './pages/Builder/BuilderPage';
import ChecklistPage from './pages/Checklist/ChecklistPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import BudgetPage from './pages/Budget/BudgetPage';
import CommunityPage from './pages/Community/CommunityPage';
import MypagePage from './pages/Mypage/MypagePage';
import { PageLayout } from './components';
import { OnboardingProvider } from './pages/Onboarding/OnboardingContext';
import OnboardingStartPage from './pages/Onboarding/OnboardingStartPage';
import OnboardingIntroPage from './pages/Onboarding/OnboardingIntroPage';
import QuizPage from './pages/Onboarding/QuizPage';
import PartnerMbtiPage from './pages/Onboarding/PartnerMbtiPage';
import CommunityDetailPage from "./pages/Community/CommunityDetailPage";
import CommunityWritePage from "./pages/Community/CommunityWritePage";


function OnboardingRoutes() {
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<OnboardingRoutes />}>
        <Route path="/onboarding" element={<OnboardingStartPage />} />
        <Route path="/onboarding/intro" element={<OnboardingIntroPage />} />
        <Route path="/onboarding/quiz" element={<QuizPage />} />
        <Route path="/onboarding/partner" element={<PartnerMbtiPage />} />
      </Route>

      <Route element={<PageLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/wedding-hall" element={<WeddingHallPage />} />
        <Route path="/seudeume" element={<SeudeuimePage />} />
        <Route path="/honeymoon" element={<HoneymoonPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/:id" element={<CommunityDetailPage />} />
        <Route path="/community/write" element={<CommunityWritePage />} />
        <Route path="/mypage" element={<MypagePage />} />
      </Route>
    </Routes>
  );
}
