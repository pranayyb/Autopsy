import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { logoutUser } = useAuth();

  return (
    <nav>
      <Link to="/">Projects</Link>
      <button onClick={logoutUser}>Logout</button>
    </nav>
  );
}
