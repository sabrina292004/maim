// Compatibility re-export: forward all exports to the .jsx implementation.
// This avoids "does not provide an export named 'useAuth'" errors if some
// import still resolves to AuthContext.js. Prefer importing AuthContext.jsx
// directly; this file exists only for compatibility during cleanup.
export { default } from './AuthContext.jsx';
export { useAuth, AuthProvider } from './AuthContext.jsx';