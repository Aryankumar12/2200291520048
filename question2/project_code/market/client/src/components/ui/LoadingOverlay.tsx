import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const LoadingOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      const queries = queryClient.getQueryCache().findAll();
      const isAnyQueryFetching = queries.some(query => query.state.status === "pending");
      
      if (isAnyQueryFetching) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-primary border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mb-4"></div>
        <div className="text-lg font-medium">Loading Data...</div>
        <div className="text-sm text-muted-foreground">Please wait while we fetch the latest information</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
