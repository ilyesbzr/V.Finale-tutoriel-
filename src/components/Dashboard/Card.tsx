@@ .. @@
 import React from 'react';

-export function Card({ children, className = '' }) {
+interface CardProps {
+  children: React.ReactNode;
+  className?: string;
+}
+
+export function Card({ children, className = '' }: CardProps): JSX.Element {
   return (
     <div className={`bg-white rounded-xl shadow-lg border border-gray-100 animate-fade-in ${className}`}>
       {children}
     </div>
   );
 }

-export function CardHeader({ title }) {
+interface CardHeaderProps {
+  title: string;
+}
+
+export function CardHeader({ title }: CardHeaderProps): JSX.Element {
   return (
     <div className="px-6 py-4 border-b border-gray-100 bg-white">
       <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
     </div>
   );
 }

-export function CardContent({ children, className = '' }) {
+interface CardContentProps {
+  children: React.ReactNode;
+  className?: string;
+}
+
+export function CardContent({ children, className = '' }: CardContentProps): JSX.Element {
   return (
     <div className={`p-6 bg-white ${className}`}>
       {children}
     </div>
   );
 }