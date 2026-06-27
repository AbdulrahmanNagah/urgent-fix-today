import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center bg-secondary rounded-[2rem] border-4 border-foreground p-10 shadow-[0_8px_0_hsl(355,65%,30%)]">
        <h1 className="mb-6 text-6xl font-black text-foreground">404</h1>
        <p className="mb-8 text-2xl font-bold text-foreground">عفواً! الصفحة مش موجودة</p>
        <a href="/" className="btn-primary inline-block text-xl py-4 px-8">
          الرجوع للرئيسية
        </a>
      </div>
    </div>
  );
};

export default NotFound;
