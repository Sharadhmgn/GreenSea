import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [userDataString, setUserDataString] = useState<string>('')
  const [currentUserData, setCurrentUserData] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  // Function to test localStorage admin user storage
  const setAdminUser = () => {
    const adminUser = {
      id: '1234',
      name: 'Test Admin',
      email: 'admin@example.com',
      isAdmin: true
    }
    
    console.log('Setting admin user to localStorage:', adminUser)
    localStorage.setItem('user', JSON.stringify(adminUser))
    
    // Update the state
    updateStates()
  }
  
  // Function to test localStorage non-admin user storage
  const setRegularUser = () => {
    const regularUser = {
      id: '5678',
      name: 'Regular User',
      email: 'user@example.com',
      isAdmin: false
    }
    
    console.log('Setting regular user to localStorage:', regularUser)
    localStorage.setItem('user', JSON.stringify(regularUser))
    
    // Update the state
    updateStates()
  }
  
  // Function to clear user data
  const clearUser = () => {
    console.log('Clearing user from localStorage')
    localStorage.removeItem('user')
    
    // Update the state
    updateStates()
  }
  
  // Function to update all state variables
  const updateStates = () => {
    const userStr = localStorage.getItem('user')
    setUserDataString(userStr || 'No user data in localStorage')
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setCurrentUserData(userData)
        setIsAdmin(userData.isAdmin === true)
      } catch (e) {
        console.error('Error parsing user data:', e)
        setCurrentUserData(null)
        setIsAdmin(false)
      }
    } else {
      setCurrentUserData(null)
      setIsAdmin(false)
    }
  }
  
  // Effect to check localStorage on mount
  useEffect(() => {
    updateStates()
  }, [])

  return (
    <div style={{ textAlign: 'left', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Authentication Test</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={setAdminUser} style={{ marginRight: '0.5rem' }}>
          Set Admin User
        </button>
        <button onClick={setRegularUser} style={{ marginRight: '0.5rem' }}>
          Set Regular User
        </button>
        <button onClick={clearUser}>
          Clear User
        </button>
      </div>
      
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h2>User Status</h2>
        <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
        <p><strong>User Data:</strong> {JSON.stringify(currentUserData, null, 2)}</p>
      </div>
      
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h2>LocalStorage Raw Data</h2>
        <p style={{ wordBreak: 'break-all' }}>{userDataString}</p>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <p>
          <strong>Note:</strong> Check your browser console for additional logs.
        </p>
      </div>
    </div>
  )
}

export default App
