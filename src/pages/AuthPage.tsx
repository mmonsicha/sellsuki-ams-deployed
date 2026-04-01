import { useState, useCallback, useEffect, useRef } from 'react'
import {
  DSButton,
  DSInput,
  Divider,
  ConfirmDialog,
  Card,
  CardBody,
  Badge,
} from '@uxuissk/design-system'
import { ArrowLeft } from 'lucide-react'

import type { AuthScreen, AuthState, SocialProvider, SocialUser, UserAccount } from '../types/auth'
import { SocialButton, SOCIAL_PROVIDERS } from '../components/SocialButton'
import { SellsukiLogo } from '../components/SellsukiLogo'
import DashboardPage from './DashboardPage'

// ── Background illustration URLs (from Figma design)
const BG_LEFT = 'https://www.figma.com/api/mcp/asset/43856c7e-fc77-4625-824e-f2a9731b3c77'
const BG_RIGHT = 'https://www.figma.com/api/mcp/asset/c26e7006-05dc-4d74-8a1b-234505b1bcd3'

// ── Mock social accounts
const SOCIAL_MOCK: Record<SocialProvider, SocialUser> = {
  Google: { name: 'ก้อง กัลยกร', email: 'kong@gmail.com', initial: 'ก', provider: 'Google' },
  Facebook: { name: 'ฝน มาลัย', email: 'fon@fb.com', initial: 'ฝ', provider: 'Facebook' },
  Line: { name: 'ปอ สุดาพร', email: 'po@line.me', initial: 'ป', provider: 'Line' },
}

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isValidPassword = (v: string) => v.length >= 8

const INITIAL_STATE: AuthState = {
  screen: 'Dashboard',
  email: 'hello@sellsuki.com',
  accounts: {
    'hello@sellsuki.com': { name: 'สมชาย ใจดี', email: 'hello@sellsuki.com' },
    'test@sellsuki.com': { name: 'ทดสอบ ระบบ', email: 'test@sellsuki.com' },
  },
  socialUser: null,
  loggedInUser: { name: 'สมชาย ใจดี', email: 'hello@sellsuki.com' },
}

const SCREENS_WITH_BG: AuthScreen[] = ['sign-in', 'sign-in-email-dup']


