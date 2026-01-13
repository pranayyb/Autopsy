import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`relative bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden border border-slate-700/50`}
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                    <h2 className="text-xl font-semibold text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
