import React, {Component} from 'react';
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './App.css';

class App extends Component {
	state = {
		users: [],
		id: 0,
		message: null,
		intervalIsSet: false,
		idToDelete: null,
		idToUpdate: null,
		objectToUpdate: null
	};

	componentDidMount() {
		this.getDataFromDb();
		// if (!this.state.intervalIsSet) {
		//   let interval = setInterval(this.getDataFromDb, 1000);
		//   this.setState({ intervalIsSet: interval });
		// }
	}

	componentWillUnmount() {
		// if (this.state.intervalIsSet) {
		//   clearInterval(this.state.intervalIsSet);
		//   this.setState({ intervalIsSet: null });
		// }
	}

	// just a note, here, in the front end, we use the id key of our data object
	// in order to identify which we want to Update or delete.
	// for our back end, we use the object id assigned by MongoDB to modify
	// data base entries

	// our first get method that uses our backend api to
	// fetch data from our data base
	getDataFromDb = () => {
		fetch('http://localhost:3001/api/v1/company/5c90f3971c9d4400002b3703/users',
			{
				headers: {'Content-Type': 'application/json'},
			})
			.then(res => res.json())
			.then(res => {
				console.log(res.data);
				this.setState({ users: res.data })
			}).catch(() => {
				this.setState({ users: [] });
		});
	}

	imageFormatter = (cell) => {
		var base64data = new Buffer(cell.data).toString('base64');
		return <img src={"data:image/png;base64, " + base64data} width={30}/>;
	};

	render() {
		const { users } = this.state;

		const columns = [
			{ dataField: 'profilePicture', text: '', formatter: this.imageFormatter },
			{ dataField: 'name', text: 'Name' },
			{ dataField: 'surname', text: 'Surname' },
			{ dataField: 'email', text: 'Email' },
			{ dataField: 'position', text: 'Position' },
			{ dataField: 'office', text: 'Office' },
			{ dataField: 'salary', text: 'Salary' },
			{ dataField: 'workingHours', text: 'Working hours' }
		];

		return (
			<div className="container">
				<BootstrapTable bootstrap4
								bordered={ false }
								hover={ true }
								keyField="_id"
								data={ users }
								columns={ columns }
								pagination={ paginationFactory() }
								classes='table-responsive'
				/>
			</div>
		);
	}
}

export default App;
