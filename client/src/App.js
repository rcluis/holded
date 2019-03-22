import React, { Component } from 'react';
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaTrash, FaUserEdit } from "react-icons/fa"
import './App.scss';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

class App extends Component {
	state = {
		users: [],
		companyId: '5c90f3971c9d4400002b3703',
		showUserModal: false,
		newUser: {
			name: 'afasdf',
			surname: '',
			email: '',
			position: '',
			office: '',
			salary: 0,
			workingHours: 0,
			profilePictureFile: null
		}
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

	addUser = () => {
		console.log(this.state.newUser);
		var FR= new FileReader();

		FR.addEventListener("load", function(e) {
			console.log(e.target.result);
		});

		FR.readAsDataURL(this.state.newUser.profilePictureFile);
	};

	toggleUserModal = () => {
		this.setState({showUserModal: !this.state.showUserModal});
	};

	handleProfileImage = (e) => {
		this.setState({ newUser: { ...this.state.newUser, profilePictureFile: e.target.files[0] } });
	};

	render() {
		const { users } = this.state;

		const columns = [
			{
				dataField: 'profilePicture',
				text: '',
				formatter: (cell) => {
					var base64data = new Buffer(cell.data).toString('base64');
					return <img src={"data:image/png;base64, " + base64data} width={30} alt="profile" />;
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
						this.setState({users: []});
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
				<Button variant="primary" onClick={this.toggleUserModal}>Add user</Button>

				<Modal show={this.state.showUserModal} onHide={this.toggleUserModal}>
					<Modal.Header closeButton>
						<Modal.Title>Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group	controlId="name">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter name"
									value={this.state.newUser.name}
									onChange={e => this.setState({ newUser: { ...this.state.newUser, name: e.target.value} })}
								/>
							</Form.Group>
							<Form.Group controlId="surname">
								<Form.Label>Surname</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter surname"
									value={this.state.newUser.surname}
									onChange={e => this.setState({ newUser: { ...this.state.newUser, surname: e.target.value} })}
								/>
							</Form.Group>
							<Form.Group controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
									value={this.state.newUser.email}
									onChange={e => this.setState({ newUser: { ...this.state.newUser, email: e.target.value} })}
								/>
							</Form.Group>
							<Form.Group controlId="position">
								<Form.Label>Position</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter position"
									value={this.state.newUser.position}
									onChange={e => this.setState({ newUser: { ...this.state.newUser, position: e.target.value} })}
								/>
							</Form.Group>
							<Form.Group controlId="office">
								<Form.Label>Office</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter office"
									value={this.state.newUser.office}
									onChange={e => this.setState({ newUser: { ...this.state.newUser, office: e.target.value} })}
								/>
							</Form.Group>
							<Form.Group controlId="salary">
								<Form.Label>Salary</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter salary"
									value={this.state.newUser.office}
									onChange={e => this.setState({ newUser: { ...this.state.newUser, salary: e.target.value} })}
								/>
							</Form.Group>
							<Form.Group controlId="workingHours">
								<Form.Label>Working hours</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter working hours"
									value={this.state.newUser.workingHours}
									onChange={e => this.setState({ newUser: { ...this.state.newUser, workingHours: e.target.value} })}
								/>
							</Form.Group>
							<Form.Group controlId="profileImage">
								<Form.Label>Profile image</Form.Label>
								<Form.Control
									type="file"
									onChange={this.handleProfileImage}
									accept=".png, .jpg"/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={this.toggleUserModal}>
							Close
						</Button>
						<Button variant="primary" onClick={this.addUser}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>

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
