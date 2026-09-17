import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { PageLoader } from "@/shared/components/PageLoader";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { ROUTES } from "./routes.config";

// Layout imports
import { RootLayout } from "@/layouts/RootLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { SettingsLayout } from "@/layouts/SettingsLayout";
import { ErrorLayout } from "@/layouts/ErrorLayout";
import { AdminLayout } from "@/features/admin/components/AdminLayout";
import { AdminRoute } from "./AdminRoute";
import { OfflinePage } from "@/pwa/OfflinePage";

// ============================================================================
// LAZY LOADED AUTH PAGES
// ============================================================================

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  }))
);

const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  }))
);

const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);

const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  }))
);

const VerifyOtpPage = lazy(() =>
  import("@/features/auth/pages/VerifyOtpPage").then((m) => ({
    default: m.VerifyOtpPage,
  }))
);

const ChangePasswordPage = lazy(() =>
  import("@/features/auth/pages/ChangePasswordPage").then((m) => ({
    default: m.ChangePasswordPage,
  }))
);

const ProfileSettingsPage = lazy(() =>
  import("@/features/settings/pages/ProfileSettingsPage").then((m) => ({
    default: m.ProfileSettingsPage,
  }))
);

const AccountSettingsPage = lazy(() =>
  import("@/features/settings/pages/AccountSettingsPage").then((m) => ({
    default: m.AccountSettingsPage,
  }))
);

const SecuritySettingsPage = lazy(() =>
  import("@/features/settings/pages/SecuritySettingsPage").then((m) => ({
    default: m.SecuritySettingsPage,
  }))
);

const AppearanceSettingsPage = lazy(() =>
  import("@/features/settings/pages/AppearanceSettingsPage").then((m) => ({
    default: m.AppearanceSettingsPage,
  }))
);

const PreferencesSettingsPage = lazy(() =>
  import("@/features/settings/pages/PreferencesSettingsPage")
);

const PrivacySettingsPage = lazy(() =>
  import("@/features/settings/pages/PrivacySettingsPage").then((m) => ({
    default: m.PrivacySettingsPage,
  }))
);

const AboutSettingsPage = lazy(() =>
  import("@/features/settings/pages/AboutSettingsPage").then((m) => ({
    default: m.AboutSettingsPage,
  }))
);

const HelpSettingsPage = lazy(() =>
  import("@/features/settings/pages/HelpSettingsPage").then((m) => ({
    default: m.HelpSettingsPage,
  }))
);

// ============================================================================
// LAZY LOADED ADMIN PAGES
// ============================================================================

const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  }))
);

const AdminUsersPage = lazy(() =>
  import("@/features/admin/pages/AdminUsersPage").then((m) => ({
    default: m.AdminUsersPage,
  }))
);

const AdminReportsPage = lazy(() =>
  import("@/features/admin/pages/AdminReportsPage").then((m) => ({
    default: m.AdminReportsPage,
  }))
);

const AdminPostsPage = lazy(() =>
  import("@/features/admin/pages/AdminPostsPage").then((m) => ({
    default: m.AdminPostsPage,
  }))
);

const AdminCommentsPage = lazy(() =>
  import("@/features/admin/pages/AdminCommentsPage").then((m) => ({
    default: m.AdminCommentsPage,
  }))
);

const AdminCategoriesPage = lazy(() =>
  import("@/features/admin/pages/AdminCategoriesPage").then((m) => ({
    default: m.AdminCategoriesPage,
  }))
);

const AdminTagsPage = lazy(() =>
  import("@/features/admin/pages/AdminTagsPage").then((m) => ({
    default: m.AdminTagsPage,
  }))
);

const AdminAnalyticsPage = lazy(() =>
  import("@/features/admin/pages/AdminAnalyticsPage").then((m) => ({
    default: m.AdminAnalyticsPage,
  }))
);

const AdminSettingsPage = lazy(() =>
  import("@/features/admin/pages/AdminSettingsPage").then((m) => ({
    default: m.AdminSettingsPage,
  }))
);

// ============================================================================
// LAZY LOADED PROFILE PAGES
// ============================================================================

const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  }))
);

// Removed old SettingsPage import

// ============================================================================
// LAZY LOADED FEED PAGES
// ============================================================================

const FeedPage = lazy(() =>
  import("@/features/feed/pages/FeedPage").then((m) => ({
    default: m.FeedPage,
  }))
);

const BookmarksPage = lazy(() =>
  import("@/features/bookmarks/pages/BookmarksPage").then((m) => ({
    default: m.BookmarksPage,
  }))
);

