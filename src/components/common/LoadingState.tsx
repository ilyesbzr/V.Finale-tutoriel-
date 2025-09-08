@@ .. @@
 import React from 'react';

-export default function LoadingState() {
+export default function LoadingState(): JSX.Element {
   return (
     <div className="flex items-center justify-center min-h-[300px]">
       <div className="flex flex-col items-center gap-6">
         <div className="relative">
           <div className="loading-spinner-modern"></div>
           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 opacity-20 animate-pulse"></div>
         </div>
         <div className="text-center">
           <p className="text-lg font-semibold text-gray-700 animate-pulse">Chargement...</p>
           <div className="flex justify-center mt-2 space-x-1">
             <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
             <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
             <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
           </div>
         </div>
       </div>
     </div>
   );
 }