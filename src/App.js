import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MainGallery from './components/MainGallery/MainGallery';
import Error from './components/Error/Error';
import Checkout from './components/Checkout/Checkout';
import ProductPage from './components/ProductPage/ProductPage';
import Favorites from './components/Favorites/Favorites';
import Boutique from './components/Boutique/Boutique';
import Following from './components/Following/Following';
import About from './components/About/About';
import Search from './components/Search/Search';
import { Route, Switch } from 'react-router-dom';
//const store = createStore(reducers,applyMiddleware(ReduxThunk))


const  App = () => {

  return (
  <div className="App">
       <Header/>
      <Switch>
        <Route exact path='/' component={MainGallery} exact/>
        <Route  path='/product/:productId' component={ProductPage} />
        <Route  path='/checkout' component={Checkout} />
        <Route  path='/seller/:vendorID' component={Boutique} />
        <Route  path='/favorites' component={Favorites} />
        <Route  path='/following' component={Following} />
        <Route  path='/about' component={About} />
        <Route  path='/search' component={Search} />
        <Route component={Error} />
      </Switch>
      <Footer/>
    </div>

  );
}

export default App;
