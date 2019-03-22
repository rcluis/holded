import React, {Component} from 'react';
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FaTrash, FaUserEdit } from "react-icons/fa"
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

import './App.css';

class App extends Component {
	state = {
		users: [],
		companyId: '5c90f3971c9d4400002b3703'
	};

	componentDidMount() {
		this.getUsers();
	}

	getUsers = () => {
		fetch(`http://localhost:3001/api/v1/company/${this.state.companyId}/users`)
			.then(res => res.json())
			.then(res => {
				this.setState({ users: res.data })
			}).catch(() => {
				this.setState({ users: [] });
		});
	};

	deleteUser = userId => {
		axios.delete("http://localhost:3001/api/v1/company/user", {
			data: {
				userId: userId,
				companyId: this.state.companyId
			}
		});
	};

	render() {
		const { users } = this.state;

		const columns = [
			{
				dataField: 'profilePicture',
				text: '',
				formatter: (cell) => {
					var base64data = new Buffer(cell.data).toString('base64');
					return <img src={"data:image/png;base64, " + base64data} width={30} alt="profile"/>;
				}
			},
			{ dataField: 'name', text: 'Name', sort: true },
			{ dataField: 'surname', text: 'Surname', sort: true },
			{ dataField: 'email', text: 'Email', sort: true },
			{ dataField: 'position', text: 'Position', sort: true },
			{ dataField: 'office', text: 'Office', sort: true },
			{ dataField: 'salary', text: 'Salary', sort: true },
			{ dataField: 'workingHours', text: 'Working hours', sort: true },
			{
				dataField: 'edit',
				text: '',
				formatter: () => (
					<FaUserEdit />
				),
				events: {
					onClick: (e, column, columnIndex, row, rowIndex) => {
						console.log(row);
						this.setState({'users': []});
					}
				}
			},
			{
				dataField: 'delete',
				text: '',
				formatter: () => (
					<FaTrash />
				),
				events: {
					onClick: (e, column, columnIndex, row, rowIndex) => {
						console.log(row._id);
						const userId = row._id;
						this.deleteUser(userId, rowIndex);
					}
				}
			}
		];
		const options = {
			paginationSize: 1,
			pageStartIndex: 0,
			hideSizePerPage: true, // Hide the sizePerPage dropdown always
			// hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
			showTotal: true,
		};
		return (
			<div className="container">
				<BootstrapTable bootstrap4
								bordered={ false }
								hover={ true }
								keyField="_id"
								data={ users }
								columns={ columns }
								pagination={ paginationFactory(options) }
								classes='table-responsive'
				/>
			</div>
		);
	}
}

export default App;
