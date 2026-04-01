// ════════════════════════════════════════════════
// Auth Types — Sellsuki AMS
// ════════════════════════════════════════════════

export type AuthScreen =
  | 'sign-in'           // Email input
  | 'sign-in-email-dup' // Email input — duplicate email error state
  | 'password'          // Password input (existing user)
  | 'password-error'    // Password input — wrong password error state
  | 'sign-up'           // First + last name (new user)
  | 'set-password'      // Set password + confirm password (after name)
  | 'verify-email'      // Email verification (resend countdown)
  | 'email-confirmed'   // Email verified success
  | 'forgot'            // Forgot password — email input
  | 'forgot-sent'       // Forgot password — email sent confirmation
  | 'social-cb'         // Social OAuth confirm
  | 'Dashboard'         // Logged-in Dashboard + logout

export type SocialProvider = 'Google' | 'Facebook' | 'Line'

export interface UserAccount {
  name: string
  email: string
}

export interface SocialUser {
  name: string
  email: string
  initial: string
  provider: SocialProvider
}

export interface AuthState {
  screen: AuthScreen
  email: string
  accounts: Record<string, UserAccount>
  socialUser: SocialUser | null
  loggedInUser: UserAccount | null
}
