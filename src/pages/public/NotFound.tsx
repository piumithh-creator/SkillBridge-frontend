import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-2 text-2xl font-bold">This bridge leads nowhere</h1>
      <p className="mt-1 text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6"><Button>Back to home</Button></Link>
    </div>
  );
}
