import { RouterProvider } from 'react-router-dom';
import { router } from './router/app-router';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;