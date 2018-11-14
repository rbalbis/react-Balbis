import React, { Component } from 'react';
import './App.css';

class AddResto extends Component {
  constructor(props) {
    super(props);
    // modele, equivalent du data de VueJS
    this.state = {
      name: "",
      cuisine: ""
    }
  }

  componentDidMount() {
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeCuisine(event) {
    this.setState({ cuisine: event.target.value });
  }

  addResto(e) {
    e.preventDefault()
    console.log(this.state)
    let url = "http://localhost:8080/api/restaurants";
    fetch(url, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"nom": this.state.name, "cuisine":this.state.cuisine})
      
    })
      .then((responseJSON) => responseJSON.json())
      .then((res) => console.log(res))
      .catch(function (err) { console.log(err); })
  }



  render() {
    return (
      <div className="AddResto">
        <form><div className="form-row">
          <div className="form-group col-md-4">

            <input type="text" placeholder="Nom Restaurant" className="form-control ml-2" id="inputName" onChange={(e) => this.handleChangeName(e)} />
          </div>
          <div className="form-group col-md-4">
            <input type="text" className="form-control" placeholder="typeCuisine" id="typeCuisine" onChange={(e) => this.handleChangeCuisine(e)} />
          </div>
          <button className="btn btn-outline-success form-group" onClick={(e) => this.addResto(e)}>Creer Restaurant</button>

        </div>
        </form>
      </div>

    )
  }
}

export default AddResto;