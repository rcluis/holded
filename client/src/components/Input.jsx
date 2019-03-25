import React from 'react';
import { Form } from 'react-bootstrap';

const Input = (props) => {
	const labelStyle = {
		textTransform: 'capitalize'
	};

	return (
		<Form.Group	controlId={props.title}>
			<Form.Label style={labelStyle}>{props.title}</Form.Label>
			<Form.Control
				required={props.required || true}
				name={props.title}
				isValid={props.validated === 'has-success'}
				isInvalid={props.validated === 'has-error'}
				type={props.type || 'text'}
				placeholder={`Enter ${props.title}`}
				value={props.value}
				onChange={props.onChange}
			/>
			<Form.Control.Feedback type="invalid">
				Please enter a valid {props.title}
			</Form.Control.Feedback>
		</Form.Group>
	);
};

export default Input;
