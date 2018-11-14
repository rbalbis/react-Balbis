import React, { Component } from 'react';
import './App.css';
import AddResto from './AddResto.js';


class App extends Component {
  constructor(props) {
    super(props);
    // modele, equivalent du data de VueJS
    this.state = {
      restaurants: [],
      page: 1,
      collectionSize: 0,
      searchValue: "",
    }
  }

  getRequest() {
    fetch("http://localhost:8080/api/restaurants?page=" + this.state.page + "&name=" + this.state.searchValue)
      .then(response => response.json())
      .then(res => {console.log(res.data)
        this.setState({ restaurants: res.data })})
      .catch(error => error);
  }

  pageSuivante() {
    if (this.state.page < this.state.collectionSize * 10) {
      this.setState({ page: this.state.page + 1 }, () => this.getRequest())

    }

  }

  pagePrecedente() {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 }, () => this.getRequest())


    }

  }

  isPagePrecedent() {
    if (this.state.page === 1) {
      return "disabled"
    }
    return ""
  }

  countCollection() {
    fetch("http://localhost:8080/api/restaurants/count")
      .then(response => response.json())
      .then(res => { this.setState({ collectionSize: res.data }) })
      .catch(error => error);
  }

  countFilteredCollection() {
    fetch("http://localhost:8080/api/restaurants/count?name=" + this.state.searchValue)
      .then(response => response.json())
      .then(res => { this.setState({ collectionSize: res.data }) })
      .catch(error => error);
  }

  setCurrentPage(i) {
    this.setState({ page: i }, () => this.getRequest())

  }

  componentDidMount() {
    this.getRequest();
    this.countCollection()
  }

  handleChange(event) {
    this.setState({ searchValue: event.target.value }, () => this.getRequest(), this.countCollection(), this.setCurrentPage(1));

    console.log(this.state.searchValue)
  }
  supprimerResto(id) {
    fetch("http://localhost:8080/api/restaurants/" + id, { method: 'DELETE' })
      .then(this.getRequest())
      .then(this.countCollection())
      .catch(error => error);
  }


  navigPage() {

    let page = this.state.page;

    let res = [];
    if (page <= 5) {
      for (let i = 1; i < 8; i++) {
        res.push(<button className={"page-link" + ((this.state.page === i) ? 'active' : '')} onClick={() => this.setCurrentPage(i)} key={i}>{i}</button>)

      }

      return res
    }
    if (page >= this.state.collectionSize / 10 - 5) {
      for (let i = Math.floor(this.state.collectionSize / 10 - 5); i < Math.floor(this.state.collectionSize / 10); i++) {
        res.push(<button className={"page-link" + ((this.state.page === i) ? 'active' : '')} onClick={() => this.setCurrentPage(i)} key={i}>{i}</button>)

      }
      return res
    }
    for (let i = this.state.page - 4; i < this.state.page + 4; i++) {
      res.push(<button className={"page-link" + ((this.state.page === i) ? 'active' : '')} onClick={() => this.setCurrentPage(i)} key={i}>{i}</button>)
    }
    return res

  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <span className="navbar-brand">Restaurants</span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">

              <form className="form-inline my-2 my-lg-0">
                <input className="form-control mr-sm-2" type="text" aria-label="Search" onChange={(e) => this.handleChange(e)} />
                <button className="btn btn-outline-success my-2 my-sm-0" type="" >Search</button>
              </form>
            </div>
          </nav>
          <AddResto/>
         
        </header>

        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type de Cuisine</th>
              <th>Quartier</th>
              <th>Id Restaurants</th>
            </tr>
          </thead>
          <tbody>
            {this.state.restaurants.map((resto, i) => {
              return <tr key={i} >
                <td>{resto.name}</td>
                <td>{resto.cuisine}</td>
                <td>{resto.borough}</td>
                <td>{resto._id}</td>
                <td><button type="button" className="btn btn-danger" onClick={() => this.supprimerResto(resto._id)}>Supprimer</button></td>
              </tr>
            })

            }
          </tbody>
        </table>



        <nav aria-label="...">
          <div className="btn-group" role="group" aria-label="Basic example">

            <button className="page-link" onClick={() => { this.pagePrecedente() }} {...((this.state.pagePrecedente === 1) ? 'disabled' : '')} >Previous</button>

            {this.navigPage()}

            <button className="page-link" onClick={() => { this.pageSuivante() }} {...((this.state.pagePrecedente === (this.state.collectionSize / 10)) ? 'disabled' : '')}>Next</button>

          </div>
        </nav>
      </div>

    );
  }
}

export default App;
