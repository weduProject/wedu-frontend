import { Routes, Route, Outlet } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
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
import CommunityDetailPage from './pages/Community/CommunityDetailPage';
import CommunityWritePage from './pages/Community/CommunityWritePage';
import ShopDetailPage from './pages/Shop/ShopDetailPage';
import WishlistPage from './pages/Shop/WishlistPage';
import DDayPage from './pages/Home/DDayPage';
import { ScheduleProvider } from './pages/Calendar/hooks/useSchedules';
import { ChecklistProvider } from './pages/Checklist/hooks/useChecklist';
import { BuilderProvider } from './pages/Builder/BuilderContext';
import { CommunityProvider } from './pages/Community/CommunityContext';
import { WishlistProvider } from './pages/Shop/WishlistContext';
import { CartProvider } from './pages/Shop/CartContext';
import CartPage from './pages/Shop/CartPage';
import BuilderStartPage from './pages/Builder/BuilderStartPage';
import BuilderCartPage from "./pages/Builder/BuilderCartPage";


function OnboardingRoutes() {
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  );
}

export default function App() {
  return (
    <ChecklistProvider>
      <ScheduleProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<OnboardingRoutes />}>
            <Route path="/onboarding" element={<OnboardingStartPage />} />
            <Route path="/onboarding/intro" element={<OnboardingIntroPage />} />
            <Route path="/onboarding/quiz" element={<QuizPage />} />
            <Route path="/onboarding/partner" element={<PartnerMbtiPage />} />
          </Route>

          <Route
            element={
              <CommunityProvider>
                <WishlistProvider>
                  <CartProvider>
                    <PageLayout />
                  </CartProvider>
                </WishlistProvider>
              </CommunityProvider>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/dday" element={<DDayPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:id" element={<ShopDetailPage />} />
            <Route path="/shop/wishlist" element={<WishlistPage />} />
            <Route path="/shop/cart" element={<CartPage />} />
            <Route path="/wedding-hall" element={<WeddingHallPage />} />
            <Route path="/seudeume" element={<SeudeuimePage />} />
            <Route path="/honeymoon" element={<HoneymoonPage />} />
            <Route path="/builder-start" element={<BuilderStartPage />} />
            <Route
              path="/builder"
              element={
                <BuilderProvider>
                  <BuilderPage />
                </BuilderProvider>
              }
            />
            <Route
              path="/builder/cart"
              element={
                <BuilderProvider>
                  <BuilderCartPage />
                </BuilderProvider>
              }
            />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<CommunityDetailPage />} />
            <Route path="/community/write" element={<CommunityWritePage />} />
            <Route path="/mypage" element={<MypagePage />} />
          </Route>
        </Routes>
      </ScheduleProvider>
    </ChecklistProvider>
  );
}