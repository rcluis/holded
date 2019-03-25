import React, { Component } from 'react';
import client from './client';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { FaTrash, FaUserEdit } from "react-icons/fa";
import Input from './components/Input';
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
		client
			.get(`company/${this.state.companyId}/users`)
			.then(res => {
				this.setState({users: res.data.data});
			})
			.catch(() => {
				this.setState({users: []});
		});
	};

	deleteUser = (userId, index) => {
		client
			.delete('company/user', {
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

	editUser = async () => {
		this.setState({isEditing: false});
		const { _id: userId, ...update } = this.state.userInfo;

		if (this.state.profilePictureFile) {
			update.profilePicture = await this.imageToBase64(this.state.profilePictureFile);
		}
		const editedUser = await client.put('company/user', {companyId: this.state.companyId, userId, update});
		console.log(editedUser)
		const userIndex = this.state.users.findIndex(({_id}) => _id === userId);
		this.setState(({ users }) => ({
			users: [
				...users,
				editedUser.data.data
			]
		}));

		// this.setState({
		// 	users: {
		// 		...this.state.users,
		// 		this.state.users[userIndex]: editedUser.data.data
		// 	}
		// }
	// );
		console.log(this.state.users);

		// this.setState({users: [...this.state.users, [this.state.users[userIndex]: editedUser]]});
		this.closeUserModal();
	};

	addUser = () => {
		console.log(this.state.userInfo);
		const FR = new FileReader();

		FR.addEventListener("load", (e) => {
			const base64Image = e.target.result.split(',')[1];
			client
				.post('company/user', {
					companyId: this.state.companyId,
					profilePicture: base64Image,
					...this.state.userInfo
				})
				.then((result) => {
					const { data } = result.data;
					this.setState({users: [...this.state.users, data]});
					this.closeUserModal();
				});
		});

		FR.readAsDataURL(this.state.profilePictureFile);
	};

	imageToBase64 = file => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result.split(',')[1]);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	toggleUserModal = () => {
		this.setState({showUserModal: !this.state.showUserModal});
	};

	closeUserModal = () => {
		this.toggleUserModal();
		this.setState({userInfo: {}});
	};

	handleChange = (event) => {
		const { target } = event;
		const value = target.value;
		const { name } = target;
		this.setState({userInfo: {...this.state.userInfo, [name]: value}});
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
					onClick: (e, column, columnIndex, row) => {
						const { profilePicture, ...userInfo } = row;
						this.setState({userInfo, isEditing: true});
						this.toggleUserModal();
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
			paginationSize: 5,
			pageStartIndex: 0,
			hideSizePerPage: true, // Hide the sizePerPage dropdown always
			// hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
			showTotal: true,
		};

		return (
			<div className="container">
				<Button variant="primary" onClick={this.toggleUserModal}>Add user</Button>
				<Modal show={this.state.showUserModal} onHide={this.closeUserModal}>
					<Modal.Header closeButton>
						<Modal.Title>User info</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={(e) => {
							e.preventDefault();
							this.state.isEditing ? this.editUser() : this.addUser();
						}}>
							<Form.Row>
								<Row>
									<Col>
										<Input title="name" value={this.state.userInfo.name} onChange={this.handleChange} />
									</Col>
									<Col>
										<Input title="surname" value={this.state.userInfo.surname} onChange={this.handleChange} />
									</Col>
								</Row>
							</Form.Row>
							<Input title="email" type="email" value={this.state.userInfo.email} onChange={this.handleChange} />
							<Input title="position" value={this.state.userInfo.position} onChange={this.handleChange} />
							<Input title="office" value={this.state.userInfo.office} onChange={this.handleChange} />
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
									required={!this.state.isEditing}
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

				<BootstrapTable
					bootstrap4
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
