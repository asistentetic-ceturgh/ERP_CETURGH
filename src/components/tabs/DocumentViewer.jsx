// components/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Download,
    ChevronLeft,
    ChevronRight,
    FileText,
    Image as ImageIcon,
    Maximize2,
    AlertCircle,
    ZoomIn,
    ZoomOut
} from 'lucide-react';

const DocumentViewer = ({ files = [], initialIndex = 0, onClose, apiBase }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [scale, setScale] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentFile = files[currentIndex];
    const fileExtension = currentFile?.split('.').pop()?.toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension);

    // Obtener URL completa
    const getFileUrl = (filePath) => {
        if (!filePath) return '';

        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath;
        }

        const isGuia = filePath.toLowerCase().includes('/guias/');
        const isComprobante = filePath.toLowerCase().includes('/comprobantes/');

        if (isGuia || isComprobante) {
            const endpoint = isGuia ? 'descargar_guia.php' : 'descargar_comprobante.php';
            return `${apiBase}${endpoint}?file=${encodeURIComponent(filePath)}`;
        }

        return `${apiBase}${filePath}`;
    };

    // Navegación por teclado (Flechas y Escape)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && currentIndex > 0) setCurrentIndex(prev => prev - 1);
            if (e.key === 'ArrowRight' && currentIndex < files.length - 1) setCurrentIndex(prev => prev + 1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, files.length, onClose]);

    // Resetear estados al cambiar de archivo
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        setScale(1);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    const toggleFullscreen = () => {
        const elem = document.getElementById('document-viewer-container');
        if (!document.fullscreenElement) {
            elem?.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    };

    const handleDownload = () => {
        if (!currentFile) return;
        const url = getFileUrl(currentFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = currentFile.split('/').pop();
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLoadSuccess = () => setIsLoading(false);
    const handleLoadError = () => {
        setIsLoading(false);
        setError('No se pudo cargar el archivo. Es posible que el documento no exista o el formato no sea compatible.');
    };

    if (!files || files.length === 0) return null;

    const fileUrl = getFileUrl(currentFile);
    const fileName = currentFile?.split('/').pop() || 'documento';

    return createPortal(
        <div
            id="document-viewer-container"
            className="fixed inset-0 z-[99999] bg-[#0b0f19]/95 backdrop-blur-md flex flex-col select-none animate-fade-in"
        >
            {/* BARRA SUPERIOR (HEADER) - Estilo Granate de la empresa */}
            <header className="flex items-center justify-between px-6 py-4 bg-[#7a0808] border-b-2 border-[#d4a325]/40 shadow-lg z-20">
                {/* Meta Información del Documento */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-[#540505] rounded-lg shrink-0 border border-[#d4a325]/20">
                        {isImage ? (
                            <ImageIcon size={18} className="text-[#d4a325]" />
                        ) : (
                            <FileText size={18} className="text-white" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-white font-medium text-sm truncate max-w-sm md:max-w-xl" title={fileName}>
                            {fileName}
                        </span>
                        <span className="text-slate-300 text-xs font-mono mt-0.5">
                            Archivo {currentIndex + 1} de {files.length}
                        </span>
                    </div>
                </div>

                {/* Controles y Herramientas */}
                <div className="flex items-center gap-2 ml-4">
                    {/* Controles de Zoom para imágenes */}
                    {isImage && !error && (
                        <div className="flex items-center bg-[#540505] p-1 rounded-xl border border-[#d4a325]/30 mr-2">
                            <button
                                onClick={() => setScale(prev => Math.max(0.5, prev - 0.25))}
                                className="p-2 rounded-lg text-slate-300 hover:text-[#d4a325] hover:bg-[#7a0808]/50 transition-all active:scale-95"
                                title="Alejar"
                            >
                                <ZoomOut size={16} />
                            </button>
                            <span className="text-xs font-mono text-[#d4a325] w-12 text-center select-none font-bold">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={() => setScale(prev => Math.min(3, prev + 0.25))}
                                className="p-2 rounded-lg text-slate-300 hover:text-[#d4a325] hover:bg-[#7a0808]/50 transition-all active:scale-95"
                                title="Acercar"
                            >
                                <ZoomIn size={16} />
                            </button>
                        </div>
                    )}

                    {/* Botón Pantalla Completa */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2.5 rounded-xl bg-[#540505] text-slate-200 hover:text-[#d4a325] hover:bg-[#660606] border border-[#d4a325]/20 transition-all active:scale-95"
                        title="Pantalla completa"
                    >
                        <Maximize2 size={16} />
                    </button>

                    {/* Botón Descargar */}
                    <button
                        onClick={handleDownload}
                        className="p-2.5 rounded-xl bg-[#540505] text-slate-200 hover:text-[#d4a325] hover:bg-[#660606] border border-[#d4a325]/20 transition-all active:scale-95"
                        title="Descargar archivo"
                    >
                        <Download size={16} />
                    </button>

                    {/* Separador */}
                    <div className="h-6 w-px bg-[#540505] mx-1" />

                    {/* Botón Cerrar */}
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl bg-[#d4a325] text-[#540505] hover:bg-white hover:text-[#7a0808] transition-all font-bold active:scale-95"
                        title="Cerrar visor (Esc)"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </header>

            {/* AREA CENTRAL DE VISUALIZACIÓN */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                {/* Botón Anterior */}
                {currentIndex > 0 && (
                    <button
                        onClick={() => setCurrentIndex(prev => prev - 1)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-[#7a0808]/90 hover:bg-[#7a0808] border-2 border-[#d4a325]/60 text-[#d4a325] hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm"
                        title="Anterior"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>
                )}

                {/* Botón Siguiente */}
                {currentIndex < files.length - 1 && (
                    <button
                        onClick={() => setCurrentIndex(prev => prev + 1)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-[#7a0808]/90 hover:bg-[#7a0808] border-2 border-[#d4a325]/60 text-[#d4a325] hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm"
                        title="Siguiente"
                    >
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                )}

                {/* Contenedor del Documento */}
                <div className="w-full h-full flex items-center justify-center p-6 md:p-12">
                    {/* Loader */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0b0f19]/40 backdrop-blur-sm transition-opacity">
                            <div className="w-10 h-10 border-3 border-[#d4a325]/20 border-t-[#d4a325] rounded-full animate-spin" />
                            <span className="text-xs text-slate-300 mt-3 font-medium tracking-wider font-mono">CARGANDO DOCUMENTO</span>
                        </div>
                    )}

                    {/* Estado de Error */}
                    {error ? (
                        <div className="text-center p-8 max-w-md bg-white border-2 border-[#7a0808]/20 rounded-2xl shadow-2xl animate-scale-in z-20">
                            <div className="w-12 h-12 bg-[#7a0808]/10 text-[#7a0808] rounded-xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-slate-800 font-bold mb-2">Error de visualización</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{error}</p>
                            <button
                                onClick={handleDownload}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7a0808] hover:bg-[#660606] text-white text-sm font-medium rounded-xl transition-all shadow-lg hover:shadow-[#7a0808]/20 active:scale-[0.98]"
                            >
                                <Download size={16} />
                                Descargar archivo directamente
                            </button>
                        </div>
                    ) : isImage ? (
                        <div className="w-full h-full flex items-center justify-center overflow-auto pointer-events-auto">
                            <img
                                src={fileUrl}
                                alt={fileName}
                                style={{ transform: `scale(${scale})`, transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none bg-white p-2 border border-slate-200"
                                onLoad={handleLoadSuccess}
                                onError={handleLoadError}
                            />
                        </div>
                    ) : (
                        <iframe
                            src={fileUrl}
                            className="w-full h-full rounded-xl bg-white shadow-2xl border-2 border-[#7a0808]/20"
                            title={fileName}
                            onLoad={handleLoadSuccess}
                            onError={handleLoadError}
                        />
                    )}
                </div>
            </div>

            <style>{`
                @keyframes viewer-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes viewer-scale-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: viewer-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-scale-in {
                    animation: viewer-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default DocumentViewer;