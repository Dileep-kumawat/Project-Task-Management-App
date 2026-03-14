function ConfirmModal({ title, message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
            <div className="modal confirm-modal">
                <div className="modal-header">
                    <span className="modal-title">{title}</span>
                    <button className="btn-icon" onClick={onCancel}>✕</button>
                </div>
                <div className="modal-body">
                    <p className="confirm-msg">{message}</p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;