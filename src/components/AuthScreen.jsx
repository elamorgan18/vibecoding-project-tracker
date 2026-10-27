import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Eye, EyeOff, Info, LogIn, UserPlus } from 'lucide-react';
import {
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
  MIN_PASSWORD,
  ROLES,
  findAccount,
  hashPassword,
  normalizeEmail,
  validateLogin,
  validateSignUp,
} from '../data/auth.js';
import FormField, { inputBorder, inputClass } from './FormField.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const primaryButton =
  'flex w-full items-center justify-center gap-1.5 rounded bg-brand px-4 py-2 text-sm font-medium text-on-accent hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2';
const linkButton =
  'rounded font-medium text-brand hover:text-brand-hover hover:underline focus:outline-none focus:ring-2 focus:ring-brand';
const secondaryButton =
  'shrink-0 rounded border border-line bg-card px-3 py-2 text-sm font-medium text-ink hover:bg-muted-bg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2';

const NO_CRYPTO = "This browser can't hash passwords here. Open the app over https or on localhost.";

/** "There are 2 problems: …" for the live region. */
function errorSummary(errors, order) {
  const messages = order.filter((f) => errors[f]).map((f) => errors[f]);
  const count = messages.length === 1 ? 'There is 1 problem' : `There are ${messages.length} problems`;
  return `${count}: ${messages.join(' ')}`;
}

const describedBy = (...ids) => ids.filter(Boolean).join(' ') || undefined;

/** Password input with a show / hide toggle (aria-pressed = shown). */
function PasswordInput({ inputRef, id, error, describedById, ...props }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type={shown ? 'text' : 'password'}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedById}
        className={`${inputClass} ${inputBorder(error)} pr-11`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label="Show password"
        aria-pressed={shown}
        title={shown ? 'Hide password' : 'Show password'}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-ink-soft hover:bg-muted-bg hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand"
      >
        {shown ? <EyeOff aria-hidden="true" className="h-5 w-5" /> : <Eye aria-hidden="true" className="h-5 w-5" />}
      </button>
    </div>
  );
}

function LoginView({ accounts, onLogin, onGuest, onSwitch, announce }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  // Wrong email or password: one message, shown under the password field.
  const [failed, setFailed] = useState(null);
  const [busy, setBusy] = useState(false);
  const refs = { email: useRef(null), password: useRef(null) };
  const submitRef = useRef(null);

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((errs) => ({ ...errs, [field]: undefined }));
      setFailed(null);
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    const found = validateLogin(form);
    setErrors(found);
    setFailed(null);
    const first = ['email', 'password'].find((f) => found[f]);
    if (first) {
      refs[first].current?.focus();
      announce(errorSummary(found, ['email', 'password']));
      return;
    }
    setBusy(true);
    try {
      const account = await findAccount(accounts, form.email, form.password);
      if (account) {
        onLogin(account);
        return;
      }
      setFailed('Email or password is incorrect.');
      announce('Email or password is incorrect.');
    } catch {
      setFailed(NO_CRYPTO);
      announce(NO_CRYPTO);
    } finally {
      setBusy(false);
    }
    refs.email.current?.focus();
  }

  function fillDemo(account) {
    const role = ROLES[account.role].label;
    setForm({ email: account.email, password: DEMO_PASSWORD });
    setErrors({});
    setFailed(null);
    submitRef.current?.focus();
    announce(`${role} demo details filled in.`);
  }

  const failedId = failed ? 'login-failed' : null;

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField id="login-email" label="Email" error={errors.email} alertError={false}>
          <input
            ref={refs.email}
            id="login-email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            value={form.email}
            onChange={update('email')}
            aria-invalid={errors.email || failed ? 'true' : undefined}
            aria-describedby={describedBy(errors.email && 'login-email-error', failedId)}
            className={`${inputClass} ${inputBorder(errors.email || failed)}`}
          />
        </FormField>
        <div>
          <FormField id="login-password" label="Password" error={errors.password} alertError={false}>
            <PasswordInput
              inputRef={refs.password}
              id="login-password"
              autoComplete="current-password"
              value={form.password}
              onChange={update('password')}
              error={errors.password || failed}
              describedById={describedBy(errors.password && 'login-password-error', failedId)}
            />
          </FormField>
          {failed && (
            <p id="login-failed" className="mt-1 flex items-start gap-1 text-sm text-danger-text">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {failed}
            </p>
          )}
        </div>
        <button ref={submitRef} type="submit" className={primaryButton}>
          <LogIn aria-hidden="true" className="h-4 w-4" />
          Log in
        </button>
        <p className="text-center text-sm text-ink-soft">
          No account yet?{' '}
          <button type="button" onClick={onSwitch} className={linkButton}>
            Sign up
          </button>
        </p>
      </form>

      <DemoAccounts onUse={fillDemo} onGuest={onGuest} />
    </>
  );
}

