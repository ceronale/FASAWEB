import React,{ useCallback } from 'react';
import PropTypes from 'prop-types';

const ModalAlert = ({ onClick, msj, textBtn }) => {
	const onCloseHandle = useCallback((event) => {
		event.preventDefault();
		if (!onClick) return;
		onClick();
	}, [onClick]);

	return (
		<div className="container text-center">
			<div className="row row-cols-2">
				<div className="col-12 col-md-12">
				</div>
				<div className="col-12 col-md-12"><h3>{msj}</h3></div>

				<div className="col-12 col-md-12 mt-4">
					<div className="row justify-content-md-center">
						<button className="buttomCrearCuenta" type="submit" onClick={onCloseHandle}>{textBtn}</button>
					</div>
				</div>
			</div>
		</div>
	);
};

ModalAlert.defaultProps = {
	msj: '',
	textBtn: '',
	textBtnSecondary: '',
	display: '',
	img: '',
	onClick: undefined,
	onClickSecondary: undefined,
};

ModalAlert.propTypes = {
	msj: PropTypes.string,
	textBtn: PropTypes.string,
	textBtnSecondary: PropTypes.string,
	img: PropTypes.string,
	oneOrTwo: PropTypes.bool,
	display: PropTypes.string,
	onClick: PropTypes.func,
	onClickSecondary: PropTypes.func,

};

export default ModalAlert;
