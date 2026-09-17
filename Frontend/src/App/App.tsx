import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from "@/shared/constants/routes";
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { SessionExpiryModal } from '../features/auth/components/SessionExpiryModal'

import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage'
import { VerifyOtpPage } from '../features/auth/pages/VerifyOtpPage'
import { ChangePasswordPage } from '../features/auth/pages/ChangePasswordPage'
import { ProfileSettingsPage } from '../features/settings/pages/ProfileSettingsPage'

function App() {
  return (
    <>
      <SessionExpiryModal />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
        <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
        <Route path={ROUTES.PROFILE_SETTINGS} element={<ProfileSettingsPage />} />
        {/* Redirect root to login for now, or you can build a Home page */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </>
  )
}

export default App