/** Subtle info panel (brand-soft, like the suggested AI tool note) with the demo logins. */
function DemoAccounts({ onUse, onGuest }) {
  return (
    <section aria-labelledby="demo-heading" className="mt-6 rounded border border-brand/40 bg-brand-soft p-4">
      <h2 id="demo-heading" className="flex items-start gap-2 text-base font-semibold text-ink">
        <Info aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-brand" />
        Trying the prototype? Use a demo account
      </h2>
      <ul className="mt-3 space-y-3">
        {DEMO_ACCOUNTS.map((account) => {
          const role = ROLES[account.role].label;
          return (
            <li key={account.email} className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{role}</p>
                <dl className="mt-0.5 grid grid-cols-[auto_1fr] gap-x-2 text-sm">
                  <dt className="text-ink-soft">Email</dt>
                  <dd className="select-text font-mono text-ink">{account.email}</dd>
                  <dt className="text-ink-soft">Password</dt>
                  <dd className="select-text font-mono text-ink">{DEMO_PASSWORD}</dd>
                </dl>
              </div>
              {/* The name starts with the visible text (WCAG 2.5.3 label in name). */}
              <button
                type="button"
                onClick={() => onUse(account)}
                aria-label={`Use this account: ${role} demo account`}
                className={secondaryButton}
              >
                Use this account
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-ink-soft">Team leads can also manage team members and deliverable links.</p>
      <div className="mt-3 border-t border-brand/30 pt-3 text-sm text-ink-soft">
        <button type="button" onClick={onGuest} className={linkButton}>
          Continue as guest
        </button>{' '}
        to use the whole board without an account.
      </div>
    </section>
  );
}

const SIGN_UP_FIELDS = ['name', 'email', 'password'];

function SignUpView({ accounts, onSignUp, onSwitch, announce }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'developer' });
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState(null);
  const [busy, setBusy] = useState(false);
  const refs = { name: useRef(null), email: useRef(null), password: useRef(null) };

  function update(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((errs) => ({ ...errs, [field]: undefined }));
      setFailed(null);
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (busy) return;
    const found = validateSignUp(form, accounts);
    setErrors(found);
    const first = SIGN_UP_FIELDS.find((f) => found[f]);
    if (first) {
      refs[first].current?.focus();
      announce(errorSummary(found, SIGN_UP_FIELDS));
      return;
    }
    setBusy(true);
    try {
      const passwordHash = await hashPassword(form.email, form.password);
      onSignUp({ name: form.name.trim(), email: normalizeEmail(form.email), role: form.role, passwordHash });
    } catch {
      setFailed(NO_CRYPTO);
      announce(NO_CRYPTO);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="signup-name" label="Name" error={errors.name} alertError={false}>
        <input
          ref={refs.name}
          id="signup-name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'signup-name-error' : undefined}
          className={`${inputClass} ${inputBorder(errors.name)}`}
        />
      </FormField>
      <FormField id="signup-email" label="Email" error={errors.email} alertError={false}>
        <input
          ref={refs.email}
          id="signup-email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          value={form.email}
          onChange={update('email')}
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'signup-email-error' : undefined}
          className={`${inputClass} ${inputBorder(errors.email)}`}
        />
      </FormField>
      <div>
        <FormField id="signup-password" label="Password" error={errors.password} alertError={false}>
          <PasswordInput
            inputRef={refs.password}
            id="signup-password"
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            describedById={errors.password ? 'signup-password-error' : 'signup-password-hint'}
          />
        </FormField>
        {/* The error says the same thing, so the hint steps aside while it shows. */}
        {!errors.password && (
          <p id="signup-password-hint" className="mt-1 text-sm text-ink-soft">
            At least {MIN_PASSWORD} characters.
          </p>
        )}
      </div>
      <div>
        <FormField id="signup-role" label="Role">
          <select
            id="signup-role"
            value={form.role}
            onChange={update('role')}
            aria-describedby="signup-role-hint"
            className={`${inputClass} ${inputBorder(false)}`}
          >
            <option value="developer">{ROLES.developer.label}</option>
            <option value="lead">{ROLES.lead.label}</option>
          </select>
        </FormField>
        <p id="signup-role-hint" className="mt-1 text-sm text-ink-soft">
          Team leads can also manage team members and deliverable links.
        </p>
      </div>
      {failed && (
        <p className="flex items-start gap-1 text-sm text-danger-text">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {failed}
        </p>
      )}
      <button type="submit" className={primaryButton}>
        <UserPlus aria-hidden="true" className="h-4 w-4" />
        Create account
      </button>
      <p className="text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className={linkButton}>
          Log in
        </button>
      </p>
    </form>
  );
}

const SCREENS = {
  login: { title: 'Log in', intro: 'Track your vibecoding tasks and the prompts behind them.' },
  signup: { title: 'Create an account', intro: "You'll join the demo team as a new member." },
};

/**
 * Mock login / sign-up screen (prototype, see auth.js), shown when no one is
 * logged in. Same wordmark, card, input and button styles as the board.
 * Focus goes to the card's heading when the screen opens and when switching
 * between Log in and Sign up.
 */
export default function AuthScreen({ accounts, onLogin, onSignUp, onGuest, announce, isDark, onToggleTheme }) {
  const [mode, setMode] = useState('login');
  const headingRef = useRef(null);
  const screen = SCREENS[mode];

  useEffect(() => {
    document.title = `${mode === 'login' ? 'Log in' : 'Sign up'} – Vibecoding Project Tracker`;
    headingRef.current?.focus();
  }, [mode]);

  return (
    <>
      <header>
        <div className="flex justify-end">
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
        <p className="mt-2 flex items-center justify-center gap-2 text-2xl font-semibold text-ink">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand" />
          Vibecoding Project Tracker
        </p>
      </header>
      <div className="mx-auto w-full max-w-md pb-6">
        <main id="main" className="mt-6">
          <div className="rounded border border-line bg-card p-6">
            <h1 ref={headingRef} tabIndex={-1} className="text-lg font-semibold text-ink focus:outline-none">
              {screen.title}
            </h1>
            <p className="mb-5 mt-1 text-sm text-ink-soft">{screen.intro}</p>
            {mode === 'login' ? (
              <LoginView
                accounts={accounts}
                onLogin={onLogin}
                onGuest={onGuest}
                onSwitch={() => setMode('signup')}
                announce={announce}
              />
            ) : (
              <SignUpView
                accounts={accounts}
                onSignUp={onSignUp}
                onSwitch={() => setMode('login')}
                announce={announce}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
