@@ .. @@
 import React from 'react';

-export default function Button({
+interface ButtonProps {
+  children: React.ReactNode;
+  type?: 'button' | 'submit' | 'reset';
+  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
+  fullWidth?: boolean;
+  loading?: boolean;
+  onClick?: () => void;
+  as?: 'button' | 'a';
+  className?: string;
+  size?: 'xs' | 'sm' | 'md' | 'lg';
+  disabled?: boolean;
+}
+
+export default function Button({
   children,
   type = 'button',
   variant = 'primary',
   fullWidth = false,
   loading = false,
   onClick,
   as = 'button',
   className = '',
-  size = 'md'
-}) {
+  size = 'md',
+  disabled = false
+}: ButtonProps): JSX.Element {
   const baseStyles = "btn-modern inline-flex items-center justify-center font-semibold focus-modern";
   
   const variants = {
     primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl",
     secondary: "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300",
     outline: "bg-transparent border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600",
     ghost: "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
   };
   
   const sizes = {
     xs: "px-3 py-2 text-xs",
     sm: "px-4 py-2.5 text-sm",
     md: "px-6 py-3 text-sm",
     lg: "px-8 py-4 text-base"
   };
   
   const widthClass = fullWidth ? "w-full" : "";
   const Component = as;

   return (
     <Component
       type={type}
       onClick={onClick}
-      disabled={loading}
+      disabled={loading || disabled}
       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} ${loading ? 'opacity-75 cursor-wait' : ''} group`}
     >
       {loading && (
         <svg className="loading-spinner-modern -ml-1 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
       )}
       <span className="relative z-10">{children}</span>
     </Component>
   );
 }