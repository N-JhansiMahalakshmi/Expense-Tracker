const API_URL =
  `${import.meta.env.VITE_API_URL || 'http://localhost:5211'}/api`

// ==============================
// COMMON RESPONSE HANDLER
// ==============================

async function handleResponse(response) {
  const text = await response.text()

  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    if (typeof data === 'string' && data) {
      throw new Error(data)
    }

    if (data?.errors) {
      const messages = Object.values(data.errors)
        .flat()
        .join(' ')

      throw new Error(messages)
    }

    if (data?.title) {
      throw new Error(data.title)
    }

    throw new Error('Request failed.')
  }

  return data
}

// ==============================
// AUTH HEADER
// ==============================

function getAuthHeaders() {
  const storedUser = localStorage.getItem(
    'expense-tracker-user'
  )

  const user = storedUser
    ? JSON.parse(storedUser)
    : null

  return {
    Accept: 'application/json',
    Authorization: `Bearer ${user?.token || ''}`,
  }
}

// ==============================
// AUTH
// ==============================

export async function loginUser(username, password) {
  const response = await fetch(
    `${API_URL}/Auth/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },

      body: JSON.stringify({
        username,
        password,
      }),
    }
  )

  return handleResponse(response)
}

export async function registerUser(
  username,
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/Auth/register`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },

      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  )

  return handleResponse(response)
}

// ==============================
// CATEGORIES
// ==============================

export async function getCategories() {
  const response = await fetch(
    `${API_URL}/Categories`,
    {
      method: 'GET',

      headers: {
        Accept: 'application/json',
      },
    }
  )

  return handleResponse(response)
}

// ==============================
// EXPENSES
// ==============================

export async function getExpenses() {
  const response = await fetch(
    `${API_URL}/Expenses`,
    {
      method: 'GET',

      headers: getAuthHeaders(),
    }
  )

  return handleResponse(response)
}

export async function createExpense(expense) {
  const response = await fetch(
    `${API_URL}/Expenses`,
    {
      method: 'POST',

      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(expense),
    }
  )

  return handleResponse(response)
}

export async function updateExpense(id, expense) {
  const response = await fetch(
    `${API_URL}/Expenses/${id}`,
    {
      method: 'PUT',

      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(expense),
    }
  )

  return handleResponse(response)
}

export async function deleteExpense(id) {
  const response = await fetch(
    `${API_URL}/Expenses/${id}`,
    {
      method: 'DELETE',

      headers: getAuthHeaders(),
    }
  )

  return handleResponse(response)
}

// ==============================
// FINANCIAL PROFILE
// ==============================

export async function getFinancialProfile() {
  const response = await fetch(
    `${API_URL}/FinancialProfile`,
    {
      method: 'GET',

      headers: getAuthHeaders(),
    }
  )

  return handleResponse(response)
}

export async function updateFinancialProfile(profile) {
  const response = await fetch(
    `${API_URL}/FinancialProfile`,
    {
      method: 'PUT',

      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        monthlyIncome: profile.monthlyIncome,
        savingsGoal: profile.savingsGoal,
      }),
    }
  )

  return handleResponse(response)
}