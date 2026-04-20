import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../lib/utils';

export const ReportGenerator = () => {
  const { filteredExpenses, totalIncome, totalExpenses, totalBalance, filters } = useExpenses();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Importación dinámica para evitar errores si no está instalado aún
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();
      const monthYear = filters.month;

      // Configuración de estilo
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text('Reporte Financiero Mensual', 14, 22);
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Periodo: ${monthYear}`, 14, 30);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 36);

      // Resumen Ejecutivo
      doc.setDrawColor(230);
      doc.line(14, 42, 196, 42);

      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('Resumen del Periodo', 14, 52);

      const summaryData = [
        ['Ingresos Totales', formatCurrency(totalIncome)],
        ['Gastos Totales', formatCurrency(totalExpenses)],
        ['Balance Neto', formatCurrency(totalBalance)]
      ];

      autoTable(doc, {
        startY: 56,
        head: [['Concepto', 'Monto']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillStyle: [79, 70, 229] }
      });

      // Detalle de Transacciones
      doc.text('Detalle de Transacciones', 14, doc.lastAutoTable.finalY + 15);

      const tableData = filteredExpenses.map(exp => [
        exp.date,
        exp.description,
        exp.category,
        exp.type === 'income' ? 'Ingreso' : 'Gasto',
        formatCurrency(exp.amount)
      ]);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto']],
        body: tableData,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [15, 23, 42] }
      });

      doc.save(`reporte-${monthYear}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Para exportar PDF debes instalar las dependencias: npm install jspdf jspdf-autotable');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all disabled:opacity-50"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      {isGenerating ? 'Generando...' : 'Exportar PDF'}
    </button>
  );
};
