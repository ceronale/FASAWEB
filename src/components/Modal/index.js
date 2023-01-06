import { useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import cs from 'classnames';
import React from 'react';

import closeX from '../img/closeX.svg'

import styles from './styles.module.css';

const Modal = ({
	title,
	subtitle,
	children,
	onClick,
	showModal,
	size = 'md',
}) => {
	const onCloseHandle = useCallback((event) => {
		event.preventDefault();
	
		if (!onClick) return;

		onClick();
	}, [onClick]);

	return (
		<CSSTransition
			in={showModal}
			timeout={300}
			classNames="alert"
			unmountOnExit
		>
			<div className={styles.modal}>
				<div
					className={cs('bg-white shadow m-auto p-3 border-0', {
						[styles.sm]: size === 'sm',
						[styles.md]: size !== 'sm' || size === 'md',
						[styles.lg]: size === 'lg',
						[styles.xl]: size === 'xl',
						[styles.xxl]: size === 'xxl',
					})}
					style={{ borderRadius: '16px' }}
				>
					<div className="modal-header py-2 border-0 d-flex justify-content-between align-items-center mb-2 mt-2">
						<div>
							<h5 className={`${styles.modalTitle} display-font mb-1`}>
								{title}
							</h5>
							{subtitle && (
								<p className={`${styles.modalSubtitle}`}>{subtitle}</p>
							)}
						</div>
						<a
							href="!#"
							data-testid="printed-username"
							className={`p-0 ${styles.close}`}
							onClick={onCloseHandle}
						>
							<span aria-hidden="true" className="p-0 pe-4">
								<img src={closeX} alt="Cuenta" width="12" />
							</span>
						</a>
					</div>
					<div className="modal-body p-0 px-0">{children}</div>
				</div>
			</div>
		</CSSTransition>
	);
};

Modal.defaultProps = {
	title: '',
	subtitle: '',
	children: null,
	size: '',
	onClick: undefined,
};

Modal.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.string,
	children: PropTypes.node,
	onClick: PropTypes.func,
	showModal: PropTypes.bool.isRequired,
	size: PropTypes.string,
};

export default Modal;
