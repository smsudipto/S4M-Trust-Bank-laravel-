const STORAGE_KEY = 'bank-management-state'
const initialState = { accountHolder: 'Sudipto Mandal', accountNumber: '•••• 4829', balance: 0, transactions: [] }

const icons = {
  menu: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  card: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>',
  chart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 5-7"/></svg>',
  list: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  down: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 7 7 17M7 7v10h10"/></svg>',
  up: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 17 10-10M17 17V7H7"/></svg>',
  trendUp: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
  trendDown: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 7 6 6 4-4 8 8"/><path d="M15 17h6v-6"/></svg>',
  shield: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  alert: '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
  clipboard: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 9h6M9 13h6M9 17h3"/></svg>',
  help: '<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-.9.7-1.6 1.1-1.6 2.6M12 17h.01"/></svg>',
}

function isValidState(value) {
  return value && typeof value === 'object' && typeof value.balance === 'number' && Array.isArray(value.transactions) &&
    value.transactions.every((item) => item && typeof item.id === 'string' && (item.type === 'deposit' || item.type === 'withdrawal') &&
      Number.isSafeInteger(item.amount) && item.amount > 0 && typeof item.createdAt === 'string')
}

function getState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return structuredClone(initialState)
    const parsed = JSON.parse(stored)
    if (!isValidState(parsed)) return structuredClone(initialState)
    const transactions = parsed.transactions.filter((transaction) => !transaction.id.startsWith('initial-'))
    return { ...initialState, transactions, balance: transactions.reduce((sum, item) => sum + (item.type === 'deposit' ? item.amount : -item.amount), 0) }
  } catch {
    return structuredClone(initialState)
  }
}

