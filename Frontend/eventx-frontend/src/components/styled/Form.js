// components/styled/Form.js
import React from 'react';

const Form = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
};

const FormGroup = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  );
};

const Label = ({ htmlFor, children, required = false, className = '' }) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

const Input = ({ 
  id, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  error = '', 
  className = '', 
  ...props 
}) => {
  const hasError = error !== '';
  
  return (
    <div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const Textarea = ({ 
  id, 
  placeholder = '', 
  value, 
  onChange, 
  error = '', 
  className = '', 
  rows = 4,
  ...props 
}) => {
  const hasError = error !== '';
  
  return (
    <div>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const Select = ({ 
  id, 
  value, 
  onChange, 
  error = '', 
  children, 
  className = '', 
  ...props 
}) => {
  const hasError = error !== '';
  
  return (
    <div>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Form.Group = FormGroup;
Form.Label = Label;
Form.Input = Input;
Form.Textarea = Textarea;
Form.Select = Select;

export default Form;