
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/Context.jsx'
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router

ReactDOM.createRoot(document.getElementById("root")).render(
	<Router>
	<ContextProvider>
		<App />
	</ContextProvider>
	</Router>
);