let state = getState()
let menuOpen = false

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
function formatCurrency(minorUnits) { return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 2 }).format(minorUnits / 100) }
function formatDate(date) { return new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) }
function parseAmount(value) {
  const normalized = value.trim()
  if (!normalized) return { error: 'Please enter an amount.' }
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return { error: 'Enter a valid amount with up to 2 decimal places.' }
  const amount = Math.round(Number(normalized) * 100)
  if (!Number.isSafeInteger(amount) || amount <= 0) return { error: 'Enter an amount greater than zero.' }
  return { amount }
}
function link(path, content, className = '') { return `<a href="${path}" class="${className}" data-route>${content}</a>` }
function transactionList(transactions) {
  if (!transactions.length) return `<div class="empty-state">${icons.clipboard}<p>No transactions yet. Your activity will appear here.</p></div>`
  return `<div class="transaction-list">${transactions.map((item) => {
    const deposit = item.type === 'deposit'
    return `<div class="transaction-row"><div class="transaction-leading"><div class="transaction-icon ${deposit ? 'deposit' : 'withdraw'}">${deposit ? icons.down : icons.up}</div><div><div class="transaction-name">${deposit ? 'Deposit' : 'Withdrawal'}</div><div class="transaction-date">${formatDate(item.createdAt)}</div></div></div><span class="transaction-amount ${deposit ? 'deposit' : 'withdraw'}">${deposit ? '+' : '-'}${formatCurrency(item.amount)}</span></div>`
  }).join('')}</div>`
}
function pageHeading(eyebrow, title, description) { return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="page-description">${description}</p></div></div>` }
function balanceCard() { return `<div class="balance-card"><span class="balance-label">Available balance</span><div class="balance-amount">${formatCurrency(state.balance)}</div><span class="account-number">Account number <strong>${state.accountNumber}</strong></span></div>` }
function amountForm(type) {
  const deposit = type === 'deposit'
  return `<form data-amount-form="${type}" novalidate><div class="feedback success d-none" data-success role="status">${icons.check} <span></span></div><div class="feedback error d-none" data-error role="alert"></div><label class="amount-label" for="${type}-amount">Amount</label><div class="amount-input-wrap"><span class="currency-prefix">৳</span><input class="amount-input" id="${type}-amount" inputmode="decimal" placeholder="0.00" data-amount-input aria-describedby="${type}-note" /></div><p class="form-note" id="${type}-note">Enter an amount in BDT, up to 2 decimal places.</p><button class="submit-button" type="submit" data-submit>Confirm ${deposit ? 'deposit' : 'withdrawal'}</button></form>`
}

function renderDashboard() {
  const deposited = state.transactions.filter((item) => item.type === 'deposit').reduce((sum, item) => sum + item.amount, 0)
  const withdrawn = state.transactions.filter((item) => item.type === 'withdrawal').reduce((sum, item) => sum + item.amount, 0)
  return `<div class="page-content container-fluid">${pageHeading(`Good morning, ${state.accountHolder.split(' ')[0]}`, 'Your financial overview', 'Keep track of your money and manage your account with ease.')}<div class="dashboard-grid"><div>${balanceCard()}<div class="metric-grid"><div class="card metric-card"><div class="metric-icon deposit">${icons.trendUp}</div><div><div class="metric-label">Total deposited</div><div class="metric-value">${formatCurrency(deposited)}</div></div></div><div class="card metric-card"><div class="metric-icon withdraw">${icons.trendDown}</div><div><div class="metric-label">Total withdrawn</div><div class="metric-value">${formatCurrency(withdrawn)}</div></div></div></div></div><div class="card"><div class="card-heading"><h2 class="card-title">Quick actions</h2></div><div class="shortcuts">${link('/deposit', `${icons.down} Deposit`, 'shortcut deposit')}${link('/withdraw', `${icons.up} Withdraw`, 'shortcut withdraw')}</div><div class="card-heading" style="margin-top:32px"><h2 class="card-title">Account status</h2></div><p class="page-description">Your S4M Trust Bank account is active and ready for everyday banking.</p></div></div><div class="card" style="margin-top:20px"><div class="card-heading"><h2 class="card-title">Recent activity</h2>${link('/transactions', 'View all', 'text-link')}</div>${transactionList(state.transactions.slice(0, 4))}</div></div>`
}
function renderTransfer(type) {
  const deposit = type === 'deposit'
  return `<div class="page-content container-fluid">${pageHeading('Move money', `${deposit ? 'Deposit' : 'Withdraw'} money`, deposit ? 'Add funds to your S4M Trust Bank account securely.' : 'Take out funds from your available account balance.')}<div class="form-layout"><div class="card form-card"><div class="metric-icon ${deposit ? 'deposit' : 'withdraw'}">${deposit ? icons.down : icons.up}</div><h2 style="margin-top:18px">${deposit ? 'Add to your balance' : 'Withdraw from balance'}</h2><p>${deposit ? 'Enter the amount you would like to deposit. Your balance and activity will update instantly.' : 'Enter an amount and review it before confirming the withdrawal.'}</p>${!deposit ? '<div class="feedback success d-none" data-withdraw-success role="status"></div><div class="feedback error d-none" data-withdraw-error role="alert"></div>' : ''}${amountForm(type)}</div><div class="card info-card">${deposit ? icons.shield : icons.alert}<h3>${deposit ? 'Safe and simple' : 'Available balance'}</h3>${deposit ? '<p>This is a simulated banking environment for demonstration purposes.</p><ul><li>Amounts are stored in BDT.</li><li>Transactions are saved locally.</li><li>All activity is shown in your history.</li></ul>' : `<div style="font-family:'Space Grotesk';font-size:24px;margin:14px 0">${formatCurrency(state.balance)}</div><p>Withdrawals cannot exceed your current balance.</p>`}</div></div></div>`
}
function renderTransactions() {
  return `<div class="page-content container-fluid">${pageHeading('Your activity', 'Transaction history', 'Review every deposit and withdrawal from your account.')}<div class="card history-card"><div class="history-header"><h2 class="card-title">All transactions</h2><span class="history-count">${state.transactions.length} ${state.transactions.length === 1 ? 'transaction' : 'transactions'}</span></div><div class="history-list">${transactionList(state.transactions)}</div></div></div>`
}
function renderNotFound() { return `<div class="page-content container-fluid"><div class="not-found">${icons.help}<h2>Page not found</h2><p>The page you are looking for does not exist or may have moved.</p>${link('/', 'Back to dashboard', 'submit-button')}</div></div>` }
function render() {
  const path = window.location.pathname
  let content = path === '/' ? renderDashboard() : path === '/deposit' ? renderTransfer('deposit') : path === '/withdraw' ? renderTransfer('withdrawal') : path === '/transactions' ? renderTransactions() : renderNotFound()
  document.querySelector('#root').innerHTML = `<div class="app-shell"><aside class="sidebar ${menuOpen ? 'open' : ''}"><div class="brand"><div class="brand-mark">N</div><div><span class="brand-name">S4M Trust Bank</span><span class="brand-subtitle">PERSONAL BANKING</span></div><button class="mobile-menu" data-close-menu aria-label="Close navigation">${icons.close}</button></div><span class="nav-label">Menu</span><nav class="nav-list" aria-label="Main navigation">${[['/', 'Dashboard', 'dashboard'], ['/deposit', 'Deposit money', 'card'], ['/withdraw', 'Withdraw money', 'chart'], ['/transactions', 'Transaction history', 'list']].map(([to, label, icon]) => link(to, `${icons[icon]}<span>${label}</span>`, `nav-link ${window.location.pathname === to ? 'active' : ''}`)).join('')}</nav><div class="sidebar-footer">Your finances, simplified.<br />Securely managed for you.</div></aside><div class="main-area"><header class="topbar"><button class="mobile-menu" data-open-menu aria-label="Open navigation">${icons.menu}</button><span class="topbar-title">Personal banking overview</span><div class="profile"><div class="avatar">${state.accountHolder.split(' ').map((part) => part[0]).join('')}</div><div><span class="profile-name">${state.accountHolder}</span><span class="profile-role">Premium account</span></div></div></header><main>${content}</main></div></div>`
  bindEvents()
}
function show(element, message) { element.textContent = message; element.classList.remove('d-none') }
function hide(element) { element.classList.add('d-none') }
function addTransaction(type, amount) {
  state.transactions.unshift({ id: crypto.randomUUID(), type, amount, createdAt: new Date().toISOString() })
  state.balance += type === 'deposit' ? amount : -amount
  saveState()
}
function bindEvents() {
  document.querySelectorAll('[data-route]').forEach((anchor) => anchor.addEventListener('click', (event) => {
    event.preventDefault()
    history.pushState({}, '', anchor.getAttribute('href'))
    menuOpen = false
    render()
  }))
  document.querySelector('[data-open-menu]')?.addEventListener('click', () => { menuOpen = true; render() })
  document.querySelector('[data-close-menu]')?.addEventListener('click', () => { menuOpen = false; render() })
  const form = document.querySelector('[data-amount-form]')
  if (!form) return
  const type = form.dataset.amountForm
  const input = form.querySelector('[data-amount-input]')
  const error = form.querySelector('[data-error]')
  const success = form.querySelector('[data-success]')
  input.focus()
  input.addEventListener('input', () => { hide(error); hide(success); document.querySelector('[data-withdraw-error]')?.classList.add('d-none') })
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const result = parseAmount(input.value)
    if (result.error) { show(error, result.error); return }
    if (type === 'withdrawal' && result.amount > state.balance) {
      show(document.querySelector('[data-withdraw-error]'), `Insufficient balance. You can withdraw up to ${formatCurrency(state.balance)}.`)
      return
    }
    if (type === 'withdrawal') {
      showConfirm(result.amount)
      return
    }
    addTransaction('deposit', result.amount)
    input.value = ''
    success.querySelector('span').textContent = 'Deposit completed successfully.'
    show(success, success.textContent)
  })
}
function showConfirm(amount) {
  const backdrop = document.createElement('div')
  backdrop.className = 'confirm-backdrop'
  backdrop.innerHTML = `<div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">Confirm withdrawal</h2><p>Please confirm that you want to withdraw the following amount from your account.</p><div class="confirm-amount">${formatCurrency(amount)}</div><div class="dialog-actions"><button class="cancel-button" data-cancel>Cancel</button><button class="submit-button" data-confirm>Confirm withdrawal</button></div></div>`
  document.body.appendChild(backdrop)
  backdrop.querySelector('[data-cancel]').addEventListener('click', () => backdrop.remove())
  backdrop.querySelector('[data-confirm]').addEventListener('click', () => { addTransaction('withdrawal', amount); backdrop.remove(); render(); show(document.querySelector('[data-withdraw-success]'), 'Withdrawal completed successfully.') })
}
window.addEventListener('popstate', render)
render()
