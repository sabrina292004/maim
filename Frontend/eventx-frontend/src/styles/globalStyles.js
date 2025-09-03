import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  /* Reset and Base Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    color: #1a237e;
    background-color: #f5f5f5;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: #1a237e;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1.1rem;
  }

  p {
    margin-bottom: 1rem;
    color: #5a5a5a;
  }

  /* Links */
  a {
    color: #667eea;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  a:hover {
    color: #5a6fd8;
    text-decoration: underline;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: none;
    min-height: 44px;
  }

  .btn-primary {
    background: linear-gradient(45deg, #667eea 30%, #764ba2 90%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .btn-primary:hover {
    background: linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-outline:hover {
    background: #667eea;
    color: white;
  }

  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    min-height: 52px;
  }

  .btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    min-height: 36px;
  }

  /* Cards */
  .card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
  }

  .card-body {
    padding: 1.5rem;
  }

  .card-footer {
    padding: 1.5rem;
    border-top: 1px solid #eee;
    background: #fafafa;
  }

  /* Forms */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #1a237e;
  }

  .form-control {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
  }

  .form-control:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .form-control.error {
    border-color: #d32f2f;
  }

  .form-error {
    color: #d32f2f;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  /* Alerts */
  .alert {
    padding: 1rem 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid;
  }

  .alert-success {
    background: #e8f5e8;
    border-color: #4caf50;
    color: #2e7d32;
  }

  .alert-error {
    background: #ffebee;
    border-color: #f44336;
    color: #c62828;
  }

  .alert-warning {
    background: #fff3e0;
    border-color: #ff9800;
    color: #ef6c00;
  }

  .alert-info {
    background: #e3f2fd;
    border-color: #2196f3;
    color: #1565c0;
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-primary {
    background: #667eea;
    color: white;
  }

  .badge-secondary {
    background: #764ba2;
    color: white;
  }

  .badge-success {
    background: #4caf50;
    color: white;
  }

  .badge-warning {
    background: #ff9800;
    color: white;
  }

  .badge-error {
    background: #f44336;
    color: white;
  }

  /* Chips */
  .chip {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    background: #f0f0f0;
    color: #5a5a5a;
    border: 1px solid #e0e0e0;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .chip:hover {
    background: #e0e0e0;
    transform: translateY(-1px);
  }

  .chip.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  /* Grid System */
  .grid {
    display: grid;
    gap: 1.5rem;
  }

  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid-auto {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  /* Flexbox Utilities */
  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .flex-row {
    flex-direction: row;
  }

  .items-center {
    align-items: center;
  }

  .items-start {
    align-items: flex-start;
  }

  .items-end {
    align-items: flex-end;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-around {
    justify-content: space-around;
  }

  .gap-1 { gap: 0.25rem; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  .gap-5 { gap: 1.25rem; }
  .gap-6 { gap: 1.5rem; }

  /* Spacing Utilities */
  .m-0 { margin: 0; }
  .m-1 { margin: 0.25rem; }
  .m-2 { margin: 0.5rem; }
  .m-3 { margin: 0.75rem; }
  .m-4 { margin: 1rem; }
  .m-5 { margin: 1.25rem; }
  .m-6 { margin: 1.5rem; }

  .mt-0 { margin-top: 0; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-5 { margin-top: 1.25rem; }
  .mt-6 { margin-top: 1.5rem; }

  .mb-0 { margin-bottom: 0; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-5 { margin-bottom: 1.25rem; }
  .mb-6 { margin-bottom: 1.5rem; }

  .p-0 { padding: 0; }
  .p-1 { padding: 0.25rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .p-5 { padding: 1.25rem; }
  .p-6 { padding: 1.5rem; }

  .pt-0 { padding-top: 0; }
  .pt-1 { padding-top: 0.25rem; }
  .pt-2 { padding-top: 0.5rem; }
  .pt-3 { padding-top: 0.75rem; }
  .pt-4 { padding-top: 1rem; }
  .pt-5 { padding-top: 1.25rem; }
  .pt-6 { padding-top: 1.5rem; }

  .pb-0 { padding-bottom: 0; }
  .pb-1 { padding-bottom: 0.25rem; }
  .pb-2 { padding-bottom: 0.5rem; }
  .pb-3 { padding-bottom: 0.75rem; }
  .pb-4 { padding-bottom: 1rem; }
  .pb-5 { padding-bottom: 1.25rem; }
  .pb-6 { padding-bottom: 1.5rem; }

  /* Text Utilities */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  .text-primary { color: #667eea; }
  .text-secondary { color: #764ba2; }
  .text-success { color: #4caf50; }
  .text-warning { color: #ff9800; }
  .text-error { color: #f44336; }
  .text-muted { color: #5a5a5a; }

  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .font-medium { font-weight: 500; }
  .font-normal { font-weight: 400; }
  .font-light { font-weight: 300; }

  /* Background Utilities */
  .bg-primary { background-color: #667eea; }
  .bg-secondary { background-color: #764ba2; }
  .bg-success { background-color: #4caf50; }
  .bg-warning { background-color: #ff9800; }
  .bg-error { background-color: #f44336; }
  .bg-light { background-color: #f5f5f5; }
  .bg-white { background-color: white; }

  /* Border Utilities */
  .border { border: 1px solid #e0e0e0; }
  .border-0 { border: 0; }
  .border-t { border-top: 1px solid #e0e0e0; }
  .border-b { border-bottom: 1px solid #e0e0e0; }
  .border-l { border-left: 1px solid #e0e0e0; }
  .border-r { border-right: 1px solid #e0e0e0; }

  .border-primary { border-color: #667eea; }
  .border-secondary { border-color: #764ba2; }
  .border-success { border-color: #4caf50; }
  .border-warning { border-color: #ff9800; }
  .border-error { border-color: #f44336; }

  .rounded { border-radius: 8px; }
  .rounded-lg { border-radius: 16px; }
  .rounded-full { border-radius: 9999px; }

  /* Shadow Utilities */
  .shadow { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
  .shadow-lg { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15); }
  .shadow-xl { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2); }

  /* Responsive Utilities */
  .hidden { display: none; }
  .block { display: block; }
  .inline-block { display: inline-block; }
  .inline { display: inline; }

  @media (max-width: 768px) {
    .hidden-mobile { display: none; }
    .block-mobile { display: block; }
  }

  @media (min-width: 769px) {
    .hidden-desktop { display: none; }
    .block-desktop { display: block; }
  }

  /* Animation Classes */
  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #5a6fd8;
  }

  /* Focus Styles */
  *:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  /* Selection Styles */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: #1a237e;
  }

  /* Print Styles */
  @media print {
    .no-print { display: none; }
    body { background: white; }
    .card { box-shadow: none; border: 1px solid #ccc; }
  }
`;

export default GlobalStyles;