// ─────────────────────────────────────────────────
export default function AuthPage() {
  const [state, setState] = useState<AuthState>(INITIAL_STATE)
  const [prevScreen, setPrevScreen] = useState<AuthScreen>('sign-in')
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [firstNameInput, setFirstNameInput] = useState('')
  const [lastNameInput, setLastNameInput] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')

  const [resendSeconds, setResendSeconds] = useState(60)
  const [resendActive, setResendActive] = useState(false)
  const resendRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goScreen = useCallback((screen: AuthScreen) => {
    setPrevScreen(state.screen)
    setState(prev => ({ ...prev, screen }))
  }, [state.screen])

  const goBack = useCallback(() => goScreen(prevScreen), [goScreen, prevScreen])

  const startResendCountdown = useCallback(() => {
    if (resendRef.current) clearInterval(resendRef.current)
    setResendSeconds(60)
    setResendActive(true)
    resendRef.current = setInterval(() => {
      setResendSeconds(s => {
        if (s <= 1) { clearInterval(resendRef.current!); setResendActive(false); return 60 }
        return s - 1
      })
    }, 1000)
  }, [])

  useEffect(() => () => { if (resendRef.current) clearInterval(resendRef.current) }, [])

  // ── Sign-In: email
  const handleEmailNext = useCallback(() => {
    const email = emailInput.trim()
    if (!isValidEmail(email)) return
    if (state.accounts[email]) {
      setState(prev => ({ ...prev, email }))
      setPasswordInput('')
      goScreen('password')
    } else {
      setState(prev => ({ ...prev, email }))
      setFirstNameInput(''); setLastNameInput('')
      goScreen('sign-up')
    }
  }, [emailInput, state.accounts, goScreen])

  // ── Sign-In: password (type "wrong" to trigger error state demo)
  const handleLogin = useCallback(() => {
    if (passwordInput === 'wrong') { goScreen('password-error'); return }
    const account = state.accounts[state.email]
    if (account) {
      setState(prev => ({ ...prev, loggedInUser: account }))
      goScreen('Dashboard')
    }
  }, [passwordInput, state.accounts, state.email, goScreen])

  // ── Sign-Up: name → set-password
  const handleNameNext = useCallback(() => {
    if (!firstNameInput.trim() || !lastNameInput.trim()) return
    setNewPassword(''); setConfirmPassword('')
    goScreen('set-password')
  }, [firstNameInput, lastNameInput, goScreen])

  // ── Set-password → verify-email
  const handleSetPasswordNext = useCallback(() => {
    if (!isValidPassword(newPassword) || newPassword !== confirmPassword) return
    const newAccount: UserAccount = {
      name: `${firstNameInput.trim()} ${lastNameInput.trim()}`,
      email: state.email,
    }
    setState(prev => ({
      ...prev,
      accounts: { ...prev.accounts, [state.email]: newAccount },
    }))
    goScreen('verify-email')
    startResendCountdown()
  }, [newPassword, confirmPassword, firstNameInput, lastNameInput, state.email, goScreen, startResendCountdown])

  // ── Email confirmed → profile
  const handleEmailConfirmedLogin = useCallback(() => {
    const account = state.accounts[state.email]
    if (account) {
      setState(prev => ({ ...prev, loggedInUser: account }))
      goScreen('Dashboard')
    }
  }, [state.accounts, state.email, goScreen])

  // ── Forgot PW
  const handleForgotSend = useCallback(() => {
    if (!isValidEmail(forgotEmail)) return
    goScreen('forgot-sent')
  }, [forgotEmail, goScreen])

  const handleSocialSignIn = useCallback((provider: SocialProvider) => {
    const u = SOCIAL_MOCK[provider]
    setState(prev => ({
      ...prev, email: u.email, socialUser: u,
      accounts: prev.accounts[u.email]
        ? prev.accounts
        : { ...prev.accounts, [u.email]: { name: u.name, email: u.email } },
      loggedInUser: { name: u.name, email: u.email }
    }))
    goScreen('Dashboard')
  }, [goScreen])

  // handleSocialConfirm was removed since we log in immediately without the callback screen.

  // ── Logout
  const handleLogout = useCallback(() => {
    setShowLogoutDialog(false)
    setEmailInput(''); setPasswordInput(''); setFirstNameInput(''); setLastNameInput('')
    setNewPassword(''); setConfirmPassword(''); setForgotEmail('')
    setState(INITIAL_STATE)
    goScreen('sign-in')
  }, [goScreen])

  useEffect(() => {
    if (state.screen === 'forgot' && state.email && !forgotEmail) setForgotEmail(state.email)
  }, [state.screen, state.email, forgotEmail])

  const showBgArt = SCREENS_WITH_BG.includes(state.screen)

  const passwordsValid = isValidPassword(newPassword) && newPassword === confirmPassword

  // ──────────────────────────────────────────────────────────
  if (state.screen === 'Dashboard') {
    return <DashboardPage user={state.loggedInUser || { name: 'ผู้ใช้งานระบบ', email: state.email || '' } as any} onLogout={handleLogout} />
  }

  return (
    <div className="auth-bg">

      {showBgArt && (
        <div className="auth-bg-art">
          <img src={BG_LEFT} alt="" aria-hidden />
          <img src={BG_RIGHT} alt="" aria-hidden />
        </div>
      )}

      <div className="auth-container">
        <Card elevation="sm" className="auth-card">
          <CardBody>
            <div style={{ padding: 'clamp(var(--space-24), 5vw, var(--space-40))' }}>

          {/* ═══ SIGN-IN: email (+ email-dup error) ═══ */}
          {(state.screen === 'sign-in' || state.screen === 'sign-in-email-dup') && (
            <>
              <div className="auth-card-header">
                <SellsukiLogo size={80} />
                <h1 className="auth-title">ยินดีต้อนรับสู่ Sellsuki</h1>
                <p className="auth-subtitle">กรุณาล็อกอินเข้าสู่ระบบ</p>
              </div>

              <div className="auth-fields">
                {/* ✅ DSInput state="error" for duplicate email case */}
                <DSInput
                  label="อีเมล"
                  type="email"
                  size="lg"
                  placeholder="ระบุอีเมล"
                  value={emailInput}
                  onChange={e => {
                    setEmailInput(e.target.value)
                    if (state.screen === 'sign-in-email-dup')
                      setState(prev => ({ ...prev, screen: 'sign-in' }))
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleEmailNext()}
                  state={state.screen === 'sign-in-email-dup' ? 'error' : 'default'}
                  errorMessage={
                    state.screen === 'sign-in-email-dup'
                      ? 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น'
                      : undefined
                  }
                  fullWidth
                />
              </div>

              <div className="auth-actions">
                <DSButton
                  variant="primary" size="lg" fullWidth
                  disabled={!isValidEmail(emailInput)}
                  onClick={handleEmailNext}
                >
                  ต่อไป
                </DSButton>
                <p className="auth-subtitle" style={{ textAlign: 'center', fontSize: 14 }}>
                  ยังไม่มีบัญชีเข้าใช้งาน?{' '}
                  <a className="ds-link" onClick={() => {
                    if (isValidEmail(emailInput)) {
                      setState(prev => ({ ...prev, email: emailInput }))
                      setFirstNameInput(''); setLastNameInput('')
                      goScreen('sign-up')
                    }
                  }}>
                    สมัครบัญชีผู้ใช้ใหม่ที่นี่
                  </a>
                </p>
              </div>

              <div style={{ marginTop: 'var(--space-20)', marginBottom: 'var(--space-4)' }}>
                <Divider label="หรือ" />
              </div>

              <div className="auth-social-group" style={{ marginTop: 'var(--space-12)' }}>
                {SOCIAL_PROVIDERS.map(p => (
                  <SocialButton key={p} provider={p} onClick={handleSocialSignIn} />
                ))}
              </div>

              {/* ── Figma Disclaimer ── */}
              <p className="auth-footer-disclaimer" style={{ 
                marginTop: 'var(--space-24)', 
                fontSize: 10, 
                color: 'var(--text-disabled)', 
                textAlign: 'left',
                lineHeight: 1.6
              }}>
                การคลิก "เข้าสู่ระบบ" ข้างต้น แสดงว่าคุณได้อ่านและเข้าใจ และยินยอมตาม{' '}
                <a className="ds-link" style={{ fontSize: 10, color: 'inherit', textDecoration: 'underline' }}>นโยบายความเป็นส่วนตัว</a> และ{' '}
                <a className="ds-link" style={{ fontSize: 10, color: 'inherit', textDecoration: 'underline' }}>คุ้มครองข้อมูลส่วนบุคคล</a>
              </p>

              {/* DEV: trigger duplicate email demo */}
              <p style={{ marginTop: 'var(--space-16)', fontSize: 11, color: 'var(--text-disabled)', textAlign: 'center' }}>
                <a style={{ color: 'var(--text-disabled)', cursor: 'pointer', fontSize: 11 }}
                  onClick={() => setState(prev => ({ ...prev, screen: 'sign-in-email-dup' }))}>
                  [DEV: แสดง error อีเมลซ้ำ]
                </a>
              </p>
            </>
          )}

          {/* ═══ PASSWORD (normal + error) ═══ */}
          {(state.screen === 'password' || state.screen === 'password-error') && (
            <>
              <div className="auth-card-header">
                <SellsukiLogo size={80} />
                <h1 className="auth-title">ยินดีต้อนรับสู่ Sellsuki</h1>
                <Badge variant="secondary" size="md">{state.email}</Badge>
                <a className="ds-link" onClick={() => { setPasswordInput(''); goScreen('sign-in') }}>
                  ไม่ใช่บัญชีนี้ใช่ไหม? ใช้อีเมลอื่นแทน
                </a>
              </div>

              <div className="auth-fields">
                <div>
                  {/* ✅ DSInput: state="error" + errorMessage for wrong password */}
                  <DSInput
                    label="รหัสผ่าน"
                    type="password"
                    size="lg"
                    placeholder="ระบุรหัสผ่าน"
                    showPasswordToggle
                    value={passwordInput}
                    onChange={e => {
                      setPasswordInput(e.target.value)
                      if (state.screen === 'password-error')
                        setState(prev => ({ ...prev, screen: 'password' }))
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    state={state.screen === 'password-error' ? 'error' : 'default'}
                    errorMessage={
                      state.screen === 'password-error'
                        ? 'รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง'
                        : undefined
                    }
                    fullWidth
                  />
                  {/* ลืมรหัสผ่าน? — right-aligned (shown in both states) */}
                  <div className="auth-forgot-link">
                    <a className="ds-link" onClick={() => goScreen('forgot')}>
                      ลืมรหัสผ่าน?
                    </a>
                  </div>
                </div>
              </div>

              <div className="auth-actions">
                <DSButton
                  variant="primary" size="lg" fullWidth
                  disabled={passwordInput.length < 1}
                  onClick={handleLogin}
                >
                  เข้าสู่ระบบ
                </DSButton>
              </div>

              {/* DEV: trigger wrong password demo */}
              <p style={{ marginTop: 'var(--space-12)', fontSize: 11, color: 'var(--text-disabled)', textAlign: 'center' }}>
                <a style={{ color: 'var(--text-disabled)', cursor: 'pointer', fontSize: 11 }}
                  onClick={() => goScreen('password-error')}>
                  [DEV: แสดง error รหัสผ่านไม่ถูกต้อง]
                </a>
              </p>
            </>
          )}

          {/* ═══ SIGN-UP: name ═══ */}
          {state.screen === 'sign-up' && (
            <>
              <div className="auth-card-header">
                <SellsukiLogo size={80} />
                <h1 className="auth-title">สมัครสมาชิก Sellsuki</h1>
                <Badge variant="secondary" size="md">{state.email}</Badge>
                <a className="ds-link" onClick={() => goScreen('sign-in')}>
                  สมัครด้วยอีเมลอื่น
                </a>
              </div>

              <div className="auth-fields">
                <DSInput
                  label="ชื่อ" type="text" size="lg"
                  placeholder="ระบุชื่อ" required fullWidth
                  value={firstNameInput}
                  onChange={e => setFirstNameInput(e.target.value)}
                />
                <DSInput
                  label="นามสกุล" type="text" size="lg"
                  placeholder="ระบุนามสกุล" required fullWidth
                  value={lastNameInput}
                  onChange={e => setLastNameInput(e.target.value)}
                />
              </div>

              <div className="auth-actions">
                <DSButton
                  variant="primary" size="lg" fullWidth
                  disabled={!firstNameInput.trim() || !lastNameInput.trim()}
                  onClick={handleNameNext}
                >
                  ต่อไป
                </DSButton>
              </div>
            </>
          )}

          {/* ═══ SET-PASSWORD ═══ */}
          {state.screen === 'set-password' && (
            <>
              <div className="auth-card-header">
                <SellsukiLogo size={80} />
                <h1 className="auth-title">สมัครสมาชิก Sellsuki</h1>
                <Badge variant="secondary" size="md">{state.email}</Badge>
                <a className="ds-link" onClick={() => goScreen('sign-in')}>
                  สมัครด้วยอีเมลอื่น
                </a>
              </div>

              <div className="auth-fields">
                {/* ✅ DSInput: showPasswordToggle, inline validation */}
                <DSInput
                  label="ตั้งรหัสผ่าน" type="password" size="lg"
                  placeholder="ระบุรหัสผ่าน" showPasswordToggle required fullWidth
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  state={
                    newPassword.length > 0 && !isValidPassword(newPassword)
                      ? 'error' : 'default'
                  }
                  errorMessage={
                    newPassword.length > 0 && !isValidPassword(newPassword)
                      ? 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
                      : undefined
                  }
                />
                <DSInput
                  label="ยืนยันรหัสผ่าน" type="password" size="lg"
                  placeholder="ระบุรหัสผ่าน" showPasswordToggle required fullWidth
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  state={
                    confirmPassword.length > 0 && newPassword !== confirmPassword
                      ? 'error' : 'default'
                  }
                  errorMessage={
                    confirmPassword.length > 0 && newPassword !== confirmPassword
                      ? 'รหัสผ่านไม่ตรงกัน'
                      : undefined
                  }
                />
              </div>

              <div className="auth-actions">
                <DSButton
                  variant="primary" size="lg" fullWidth
                  disabled={!passwordsValid}
                  onClick={handleSetPasswordNext}
                >
                  ต่อไป
                </DSButton>
              </div>
            </>
          )}

          {/* ═══ VERIFY-EMAIL ═══ */}
          {state.screen === 'verify-email' && (
            <>
              <div className="verify-icon">
                <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                  <rect width="80" height="80" rx="40" fill="var(--bg-warning-light, #fffbeb)" />
                  <rect x="14" y="24" width="52" height="38" rx="4" fill="var(--bg-warning-solid)" />
                  <path d="M14 28L40 46L66 28" stroke="var(--text-white)" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="auth-card-header" style={{ marginBottom: 'var(--space-20)' }}>
                <h1 className="auth-title">กรุณายืนยันอีเมล</h1>
                <p className="auth-subtitle">ตรวจสอบอีเมลที่ถูกส่งไปที่</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-brand-primary)' }}>{state.email}</p>
                <p className="auth-subtitle">เพื่อยืนยันบัญชีของคุณและเริ่มต้นใช้งาน</p>
              </div>

              <div className="auth-actions">
                <DSButton
                  variant="primary" size="lg" fullWidth
                  disabled={resendActive}
                  onClick={startResendCountdown}
                >
                  {resendActive ? `ส่งอีกครั้ง (${resendSeconds}s)` : 'ส่งอีกครั้ง'}
                </DSButton>
              </div>

              <p style={{ marginTop: 'var(--space-12)', fontSize: 11, color: 'var(--text-disabled)', textAlign: 'center' }}>
                <a style={{ color: 'var(--text-disabled)', cursor: 'pointer', fontSize: 11 }}
                  onClick={() => goScreen('email-confirmed')}>
                  [DEV: จำลองยืนยันอีเมลสำเร็จ →]
                </a>
              </p>
            </>
          )}

          {/* ═══ EMAIL-CONFIRMED ═══ */}
          {state.screen === 'email-confirmed' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <SellsukiLogo size={80} />
              </div>

              <div className="auth-card-header" style={{ marginBottom: 'var(--space-24)' }}>
                <h1 className="auth-title">
                  ยินดีด้วย อีเมลของคุณได้รับ<br />การยืนยันแล้ว
                </h1>
                <p className="auth-subtitle">
                  อีเมล{' '}
                  <a className="ds-link" style={{ fontWeight: 600 }}>{state.email}</a>
                  <br />ของคุณได้รับการยืนยันแล้ว
                </p>
              </div>

              <div className="auth-actions">
                {/* ✅ Primary button — active (not disabled) */}
                <DSButton
                  variant="primary" size="lg" fullWidth
                  onClick={handleEmailConfirmedLogin}
                >
                  เข้าสู่ระบบ
                </DSButton>
              </div>
            </div>
          )}

          {/* ═══ FORGOT PASSWORD ═══ */}
          {state.screen === 'forgot' && (
            <>
              <button className="auth-back-btn" onClick={goBack}>
                <ArrowLeft size={18} />
              </button>

              <div className="auth-card-header">
                <SellsukiLogo size={80} />
                <h1 className="auth-title">ระบุอีเมลของคุณ</h1>
                <p className="auth-subtitle">
                  โปรดป้อนอีเมลของคุณ<br />เราจะส่งข้อมูลเพื่อรีเซ็ตรหัสผ่านให้
                </p>
              </div>

              <div className="auth-fields">
                <DSInput
                  label="อีเมล" type="email" size="lg"
                  placeholder="ระบุอีเมล" fullWidth
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleForgotSend()}
                />
              </div>

              <div className="auth-actions" style={{ marginTop: 'var(--space-16)' }}>
                <DSButton
                  variant="primary" size="lg" fullWidth
                  disabled={!isValidEmail(forgotEmail)}
                  onClick={handleForgotSend}
                >
                  รีเซ็ตรหัสผ่าน
                </DSButton>
              </div>
            </>
          )}

          {/* ═══ FORGOT-SENT ═══ */}
          {state.screen === 'forgot-sent' && (
            <div style={{ textAlign: 'center' }}>
              <div className="verify-icon" style={{ marginBottom: 16 }}>
                <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                  <rect width="80" height="80" rx="40" fill="var(--bg-success-light, #ecfdf5)" />
                  <path d="M22 40l12 12 24-28" stroke="var(--bg-success-solid)" strokeWidth="4"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="auth-card-header" style={{ marginBottom: 'var(--space-20)' }}>
                <h1 className="auth-title">ส่งอีเมลแล้ว!</h1>
                <p className="auth-subtitle">ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยัง</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-brand-primary)' }}>{forgotEmail}</p>
                <p className="auth-subtitle">กรุณาตรวจสอบกล่องอีเมล</p>
              </div>

              <div className="auth-actions">
                <DSButton variant="primary" size="lg" fullWidth onClick={() => goScreen('sign-in')}>
                  กลับหน้าเข้าสู่ระบบ
                </DSButton>
              </div>
              <p style={{ marginTop: 'var(--space-12)', fontSize: 14, color: 'var(--text-secondary)' }}>
                ไม่ได้รับอีเมล?{' '}
                <a className="ds-link" onClick={() => goScreen('forgot')}>ส่งอีกครั้ง</a>
              </p>
            </div>
          )}

          {/* ═══ SOCIAL-CB ═══ */}
          {state.screen === 'social-cb' && state.socialUser && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              กำลังเข้าสู่ระบบและโหลดหน้า Dashboard...
            </div>
          )}

          {/* Profile screen has been moved to DashboardPage early return */}

            </div>
          </CardBody>
        </Card>{/* /.auth-card */}


      </div>

      <ConfirmDialog
        open={showLogoutDialog}
        title="ต้องการออกจากระบบ?"
        description="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ คุณจะต้องเข้าสู่ระบบใหม่อีกครั้ง"
        onConfirm={handleLogout}
        onClose={() => setShowLogoutDialog(false)}
      />
    </div>
  )
}