const NotificationsPage = lazy(() =>
  import("@/features/notification/pages/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  }))
);

const FollowersPage = lazy(() =>
  import("@/features/follow/pages/FollowersPage").then((m) => ({
    default: m.FollowersPage,
  }))
);

const FollowingPage = lazy(() =>
  import("@/features/follow/pages/FollowingPage").then((m) => ({
    default: m.FollowingPage,
  }))
);

const MessagesPage = lazy(() =>
  import("@/features/messages/pages/MessagesPage").then((m) => ({
    default: m.MessagesPage,
  }))
);

// ============================================================================
// LAZY LOADED POST PAGES
// ============================================================================

const PostDetailsPage = lazy(() =>
  import("@/features/post/pages/PostDetailsPage").then((m) => ({
    default: m.PostDetailsPage,
  }))
);

const CreatePostPage = lazy(() =>
  import("@/features/post-editor/pages/CreatePostPage")
);

const EditPostPage = lazy(() =>
  import("@/features/post-editor/pages/EditPostPage")
);

// ============================================================================
// LAZY LOADED SEARCH PAGES
// ============================================================================

const SearchPage = lazy(() =>
  import("@/features/search/pages/SearchPage").then((m) => ({
    default: m.SearchPage,
  }))
);

const DiscoverPage = lazy(() =>
  import("@/features/search/pages/DiscoverPage").then((m) => ({
    default: m.DiscoverPage,
  }))
);

// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

export const routes: RouteObject[] = [
  // Root Layout
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "offline",
        element: <OfflinePage />,
      },
      {
        index: true,
        element: <Navigate to={ROUTES.FEED} replace />,
      },
      // Auth Routes (Guest Only)
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <LoginPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "register",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <RegisterPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <ForgotPasswordPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "reset-password/:token",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <ResetPasswordPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "verify-otp",
            element: (
              <GuestRoute>
                <Suspense fallback={<PageLoader />}>
                  <VerifyOtpPage />
                </Suspense>
              </GuestRoute>
            ),
          },
          {
            path: "change-password",
            element: (
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <ChangePasswordPage />
                </Suspense>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Feed Routes (Protected)
      {
        path: "feed",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <FeedPage />
              </Suspense>
            ),
          },
        ],
      },

      // Search Route (Protected)
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <SearchPage />
              </Suspense>
            ),
          },
        ],
      },

      // Discover Route (Protected)
      {
        path: "discover",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <DiscoverPage />
              </Suspense>
            ),
          },
        ],
      },

      // Explore is the public navigation name for discovery.
      {
        path: "explore",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <DiscoverPage />
              </Suspense>
            ),
          },
        ],
      },

      // Bookmarks Route (Protected)
      {
        path: "bookmarks",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <BookmarksPage />
              </Suspense>
            ),
          },
        ],
      },

      // Notifications Route (Protected)
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <NotificationsPage />
              </Suspense>
            ),
          },
        ],
      },

      // Messages Route (Protected)
      {
        path: "messages",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <MessagesPage />
              </Suspense>
            ),
          },
        ],
      },

      // Post Routes (Protected)
      {
        path: "posts",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <CreatePostPage />
              </Suspense>
            ),
          },
          {
            path: "new",
            element: <Navigate to="../create" replace />,
          },
          {
            path: "edit/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditPostPage />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PostDetailsPage />
              </Suspense>
            ),
          },
        ],
      },

      // Main Routes (Protected)
      {
        path: "app",
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.FEED} replace />,
          },
          // Profile Routes
          {
            path: "profile",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage isOwnProfile />
              </Suspense>
            ),
          },
          {
            path: "profile/followers",
            element: (
              <Suspense fallback={<PageLoader />}>
                <FollowersPage />
              </Suspense>
            ),
          },
          {
            path: "profile/following",
            element: (
              <Suspense fallback={<PageLoader />}>
                <FollowingPage />
              </Suspense>
            ),
          },
          {
            path: "profile/:username",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: "profile/:userId/followers",
            element: (
              <Suspense fallback={<PageLoader />}>
                <FollowersPage />
              </Suspense>
            ),
          },
          {
            path: "profile/:userId/following",
            element: (
              <Suspense fallback={<PageLoader />}>
                <FollowingPage />
              </Suspense>
            ),
          },
          // TODO: Add feed, explore, posts, etc. routes here
        ],
      },

      // Settings Routes (Protected)
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="account" replace />,
          },
          {
            path: "account",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AccountSettingsPage />
              </Suspense>
            ),
          },
          {
            path: "profile",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfileSettingsPage />
              </Suspense>
            ),
          },
          {
            path: "security",
            element: (
              <Suspense fallback={<PageLoader />}>
                <SecuritySettingsPage />
              </Suspense>
            ),
          },
          {
            path: "appearance",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AppearanceSettingsPage />
              </Suspense>
            ),
          },
          {
            path: "privacy",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PrivacySettingsPage />
              </Suspense>
            ),
          },
          {
            path: "preferences",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PreferencesSettingsPage />
              </Suspense>
            ),
          },
          {
            path: "about",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AboutSettingsPage />
              </Suspense>
            ),
          },
          {
            path: "help",
            element: (
              <Suspense fallback={<PageLoader />}>
                <HelpSettingsPage />
              </Suspense>
            ),
          },
        ],
      },

      // Admin Routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminDashboardPage />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminUsersPage />
              </Suspense>
            ),
          },
          {
            path: "reports",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminReportsPage />
              </Suspense>
            ),
          },
          {
            path: "posts",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminPostsPage />
              </Suspense>
            ),
          },
          {
            path: "comments",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminCommentsPage />
              </Suspense>
            ),
          },
          {
            path: "categories",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminCategoriesPage />
              </Suspense>
            ),
          },
          {
            path: "tags",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminTagsPage />
              </Suspense>
            ),
          },
          {
            path: "analytics",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminAnalyticsPage />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={<PageLoader />}>
                <AdminSettingsPage />
              </Suspense>
            ),
          },
        ],
      },

      // Error Routes
      {
        element: <ErrorLayout />,
        children: [
          {
            path: ROUTES.UNAUTHORIZED,
            element: <div>401 - Unauthorized</div>,
          },
          {
            path: ROUTES.FORBIDDEN,
            element: <div>403 - Forbidden</div>,
          },
          {
            path: ROUTES.NOT_FOUND,
            element: <div>404 - Not Found</div>,
          },
        ],
      },

      // Catch-all redirect
      {
        path: ROUTES.NOT_FOUND,
        element: <Navigate to={ROUTES.LOGIN} replace />,
      },
    ],
  },
];
