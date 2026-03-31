import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ScanRecord, ScanResult, TirePosition, ScanStatus, TireSide } from '../types';

type jsPDFWithAutoTable = jsPDF & {
  lastAutoTable: { finalY: number };
};

const getAgeRisk = (age: number, t: (key: string) => string): string => {
    if (age >= 10) return t('result.highRisk');
    if (age >= 6) return t('result.mediumRisk');
    return t('result.lowRisk');
}

const statusColors: Record<ScanStatus, [number, number, number]> = {
    "Good": [22, 163, 74], // Green
    "Warning": [245, 158, 11], // Yellow/Amber
    "Don't Buy": [220, 38, 38] // Red
};

export const generatePdfReport = (record: ScanRecord, t: (key: string, replacements?: Record<string, string | number>) => string) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  const getTranslatedStatus = (status: ScanStatus) => {
    const key = `scan.${status.toLowerCase().replace("'", "")}`;
    return t(key);
  };
  
  const getTranslatedPosition = (position: TirePosition) => {
      const positionKeyMap: Record<TirePosition, string> = {
        'Front Left': 'tirePositions.frontLeft',
        'Front Right': 'tirePositions.frontRight',
        'Rear Left': 'tirePositions.rearLeft',
        'Rear Right': 'tirePositions.rearRight',
        'General': 'tirePositions.general'
      };
      return t(positionKeyMap[position]);
  }
  
   const getTranslatedSide = (side: TireSide) => {
      const sideKeyMap: Record<TireSide, string> = {
        'Right Sidewall': 'tireDetail.rightSidewall',
        'Left Sidewall': 'tireDetail.leftSidewall',
        'Inside': 'tireDetail.inside',
      };
      return t(sideKeyMap[side]);
  }

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(t('result.title'), 14, 20);
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`${t('result.reportDate')}: ${record.date.toLocaleDateString()}`, 14, 30);

  let yPos = 40;

  const groupedScans = record.scans.reduce((acc, scan) => {
    (acc[scan.tirePosition] = acc[scan.tirePosition] || []).push(scan);
    return acc;
  }, {} as Record<TirePosition, ScanResult[]>);

  const tireOrder: TirePosition[] = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'General'];

  tireOrder.forEach(position => {
    const scansForPosition = groupedScans[position];
    if (!scansForPosition) return;

    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    const overallTireStatus = scansForPosition.reduce((worst, current) => {
        if (current.status === "Don't Buy") return "Don't Buy";
        if (current.status === "Warning" && worst !== "Don't Buy") return "Warning";
        return worst;
    }, "Good" as ScanStatus);

    // Tire Section Header
    doc.setFontSize(16);
    doc.setTextColor(...statusColors[overallTireStatus]);
    doc.text(`${getTranslatedPosition(position)}: ${getTranslatedStatus(overallTireStatus)}`, 14, yPos);
    yPos += 8;

    const tireDotInfo = scansForPosition.find(s => s.dotInfo)?.dotInfo;
    if (tireDotInfo) {
      const ageRisk = getAgeRisk(tireDotInfo.age, (key) => t(key));
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(`${t('result.age')}: ${tireDotInfo.age} ${t('result.years')} (${ageRisk})`, 16, yPos);
      yPos += 5;
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`DOT: ${tireDotInfo.code} (${t('result.manufactured')}: Wk ${tireDotInfo.week}, ${tireDotInfo.year})`, 16, yPos);
      yPos += 8;
    }
    
    scansForPosition.forEach(scan => {
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`${t('result.analysisFor')}: ${getTranslatedSide(scan.tireSide)}`, 16, yPos);
        yPos += 6;
        autoTable(doc, {
            startY: yPos,
            head: [['Finding', 'Details']], // These headers might also need translation
            body: scan.analysis.map(a => [a.title, a.details]),
            theme: 'striped',
            headStyles: { fillColor: [41, 51, 65] },
            didDrawPage: (data) => { yPos = data.cursor?.y || yPos; }
        });
        yPos = doc.lastAutoTable.finalY + 8;
    });
    
    yPos += 5; // spacing between sections
  });

  doc.save(`DryRotScan_Report_${record.id}.pdf`);
};