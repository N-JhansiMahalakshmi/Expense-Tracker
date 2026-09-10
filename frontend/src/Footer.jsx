import React from 'react';
function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div>
          <strong>Paisa Dairy</strong>
          <span>
            Personal Expense Tracker
          </span>
        </div>

        <p>
          © {new Date().getFullYear()} Paisa Dairy. All rights reserved.
        </p>

      </div>

    </footer>
  )
}
  
export default Footer