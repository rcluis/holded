import React, { Component } from 'react';
import client from './client';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, Modal, Form, Col, Row, Alert } from 'react-bootstrap';
import { FaTrash, FaUserEdit } from "react-icons/fa";
import Input from './components/Input';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const initialUserInfo = {
	name: '',
	surname: '',
	email: '',
	position: '',
	office: '',
	salary: 0,
	workingHours: 0
};

class App extends Component {
	state = {
		users: [],
		companyId: '5c90f3971c9d4400002b3703',
		showUserModal: false,
		profilePictureFile: null,
		isEditing: false,
		userInfo: {
			...initialUserInfo
		},
		alertMessage: '',
		showAlert: false,
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

	deleteUser = async (userId, index) => {
		const result = await client.delete('company/user', {data: {userId: userId,companyId: this.state.companyId}});
		const { message } = result.data;
		const users = [...this.state.users];
		users.splice(index, 1);
		this.setState({users});
		this.showAlert(message);
	};

	editUser = async () => {
		this.setState({isEditing: false});
		const { _id: userId, ...update } = this.state.userInfo;

		if (this.state.profilePictureFile) {
			update.profilePicture = await this.imageToBase64(this.state.profilePictureFile);
		}
		const result = await client.put('company/user', {companyId: this.state.companyId, userId, update});
		const { data, message } = result.data;
		const userIndex = this.state.users.findIndex(({_id}) => _id === userId);

		this.setState(({ users: prevUsers }) => {
			const users = [...prevUsers];
			users[userIndex] = data;
			return {
				users
			}
		});
		this.closeUserModal();
		this.showAlert(message);
	};

	addUser = async () => {
		const profilePicture = await this.imageToBase64(this.state.profilePictureFile);
		const result = await client.post('company/user', {companyId: this.state.companyId,profilePicture, ...this.state.userInfo});
		const { data, message } = result.data;
		this.setState({users: [...this.state.users, data]});
		this.closeUserModal();
		this.showAlert(message);
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

	showAlert = message => {
		this.setState({showAlert: true, alertMessage: message});
	};

	toggleUserModal = () => {
		this.setState({showUserModal: !this.state.showUserModal});
	};

	closeUserModal = () => {
		this.toggleUserModal();
		this.setState({userInfo: {...initialUserInfo}});
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
			hideSizePerPage: true,
			showTotal: true,
		};

		return (
			<div className="container pt-3">
				<Alert dismissible variant="success" show={this.state.showAlert} onClose={() => this.setState({showAlert: false})}>
					{this.state.alertMessage}
				</Alert>
				<Button className="mb-3" variant="primary" onClick={this.toggleUserModal}>Add user</Button>
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
							<Row>
								<Col>
									<Input title="salary" value={this.state.userInfo.salary} onChange={this.handleChange} />
								</Col>
								<Col>
									<Input title="workingHours" value={this.state.userInfo.workingHours} onChange={this.handleChange} />
								</Col>
							</Row>
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
							<Button variant="primary" type="submit">Save</Button>
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
