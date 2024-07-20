import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaFilm from './components/ListaFilm';
import logo from './images/logo.png'


function App() {
  return (
    <div className="container">
        <img src={logo}/>  
        <ListaFilm/>
    </div>
  );
}

export default App;
