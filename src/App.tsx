import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLayout } from './components';

import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import AuthCallbackPage from './pages/Login/AuthCallbackPage';

import ShopPage from './pages/Shop/ShopPage';
import ShopDetailPage from './pages/Shop/ShopDetailPage';
import WishlistPage from './pages/Shop/WishlistPage';
import CartPage from './pages/Shop/CartPage';

import BuilderPage from './pages/Builder/BuilderPage';
import BuilderStartPage from './pages/Builder/BuilderStartPage';
import BuilderCartPage from './pages/Builder/BuilderCartPage';

import ChecklistPage from './pages/Checklist/ChecklistPage';
import SharedChecklistPage from './pages/Checklist/SharedChecklistPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import BudgetPage from './pages/Budget/BudgetPage';

import CommunityPage from './pages/Community/CommunityPage';
import CommunityDetailPage from './pages/Community/CommunityDetailPage';
import CommunityWritePage from './pages/Community/CommunityWritePage';

import MypagePage from './pages/Mypage/MypagePage';
import MypageEditPage from './pages/Mypage/MypageEditPage';
import DashboardSection from './pages/Mypage/components/DashboardSection';

import DDayPage from './pages/Dashboard/DDayPage';

import OnboardingStartPage from './pages/Onboarding/OnboardingStartPage';
import OnboardingIntroPage from './pages/Onboarding/OnboardingIntroPage';
import QuizPage from './pages/Onboarding/QuizPage';
import PartnerMbtiPage from './pages/Onboarding/PartnerMbtiPage';
import ResultPage from './pages/Onboarding/ResultPage';
import { OnboardingProvider } from './pages/Onboarding/OnboardingContext';

import WeddingShopPage from './pages/WeddingShop/WeddingShopPage';
import WeddingShopDetailPage from './pages/WeddingShop/WeddingShopDetailPage';
import WeddingEstimatePage from './pages/WeddingEstimate/WeddingEstimatePage';

import InvitationPage from './pages/invitation/InvitationPage';
import InvitationCreatePage from './pages/invitation/InvitationCreatePage';
import InvitationDetailPage from './pages/invitation/InvitationDetailPage';
import InvitationPublicViewPage from './pages/invitation/InvitationPublicViewPage';

import ConnectPage from './pages/Partner/ConnectPage';
import WeddingMagazinePage from './pages/WeddingMagazine/WeddingMagazinePage';
import SharePage from './pages/Share/SharePage';

import { DDayProvider } from './contexts/DDayContext';
import { BudgetProvider } from './pages/Budget/hooks/useBudget';
import { ChecklistProvider } from './pages/Checklist/hooks/useChecklist';
import { ScheduleProvider } from './pages/Calendar/hooks/useSchedules';
import { BuilderProvider } from './pages/Builder/BuilderContext';
import { CommunityProvider } from './pages/Community/CommunityContext';
import { WishlistProvider } from './pages/Shop/WishlistContext';
import { CartProvider } from './pages/Shop/CartContext';

import ScrollToTop from './components/ScrollToTop';

function OnboardingRoutes() {
  return (
    <OnboardingProvider>
      <PageLayout />
    </OnboardingProvider>
  );
}

export default function App() {
  return (
    <DDayProvider>
      <BudgetProvider>
        <ChecklistProvider>
          <ScheduleProvider>
            <CommunityProvider>
              <WishlistProvider>
                <CartProvider>
                  <ScrollToTop />

                  <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route
                      path="/oauth2/authorization/google"
                      element={<AuthCallbackPage />}
                    />
                    <Route
                      path="/oauth2/authorization/kakao"
                      element={<AuthCallbackPage />}
                    />
                    <Route path="/share/:token" element={<SharePage />} />
                    {/* 헤더/네비게이션 없는 조회 전용 청첩장 공유 페이지 (로그인 여부와 무관하게 접근 가능) */}
                    <Route path="/invitation/view/:id" element={<InvitationPublicViewPage />} />

                    <Route element={<OnboardingRoutes />}>
                      <Route path="/onboarding" element={<OnboardingStartPage />} />
                      <Route path="/onboarding/intro" element={<OnboardingIntroPage />} />
                      <Route path="/onboarding/quiz" element={<QuizPage />} />
                      <Route path="/onboarding/partner" element={<PartnerMbtiPage />} />
                      <Route path="/onboarding/result" element={<ResultPage />} />
                    </Route>

                    <Route element={<PageLayout />}>
                      <Route path="/home" element={<LandingPage />} />
                      <Route path="/dday" element={<DDayPage />} />

                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/shop/:id" element={<ShopDetailPage />} />
                      <Route path="/shop/wishlist" element={<WishlistPage />} />
                      <Route path="/shop/cart" element={<CartPage />} />

                      <Route path="/wedding-shop" element={<WeddingShopPage />} />
                      <Route
                        path="/wedding-shop/:id"
                        element={<WeddingShopDetailPage />}
                      />
                      <Route
                        path="/wedding-estimate"
                        element={<WeddingEstimatePage />}
                      />

                      <Route
                        path="/builder-start"
                        element={<BuilderStartPage />}
                      />
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
                      <Route
                        path="/shared/checklist/:token"
                        element={<SharedChecklistPage />}
                      />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/budget" element={<BudgetPage />} />

                      <Route path="/community" element={<CommunityPage />} />
                      <Route
                        path="/community/:id"
                        element={<CommunityDetailPage />}
                      />
                      <Route
                        path="/community/write"
                        element={<CommunityWritePage />}
                      />

                      <Route path="/mypage" element={<MypagePage />} />
                      <Route
                        path="/mypage/dashboard"
                        element={<DashboardSection />}
                      />
                      <Route
                        path="/mypage/edit"
                        element={<MypageEditPage />}
                      />

                      <Route path="/connect" element={<ConnectPage />} />
                      <Route path="/magazine" element={<WeddingMagazinePage />} />

                      <Route path="/invitation" element={<InvitationPage />} />
                      <Route
                        path="/invitation/create"
                        element={<InvitationCreatePage />}
                      />
                      <Route
                        path="/invitation/preview"
                        element={<InvitationDetailPage />}
                      />
                      <Route
                        path="/invitation/:id"
                        element={<InvitationDetailPage />}
                      />
                    </Route>
                  </Routes>
                </CartProvider>
              </WishlistProvider>
            </CommunityProvider>
          </ScheduleProvider>
        </ChecklistProvider>
      </BudgetProvider>
    </DDayProvider>
  );
}
