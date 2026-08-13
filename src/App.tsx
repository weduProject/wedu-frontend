import { Routes, Route, Outlet } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import ShopPage from './pages/Shop/ShopPage';
import ShopDetailPage from './pages/Shop/ShopDetailPage';
import WishlistPage from './pages/Shop/WishlistPage';
import CartPage from './pages/Shop/CartPage';
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
import DDayPage from './pages/Home/DDayPage';
import { ScheduleProvider } from './pages/Calendar/hooks/useSchedules';
import { ChecklistProvider } from './pages/Checklist/hooks/useChecklist';
import { BudgetProvider } from './pages/Budget/hooks/useBudget';
import { BuilderProvider } from './pages/Builder/BuilderContext';
import { CommunityProvider } from './pages/Community/CommunityContext';
import { WishlistProvider } from './pages/Shop/WishlistContext';
import { CartProvider } from './pages/Shop/CartContext';
import BuilderStartPage from './pages/Builder/BuilderStartPage';
import BuilderCartPage from './pages/Builder/BuilderCartPage';
import ScrollToTop from './components/ScrollToTop';
import AuthCallbackPage from './pages/Login/AuthCallbackPage';

import InvitationPage from './pages/invitation/InvitationPage';
import InvitationCreatePage from './pages/invitation/InvitationCreatePage';
import InvitationDetailPage from './pages/invitation/InvitationDetailPage';

import WeddingShopPage from './pages/WeddingShop/WeddingShopPage';
import WeddingShopDetailPage from './pages/WeddingShop/WeddingShopDetailPage';
import WeddingEstimatePage from './pages/WeddingEstimate/WeddingEstimatePage';
import SharedChecklistPage from './pages/Checklist/SharedChecklistPage';


function OnboardingRoutes() {
  return (
    <OnboardingProvider>
      <Outlet />
    </OnboardingProvider>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <ChecklistProvider>
        <ScheduleProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/oauth2/authorization/google" element={<AuthCallbackPage />} />
            <Route path="/oauth2/authorization/kakao" element={<AuthCallbackPage />} />
            
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
              <Route path="/wedding-shop" element={<WeddingShopPage />} />
              <Route path="/wedding-shop/:id" element={<WeddingShopDetailPage />} />
              <Route path="/wedding-estimate" element={<WeddingEstimatePage />} />
              <Route path="/shop/cart" element={<CartPage />} />
              <Route path="/builder-start" element={<BuilderStartPage />} />
              <Route
                element={
                  <BuilderProvider>
                    <Outlet />
                  </BuilderProvider>
                }
              >
                <Route path="/builder" element={<BuilderPage />} />
                <Route path="/builder/cart" element={<BuilderCartPage />} />
              </Route>
              
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/shared/checklist/:token" element={<SharedChecklistPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/:id" element={<CommunityDetailPage />} />
              <Route path="/community/write" element={<CommunityWritePage />} />
              <Route path="/mypage" element={<MypagePage />} />
              <Route path="/invitation" element={<InvitationPage />} />
              <Route path="/invitation/create" element={<InvitationCreatePage />} />
              <Route path="/invitation/:id" element={<InvitationDetailPage />} />
            </Route>
          </Routes>
        </ScheduleProvider>
      </ChecklistProvider>
    </BudgetProvider>
  );
}
