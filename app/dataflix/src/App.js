import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaFilm from './components/ListaFilm';
import logo from './images/logo.png'
import './components/styles/Home.css'
import ModalGraficoTorta from './components/ModalGraficoTorta';
import ModalGraficoBarre from './components/ModalGraficoBarre';
import ModalTopActors from './components/ModalTopActorsDirectors';
import ModalContenutiPerAnno from './components/ModalContenutiPerAnno';


function App() {
  return (
      <>
        <div className="container">
            <div className='logoContainer'>
              <img src={logo} className='logo'/>
            </div> 
            <h1 className='display-6'>Progetto Basi di Dati 2</h1>
            <span><span className='grassetto'>Realizzato da: </span>Mario Cicalese, Paolo Carmine Valletta, Alessandro Zoccola</span> <br/>
            <span><span className='grassetto'>Tecnologie Usate: </span>MongoDB, React JS, Flask, Bootstrap</span> <br/><br/>
            <ModalGraficoTorta/>
            <ModalGraficoBarre/>
            <ModalTopActors/>
            <ModalContenutiPerAnno/>
            <ListaFilm />
        </div>
      </>
  );
}

export default App;
