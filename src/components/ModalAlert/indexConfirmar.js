import React,{ useCallback } from 'react';
import PropTypes from 'prop-types';
import "../ModalAlert/ModalAlert.css";

const ModalAlertConfirmar = ({ onClick, onClickSecondary, msj, textBtn, textBtn2 }) => {
	const onCloseHandle = useCallback((event) => {
		event.preventDefault();
		if (!onClick) return;
		onClick();
	}, [onClick]);

	const onConfirm = useCallback((event) => {
		event.preventDefault();
		if (!onClickSecondary) return;
		onClickSecondary();
	}, [onClickSecondary]);

	return (

		<div className="container text-center">
			<div className="row row-cols-2">
				<div className="col-12 col-md-12">
				</div>
				<div className="col-12 col-md-12"><h3>{msj}</h3></div>
			</div>
			<div class="row justify-content-center">
					<div className="col-4">
						<button className="buttomEliminar" type="submit" onClick={onCloseHandle}>{textBtn}</button>
					</div>
					<div className="col-4">
						<button className="buttomEliminar" type="submit" onClick={onConfirm}>{textBtn2}</button>
					</div>
				</div>
		</div>

	);
};

ModalAlertConfirmar.defaultProps = {
	msj: '',
	textBtn: '',
	textBtn2: '',
	textBtnSecondary: '',
	display: '',
	img: '',
	onClick: undefined,
	onClickSecondary: undefined,
};

ModalAlertConfirmar.propTypes = {
	msj: PropTypes.string,
	textBtn: PropTypes.string,
	textBtn2: PropTypes.string,
	textBtnSecondary: PropTypes.string,
	img: PropTypes.string,
	oneOrTwo: PropTypes.bool,
	display: PropTypes.string,
	onClick: PropTypes.func,
	onClickSecondary: PropTypes.func,

};

export default ModalAlertConfirmar;