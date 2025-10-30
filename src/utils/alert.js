import React from "react";


export default function ModalAlert({ show, onClose, title, message }) {
    if (!show) return null;
    return (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,.35)" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body"><p>{message}</p></div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={onClose}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
}