import React, { Component } from 'react';
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import { FaTrash, FaUserEdit } from "react-icons/fa"
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './App.scss';

class App extends Component {
	state = {
		users: [],
		companyId: '5c90f3971c9d4400002b3703',
		showUserModal: false,
		profilePictureFile: null,
		isEditing: false,
		userInfo: {
			name: '',
			surname: '',
			email: '',
			position: '',
			office: '',
			salary: 0,
			workingHours: 0
		}
	};

	componentDidMount() {
		this.getUsers();
	}

	getUsers = () => {
		fetch(`http://localhost:3001/api/v1/company/${this.state.companyId}/users`)
			.then(res => res.json())
			.then(res => {
				this.setState({users: res.data})
			}).catch(() => {
				this.setState({users: []});
		});
	};

	deleteUser = (userId, index) => {
		axios
			.delete("http://localhost:3001/api/v1/company/user", {
				data: {
					userId: userId,
					companyId: this.state.companyId
				}
			})
			.then(() => {
				const users = [...this.state.users];
				users.splice(index, 1);
				this.setState({users});
			});
	};

	addUser = () => {
		console.log(this.state.userInfo);
		const FR = new FileReader();

		FR.addEventListener("load", (e) => {
			const base64Image = e.target.result.split(',')[1];
			axios
				.post("http://localhost:3001/api/v1/company/user", {
					companyId: this.state.companyId,
					profilePicture: base64Image,
					...this.state.userInfo
				})
				.then((result) => {
					const { data } = result.data;
					this.setState({users: [...this.state.users, data]});
					this.toggleUserModal();
					this.setState({userInfo: {}});
				});
		});

		FR.readAsDataURL(this.state.profilePictureFile);
	};

	editUser = () => {
		this.setState({isEditing: false})
	}

	toggleUserModal = () => {
		this.setState({showUserModal: !this.state.showUserModal});
	};

	onSubmitUserForm = () => {
		return this.state.isEditing ? this.editUser() : this.addUser();
	};

	render() {
		const { users } = this.state;

		const columns = [
			{
				dataField: 'profilePicture',
				text: '',
				formatter: (cell) => {
					const base64data = new Buffer(cell.data).toString('base64');
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
						this.setState({isEditing: true});
						console.log(row);
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
						<Modal.Title>User info</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.onSubmitUserForm}>
							<Form.Row>
								<Form.Group	as={Col} controlId="name">
									<Form.Label>Name</Form.Label>
									<Form.Control
										required
										type="text"
										placeholder="Enter name"
										value={this.state.userInfo.name}
										onChange={e => this.setState({userInfo: {...this.state.userInfo, name: e.target.value}})}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a name
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} controlId="surname">
									<Form.Label>Surname</Form.Label>
									<Form.Control
										required
										type="text"
										placeholder="Enter surname"
										value={this.state.userInfo.surname}
										onChange={e => this.setState({userInfo: {...this.state.userInfo, surname: e.target.value}})}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a username
									</Form.Control.Feedback>
								</Form.Group>
							</Form.Row>
							<Form.Group controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									required
									type="email"
									placeholder="Enter email"
									value={this.state.userInfo.email}
									onChange={e => this.setState({userInfo: {...this.state.userInfo, email: e.target.value}})}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter an email
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group controlId="position">
								<Form.Label>Position</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="Enter position"
									value={this.state.userInfo.position}
									onChange={e => this.setState({userInfo: {...this.state.userInfo, position: e.target.value}})}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter a position
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group controlId="office">
								<Form.Label>Office</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="Enter office"
									value={this.state.userInfo.office}
									onChange={e => this.setState({userInfo: { ...this.state.userInfo, office: e.target.value}})}
								/>
								<Form.Control.Feedback type="invalid">
									Please enter an office
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Row>
								<Form.Group as={Col} controlId="salary">
									<Form.Label>Salary</Form.Label>
									<Form.Control
										required
										type="number"
										placeholder="Enter salary"
										value={this.state.userInfo.salary}
										onChange={e => this.setState({userInfo: { ...this.state.userInfo, salary: e.target.value}})}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter a salary
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} controlId="workingHours">
									<Form.Label>Working hours</Form.Label>
									<Form.Control
										required
										type="number"
										placeholder="Enter working hours"
										value={this.state.userInfo.workingHours}
										onChange={e => this.setState({userInfo: {...this.state.userInfo, workingHours: e.target.value}})}
									/>
									<Form.Control.Feedback type="invalid">
										Please enter working hours
									</Form.Control.Feedback>
								</Form.Group>
							</Form.Row>
							<Form.Group controlId="profileImage">
								<Form.Label>Profile image</Form.Label>
								<Form.Control
									required={this.state.isEditing}
									type="file"
									onChange={e => this.setState({profilePictureFile: e.target.files[0]})}
									accept=".png, .jpg"/>
								<Form.Control.Feedback type="invalid">
									Please select and image
								</Form.Control.Feedback>
							</Form.Group>
							<Button variant="primary" type="submit">
								Save
							</Button>
						</Form>
					</Modal.Body>
				</Modal>

				<BootstrapTable bootstrap4
								bordered={false}
								hover={true}
								keyField="_id"
								data={users}
								columns={columns}
								pagination={paginationFactory(options)}
								classes='table-responsive'
				/>
			</div>
		);
	}
}

export default App;
