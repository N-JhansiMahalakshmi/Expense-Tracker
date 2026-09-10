import { useEffect, useMemo, useState } from 'react'
import './App.css'

import Home from './Home'
import About from './About'
import Contact from './Contact'
import Footer from './Footer.jsx'
import {
  getExpenses,
  createExpense,
  updateExpense,
   deleteExpense,
  getCategories,
  loginUser,
  registerUser,
  getFinancialProfile,
  updateFinancialProfile,
} from './api.js'

function App() {
  // =========================
  // STATE
  // =========================

  const [currentUser, setCurrentUser] = useState(null)
  const [page, setPage] = useState('home')
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
const [filterCategory, setFilterCategory] = useState('all')

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login / Register
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  // Financial Profile
  const [financialProfile, setFinancialProfile] = useState(null)
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [savingsGoal, setSavingsGoal] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // =========================
  // RESTORE LOGIN
  // =========================

 useEffect(() => {
  const savedUser = localStorage.getItem(
    'expense-tracker-user'
  )

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)

      setCurrentUser(user)
      // setPage('dashboard')

    } catch {
      localStorage.removeItem(
        'expense-tracker-user'
      )
      localStorage.removeItem('token')

      setCurrentUser(null)
    }
  }
}, [])

  // =========================
  // LOAD CATEGORIES
  // =========================

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()

        setCategories(data)

        if (data.length > 0) {
          setCategoryId(data[0].id)
        }
      } catch (err) {
        setError(err.message)
      }
    }

    loadCategories()
  }, [])

  // =========================
  // LOAD EXPENSES
  // =========================

  useEffect(() => {
    if (!currentUser) return

    async function loadExpenses() {
      try {
        setLoading(true)
        setError('')

        const data = await getExpenses()

        const userExpenses = data.filter(
          expense =>
            Number(expense.userId) ===
            Number(currentUser.id)
        )

        setExpenses(userExpenses)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [currentUser])

  // =========================
  // LOAD FINANCIAL PROFILE
  // =========================

  useEffect(() => {
    if (!currentUser) return

    async function loadFinancialProfile() {
      try {
        const data = await getFinancialProfile(
          // currentUser.id
        )

        setFinancialProfile(data)

        setMonthlyIncome(
          data.monthlyIncome ?? ''
        )

        setSavingsGoal(
          data.savingsGoal ?? ''
        )
      } catch (err) {
        setError(err.message)
      }
    }

    loadFinancialProfile()
  }, [currentUser])

  // =========================
  // LOGIN
  // =========================

  async function handleLogin(event) {
  event.preventDefault()

  setError('')

  if (!username.trim() || !password) {
    setError(
      'Please enter username and password.'
    )
    return
  }

  try {
    setLoading(true)

    const user = await loginUser(
      username.trim(),
      password
    )

       // SAVE USER
    localStorage.setItem(
      'expense-tracker-user',
      JSON.stringify(user)
    )

    // SAVE JWT
    localStorage.setItem(
      'token',
      user.token
    )

    setCurrentUser(user)
    setPage('dashboard')

    setUsername('')
    setPassword('')

  } catch (err) {
    setError(err.message)

  } finally {
    setLoading(false)
  }
}

  // =========================
  // REGISTER
  // =========================

 async function handleRegister(event) {
  event.preventDefault()

  setError('')

  if (
    !username.trim() ||
    !email.trim() ||
    !password
  ) {
    setError(
      'Please enter username, email and password.'
    )
    return
  }

  try {
    setLoading(true)

    await registerUser(
      username.trim(),
      email.trim(),
      password
    )

    // Registration successful.
    // User must login to receive JWT token.

    setUsername('')
    setEmail('')
    setPassword('')

    setIsRegister(false)

    setError('Account created successfully. Please login.')

  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem(
      'expense-tracker-user'
    )

    setCurrentUser(null)
    setPage('home')
    setExpenses([])

    setFinancialProfile(null)
    setMonthlyIncome('')
    setSavingsGoal('')

    setEditingId(null)
    setDescription('')
    setAmount('')
    setCategoryId('')

    setError('')
    setPage('home')
  }

  // =========================
  // CREATE / UPDATE EXPENSE
  // =========================

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!description.trim()) {
      setError(
        'Please enter what the expense was for.'
      )
      return
    }

    if (!amount || Number(amount) <= 0) {
      setError(
        'Please enter an amount greater than zero.'
      )
      return
    }

    if (!categoryId) {
      setError('Please select a category.')
      return
    }

    if (!currentUser) {  // if (!currentUser && page === 'home')
      setError('Please login again.')
      return
    }

    try {
      setLoading(true)

      const expenseData = {
  categoryId: Number(categoryId),
  description: description.trim(),
  amount: Number(amount),
  expenseDate: new Date().toISOString(),
}

      // UPDATE
      if (editingId !== null) {
        const updatedExpense =
          await updateExpense(
            editingId,
            expenseData
          )

        setExpenses(current =>
          current.map(expense =>
            Number(expense.id) ===
            Number(editingId)
              ? updatedExpense
              : expense
          )
        )

        setEditingId(null)
      }

      // CREATE
      else {
        const newExpense =
          await createExpense(expenseData)

        setExpenses(current => [
          newExpense,
          ...current,
        ])
      }

      setDescription('')
      setAmount('')

      if (categories.length > 0) {
        setCategoryId(categories[0].id)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // EDIT EXPENSE
  // =========================

  function handleEdit(expense) {
    setEditingId(expense.id)

    setDescription(
      expense.description
    )

    setAmount(
      expense.amount
    )

    setCategoryId(
      expense.categoryId
    )

    setError('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
async function handleDelete(expenseId) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this expense?'
  )

  if (!confirmed) return

  try {
    setLoading(true)
    setError('')

    await deleteExpense(expenseId)

    setExpenses(current =>
      current.filter(
        expense =>
          Number(expense.id) !== Number(expenseId)
      )
    )
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
// =========================
// FILTER EXPENSES
// =========================

const filteredExpenses = expenses.filter(expense => {
  const search = searchTerm.toLowerCase().trim()

  const matchesSearch =
    expense.description
      ?.toLowerCase()
      .includes(search) ||
    expense.categoryName
      ?.toLowerCase()
      .includes(search)

  const matchesCategory =
    filterCategory === 'all' ||
    expense.categoryId === Number(filterCategory)

  return matchesSearch && matchesCategory
})
  // =========================
  // CANCEL EDIT
  // =========================

  function cancelEdit() {
    setEditingId(null)

    setDescription('')
    setAmount('')

    if (categories.length > 0) {
      setCategoryId(categories[0].id)
    }

    setError('')
  }

  // =========================
  // SAVE FINANCIAL PROFILE
  // =========================

  async function handleFinancialProfileSubmit(
    event
  ) {
    event.preventDefault()

    setError('')

    const income = Number(monthlyIncome)
    const savings = Number(savingsGoal)

    if (income < 0) {
      setError(
        'Monthly income cannot be negative.'
      )
      return
    }

    if (savings < 0) {
      setError(
        'Savings goal cannot be negative.'
      )
      return
    }

    if (savings > income) {
      setError(
        'Savings goal cannot be greater than monthly income.'
      )
      return
    }

    try {
      setSavingProfile(true)

      const updatedProfile =
        await updateFinancialProfile({
          // userId: Number(currentUser.id),
          monthlyIncome: income,
          savingsGoal: savings,
        })

      setFinancialProfile(
        updatedProfile
      )

      setMonthlyIncome(
        updatedProfile.monthlyIncome
      )

      setSavingsGoal(
        updatedProfile.savingsGoal
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  // =========================
// DASHBOARD CALCULATIONS
// =========================

const totalSpent = useMemo(() => {
  return expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  )
}, [expenses])

const currentMonthSpent = useMemo(() => {
  const now = new Date()

  return expenses
    .filter(expense => {
      const date = new Date(expense.expenseDate)

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    })
    .reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    )
}, [expenses])

const categoryTotals = useMemo(() => {
  const totals = {}

  expenses.forEach(expense => {
    const category =
      expense.categoryName ||
      categories.find(
        c =>
          Number(c.id) ===
          Number(expense.categoryId)
      )?.name ||
      'Other'

    totals[category] =
      (totals[category] || 0) +
      Number(expense.amount || 0)
  })

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
}, [expenses, categories])

const averageExpense =
  expenses.length > 0
    ? totalSpent / expenses.length
    : 0

const largestExpense =
  expenses.length > 0
    ? Math.max(
        ...expenses.map(e =>
          Number(e.amount || 0)
        )
      )
    : 0

// =========================
// FINANCIAL CALCULATIONS
// =========================

const income = Number(monthlyIncome || 0)
const savings = Number(savingsGoal || 0)

// Amount available to spend after planned savings
const plannedSpending =
  income - savings

// Amount left from the spending budget
const remainingBudget =
  plannedSpending - currentMonthSpent

// Budget usage percentage
const budgetProgress =
  plannedSpending > 0
    ? (currentMonthSpent / plannedSpending) * 100
    : 0

// Keep progress bar between 0 and 100
const safeBudgetProgress = Math.min(
  Math.max(budgetProgress, 0),
  100
)

// Savings progress
const savingsProgress =
  income > 0
    ? (savings / income) * 100
    : 0

const safeSavingsProgress = Math.min(
  Math.max(savingsProgress, 0),
  100
)

// Overspending status
const isOverspending =
  plannedSpending > 0 &&
  currentMonthSpent > plannedSpending

const remainingAfterSavings =
  income - savings

const remainingAfterExpenses =
  income - currentMonthSpent
// =========================
// PUBLIC HOME
// =========================

if (!currentUser && page === 'home') {
  return (
    <div className="app">
<header className="public-header">

  <button
    className="logo-button"
    onClick={() => setPage('home')}
  >
    <img
      src="/logo.png"
      alt="Paisa Dairy"
      className="public-logo"
    />

    <span className="logo-text">
      <strong>Paisa Dairy</strong>
      <small>Personal Expense Tracker</small>
    </span>
  </button>


  <nav className="public-nav">

    <button onClick={() => setPage('home')}>
      Home
    </button>

    <button onClick={() => setPage('about')}>
      About
    </button>

    <button onClick={() => setPage('contact')}>
      Contact
    </button>


    {/* DASHBOARD */}

    <button
      onClick={() => {

        if (currentUser) {
          setPage('dashboard')
        } else {
          setIsRegister(false)
          setError('Please login to access your dashboard.')
          setPage('login')
        }

      }}
    >
      Dashboard
    </button>


    {/* LOGIN / USER */}

    {currentUser ? (

      <button
        className="nav-login"
        onClick={() => setPage('dashboard')}
      >
        My Dashboard
      </button>

    ) : (

      <button
        className="nav-login"
        onClick={() => {
          setIsRegister(false)
          setError('')
          setPage('login')
        }}
      >
        Login
      </button>

    )}

  </nav>

</header>

      <Home
        onLogin={() => setPage('login')}
        onGetStarted={() => setPage('login')}
      />
<Footer />
    </div>
  )
}

// =========================
// PUBLIC ABOUT
// =========================

if (!currentUser && page === 'about') {
  return (
    <div className="app">

      <header className="public-header">

        <button
          className="logo-button"
          onClick={() => setPage('home')}
        >
          <img 
          src="/logo.png" alt="Paisa Dairy Logo" 
          className="nav-logo" />

          <span className="logo-text">
            <strong>Paisa Dairy</strong>
            <small>Personal Expense Tracker</small>
          </span>
        </button>

        <nav className="public-nav">

          <button onClick={() => setPage('home')}>
            Home
          </button>

          <button onClick={() => setPage('about')}>
            About
          </button>

          <button onClick={() => setPage('contact')}>
            Contact
          </button>

          <button
            className="nav-login"
            onClick={() => setPage('login')}
          >
            Login
          </button>

        </nav>

      </header>

      <About />
<Footer />
    </div>
  )
}

// =========================
// PUBLIC CONTACT
// =========================

if (!currentUser && page === 'contact') {
  return (
    <div className="app">

      <header className="public-header">

        <button
          className="logo-button"
          onClick={() => setPage('home')}
        >
          <img 
          src="/logo.png" alt="Paisa Dairy Logo" 
          className="nav-logo" />

          <span className="logo-text">
            <strong>Paisa Dairy</strong>
            <small>Personal Expense Tracker</small>
          </span>
        </button>

        <nav className="public-nav">

          <button onClick={() => setPage('home')}>
            Home
          </button>

          <button onClick={() => setPage('about')}>
            About
          </button>

          <button onClick={() => setPage('contact')}>
            Contact
          </button>

          <button
            className="nav-login"
            onClick={() => setPage('login')}
          >
            Login
          </button>

        </nav>

      </header>

      <Contact />
      <Footer />

    </div>
  )
}


  // =========================
  // LOGIN SCREEN
  // =========================

 if (!currentUser && page === 'login') {
  return (
    <div className="app">

      {/* PUBLIC NAVBAR */}

      <header className="public-header">

        <button
          className="logo-button"
          onClick={() => setPage('home')}
        >
          <img 
          src="/logo.png" alt="Paisa Dairy Logo" 
          className="nav-logo" />

          <span className="logo-text">
            <strong>Paisa Dairy</strong>
            <small>Personal Expense Tracker</small>
          </span>
        </button>

        <nav className="public-nav">

          <button onClick={() => setPage('home')}>
            Home
          </button>

          <button onClick={() => setPage('about')}>
            About
          </button>

          <button onClick={() => setPage('contact')}>
            Contact
          </button>
<button
  className="nav-login"
  onClick={() => setIsRegister(false)}
>
  Login
</button>
          {/* <button
            className="nav-login"
            onClick={() => setPage('login')}
          >
            Login
          </button> */}

        </nav>

      </header>

        <main className="login-container">
          <section className="card login-card">

            <div className="brand">
              <div className="brand-icon">
                <img
                src="/logo.png" alt="Paisa Dairy Logo" 
                className="public-logo"
                />
              </div>

              <h1>Paisa Dairy</h1>

              <p>
                Personal Expense Tracker
              </p>
            </div>

            <h2>
              {isRegister
                ? 'Create account'
                : 'Welcome back'}
            </h2>

            <form
              onSubmit={
                isRegister
                  ? handleRegister
                  : handleLogin
              }
            >
              <label>
                Username
              </label>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={event =>
                  setUsername(
                    event.target.value
                  )
                }
              />

              {isRegister && (
                <>
                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={event =>
                      setEmail(
                        event.target.value
                      )
                    }
                  />
                </>
              )}

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={event =>
                  setPassword(
                    event.target.value
                  )
                }
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : isRegister
                    ? 'Create account'
                    : 'Login'}
              </button>
            </form>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button
              className="switch-button"
              type="button"
              onClick={() => {
                setIsRegister(
                  current => !current
                )

                setError('')
              }}
            >
              {isRegister
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </button>

          </section>
        </main>
      </div>
    )
  }
// DASHBOARD ACCESS CHECK
// =========================

if (page === 'dashboard' && !currentUser) {
  setIsRegister(false)
  setError('Please login to access your dashboard.')
  setPage('login')

  return null
}
  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">

        <div className="header-left">

          <div className="nav-logo">
            <img src="/logo.png" alt="Paisa Dairy Logo" />
          </div>

          <div>
            <h1>Paisa Dairy</h1>

            <p>
              Personal Expense Tracker
            </p>
          </div>

        </div>

        <div className="user">

          <div>
            Signed in as{' '}

            <strong>
              {currentUser.username}
            </strong>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>

        </div>

      </header>

      <main>

        {/* =========================
            WELCOME
        ========================= */}

        <section className="welcome">

          <div>
            <p className="eyebrow">
              OVERVIEW
            </p>

            <h2>
              Your spending at a glance
            </h2>

            <p>
              Keep track of where your money
              is going.
            </p>
          </div>

          <div className="welcome-date">
            {new Date().toLocaleDateString(
              undefined,
              {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}
          </div>

        </section>

        {/* =========================
            STAT CARDS
        ========================= */}

        <section className="stats-grid">

          <div className="stat-card primary">

            <span>
              Total spent
            </span>

            <strong>
              ₹{totalSpent.toFixed(2)}
            </strong>

            <small>
              All your expenses
            </small>

          </div>

          <div className="stat-card">

            <span>
              This month
            </span>

            <strong>
              ₹{currentMonthSpent.toFixed(2)}
            </strong>

            <small>
              Current month spending
            </small>

          </div>

          <div className="stat-card">

            <span>
              Average expense
            </span>

            <strong>
              ₹{averageExpense.toFixed(2)}
            </strong>

            <small>
              {expenses.length}{' '}
              {expenses.length === 1
                ? 'expense'
                : 'expenses'}
            </small>

          </div>

          <div className="stat-card">

            <span>
              Largest expense
            </span>

            <strong>
              ₹{largestExpense.toFixed(2)}
            </strong>

            <small>
              Highest single expense
            </small>

          </div>

        </section>

        {/* FINANCIAL PROFILE */}

<section className="financial-section">

  <div className="card financial-card">

    <div className="section-heading">

      <div>
        <p className="eyebrow">
          FINANCIAL PLAN
        </p>

        <h2>
          Monthly income & savings goal
        </h2>

        <p>
          Set your monthly income and the amount
          you want to save.
        </p>
      </div>

    </div>

    {/* FINANCIAL FORM */}

    <form
      onSubmit={handleFinancialProfileSubmit}
      className="financial-form"
    >

      <div>
        <label>
          Monthly income
        </label>
&nbsp; &nbsp;
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="50000"
          value={monthlyIncome}
          onChange={event =>
            setMonthlyIncome(event.target.value)
          }
        />
      </div>

      <div>
        <label>
          Savings goal
        </label>
&nbsp; &nbsp;
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="10000"
          value={savingsGoal}
          onChange={event =>
            setSavingsGoal(event.target.value)
          }
        />
      </div>

      <div className="financial-button">

        <button
          type="submit"
          disabled={savingProfile}
        >
          {savingProfile
            ? 'Saving...'
            : 'Save financial plan'}
        </button>

      </div>

    </form>

    {/* FINANCIAL SUMMARY */}

    <div className="financial-summary">

      <div>
        <span>
          Monthly income
        </span>

        <strong>
          ₹{income.toFixed(2)}
        </strong>
      </div>

      <div>
        <span>
          Savings target
        </span>

        <strong>
          ₹{savings.toFixed(2)}
        </strong>
      </div>

      <div>
        <span>
          Spending budget
        </span>

        <strong>
          ₹{plannedSpending.toFixed(2)}
        </strong>
      </div>

      <div>
        <span>
          Remaining budget
        </span>

        <strong
          className={
            isOverspending
              ? 'danger-text'
              : ''
          }
        >
          ₹{remainingBudget.toFixed(2)}
        </strong>
      </div>

    </div>

    {/* MONTHLY BUDGET */}

    <div className="progress-section">

      <div className="progress-header">

        <div>
          <strong>
            Monthly budget
          </strong>

          <span>
            ₹{currentMonthSpent.toFixed(2)}
            {' '}of{' '}
            ₹{plannedSpending.toFixed(2)}
          </span>
        </div>

        {/* <strong>
          {budgetProgress.toFixed(0)}%
        </strong> */}
        <strong>
  {isOverspending
    ? `${budgetProgress.toFixed(0)}%`
    : `${safeBudgetProgress.toFixed(0)}%`}
</strong>

      </div>

      <div className="budget-progress-track">

        <div
          className={`budget-progress-bar ${
            isOverspending
              ? 'budget-over'
              : ''
          }`}
          style={{
            width: `${safeBudgetProgress}%`,
          }}
        />

      </div>

      {/* OVERSPENDING WARNING */}

      {isOverspending && (
        <div className="overspending-warning">

          <span className="warning-icon">
            !
          </span>

          <div>
            <strong>
              Budget exceeded
            </strong>

            <p>
              You have spent ₹
              {(
                currentMonthSpent -
                plannedSpending
              ).toFixed(2)}
              {' '}more than your monthly spending
              budget.
            </p>
          </div>

        </div>
      )}

      {!isOverspending &&
        plannedSpending > 0 && (
          <p className="budget-status">
            ₹{remainingBudget.toFixed(2)}
            {' '}remaining for this month.
          </p>
        )}

    </div>

    {/* SAVINGS PROGRESS */}

    <div className="progress-section savings-section">

      <div className="progress-header">

        <div>
          <strong>
            Savings goal
          </strong>

          <span>
            ₹{savings.toFixed(2)}
            {' '}of{' '}
            ₹{income.toFixed(2)} income
          </span>
        </div>

        <strong>
          {savingsProgress.toFixed(0)}%
        </strong>

      </div>

      <div className="savings-progress-track">

        <div
          className="savings-progress-bar"
          style={{
            width: `${safeSavingsProgress}%`,
          }}
        />

      </div>

      <p className="budget-status">

        {savings === 0
          ? 'Set a savings goal to start tracking your progress.'
          : `Your savings target is ${savingsProgress.toFixed(
              0
            )}% of your monthly income.`}

      </p>

    </div>

  </div>

</section>

        {/* =========================
            EXPENSE FORM
        ========================= */}

        <section className="card">

          <div className="section-heading">

            <div>

              <p className="eyebrow">
                EXPENSE
              </p>

              <h2>
                {editingId !== null
                  ? 'Edit expense'
                  : 'Log an expense'}
              </h2>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              <div>

                <label>
                  What was it for
                </label>

                <input
                  type="text"
                  placeholder="Coffee, lunch, cab..."
                  value={description}
                  onChange={event =>
                    setDescription(
                      event.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>Amount</label>

                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={event =>
                    setAmount(
                      event.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={event =>
                    setCategoryId(
                      Number(
                        event.target.value
                      )
                    )
                  }
                >

                  {categories.map(
                    category => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}

                </select>

              </div>

           <div className="button-container">

  <button
    type="submit"
    className="expense-submit-button"
    disabled={loading}
  >
    {loading
      ? 'Saving...'
      : editingId !== null
        ? 'Update expense'
        : 'Log expense'}
  </button>

  {editingId !== null && (
    <button
      type="button"
      className="expense-cancel-button"
      onClick={cancelEdit}
    >
      Cancel
    </button>
  )}

</div>

            </div>

          </form>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </section>

        {/* =========================
            DASHBOARD DETAILS
        ========================= */}

        <div className="dashboard-grid">

          {/* CATEGORY BREAKDOWN */}

          <section className="card">

            <div className="section-heading">

              <div>

                <p className="eyebrow">
                  BREAKDOWN
                </p>

                <h2>
                  Spending by category
                </h2>

              </div>

            </div>

            {categoryTotals.length === 0 ? (

              <p className="empty">
                No category data yet.
              </p>

            ) : (

              <div className="category-list">

                {categoryTotals.map(
                  ([category, value]) => {

                    const percentage =
                      totalSpent > 0
                        ? (value /
                            totalSpent) *
                          100
                        : 0

                    return (
                      <div
                        className="category-item"
                        key={category}
                      >

                        <div className="category-top">

                          <strong>
                            {category}
                          </strong>

                          <span>
                            ₹
                            {value.toFixed(
                              2
                            )}
                          </span>

                        </div>

                        <div className="progress-track">

                          <div
                            className="progress-bar"
                            style={{
                              width:
                                `${percentage}%`,
                            }}
                          />

                        </div>

                        <small>
                          {percentage.toFixed(
                            1
                          )}
                          % of total spending
                        </small>

                      </div>
                    )
                  }
                )}

              </div>

            )}

          </section>

          {/* MONTHLY */}

          <section className="card">

            <div className="section-heading">

              <div>

                <p className="eyebrow">
                  MONTHLY
                </p>

                <h2>
                  This month's spending
                </h2>

              </div>

            </div>

            <div className="monthly-total">

              <span>
                {new Date().toLocaleDateString(
                  undefined,
                  {
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </span>

              <strong>
                ₹
                {currentMonthSpent.toFixed(
                  2
                )}
              </strong>

            </div>

            <div className="monthly-info">

              <div>

                <span>
                  Total expenses
                </span>

                <strong>
                  {expenses.length}
                </strong>

              </div>

              <div>

                <span>
                  Categories used
                </span>

                <strong>
                  {categoryTotals.length}
                </strong>

              </div>

            </div>

          </section>

        </div>

{/* =========================
    RECENT EXPENSES
========================= */}

<section className="card">

  <div className="section-heading">

    <div>

      <p className="eyebrow">
        TRANSACTIONS
      </p>

      <h2>
        Recent expenses
      </h2>

    </div>

    <span className="entry-count">
      {filteredExpenses.length} entries
    </span>

  </div>


  {/* =========================
      SEARCH & FILTER
  ========================= */}

  <div className="expense-filters">

    <div className="search-box">

      <input
        type="text"
        placeholder="Search expenses..."
        value={searchTerm}
        onChange={event =>
          setSearchTerm(event.target.value)
        }
      />

    </div>


    <div className="filter-box">

      <select
        value={filterCategory}
        onChange={event =>
          setFilterCategory(event.target.value)
        }
      >

        <option value="all">
          All categories
        </option>

        {categories.map(category => (

          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>

        ))}

      </select>

    </div>

  </div>


  {/* =========================
      EXPENSE LIST
  ========================= */}

  {loading && expenses.length === 0 ? (

    <p>
      Loading...
    </p>

  ) : filteredExpenses.length === 0 ? (

    <p className="empty">
      No expenses found.
    </p>

  ) : (

    <div className="expense-list">

      {filteredExpenses.map(expense => (

        <div
          className="expense"
          key={expense.id}
        >

          <div className="expense-main">

            <div className="expense-icon">

              {(
                expense.categoryName ||
                'O'
              ).charAt(0)}

            </div>

            <div>

              <strong>
                {expense.description}
              </strong>

              <span>

                {expense.categoryName ||

                  categories.find(
                    category =>
                      Number(category.id) ===
                      Number(expense.categoryId)
                  )?.name ||

                  'Other'}

              </span>

            </div>

          </div>


          <div className="expense-right">

            <strong>
              ₹
              {Number(
                expense.amount
              ).toFixed(2)}
            </strong>

            <small>
              {new Date(
                expense.expenseDate
              ).toLocaleDateString()}
            </small>


            {/* EDIT */}

            <button
              className="edit-button"
              onClick={() =>
                handleEdit(expense)
              }
            >
              Edit
            </button>


            {/* DELETE */}

            <button
              className="delete-button"
              onClick={() =>
                handleDelete(expense.id)
              }
            >
              Delete
            </button>

          </div>

        </div>

      ))}

    </div>

  )}

</section>

      </main>

    </div>
  )
}

export default App