import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { SeoAnalysis } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface PDFExportOptions {
  analysis: SeoAnalysis;
  includeRecommendations?: boolean;
}

export async function exportAnalysisToPDF({ analysis, includeRecommendations = true }: PDFExportOptions) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Helper functions
  const addText = (text: string, x: number, y: number, fontSize = 10, fontStyle: 'normal' | 'bold' = 'normal') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    return pdf.text(text, x, y, { maxWidth: contentWidth });
  };

  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.35));
  };

  const getScoreColor = (score: number): [number, number, number] => {
    if (score >= 80) return [34, 197, 94]; // green
    if (score >= 60) return [234, 179, 8]; // yellow
    return [239, 68, 68]; // red
  };

  let currentY = margin;

  // Header
  pdf.setFillColor(59, 130, 246); // blue
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  addText('SEO Analysis Report', margin, 25, 20, 'bold');
  addText(analysis.domain, margin, 32, 12);

  currentY = 50;
  pdf.setTextColor(0, 0, 0);

  // Basic Info
  addText('Website Information', margin, currentY, 16, 'bold');
  currentY += 10;
  
  addText(`URL: ${analysis.url}`, margin, currentY);
  currentY += 6;
  addText(`Title: ${analysis.title || 'N/A'}`, margin, currentY);
  currentY += 6;
  addText(`Analyzed: ${formatDistanceToNow(new Date(analysis.analyzedAt), { addSuffix: true })}`, margin, currentY);
  currentY += 15;

  // SEO Scores
  addText('SEO Score Overview', margin, currentY, 16, 'bold');
  currentY += 15;

  const scores = [
    { name: 'Overall Score', value: analysis.scores?.overall || 0 },
    { name: 'Meta Tags', value: analysis.scores?.meta || 0 },
    { name: 'Social Media', value: analysis.scores?.social || 0 },
    { name: 'Technical', value: analysis.scores?.technical || 0 }
  ];

  scores.forEach((score, index) => {
    const x = margin + (index % 2) * (contentWidth / 2);
    const y = currentY + Math.floor(index / 2) * 25;
    
    // Score circle
    const [r, g, b] = getScoreColor(score.value);
    pdf.setFillColor(r, g, b);
    pdf.circle(x + 8, y - 2, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(score.value.toString(), x + (score.value < 100 ? 5 : 3), y + 1);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    addText(score.name, x + 20, y, 10, 'bold');
  });

  currentY += 55;

  // Meta Tags Analysis
  if (analysis.metaTags || analysis.ogTags || analysis.twitterTags) {
    addText('Meta Tags Analysis', margin, currentY, 14, 'bold');
    currentY += 10;

    // Title Tag
    if (analysis.metaTags?.title) {
      addText('Title Tag:', margin, currentY, 10, 'bold');
      currentY += 5;
      currentY = addWrappedText(analysis.metaTags.title, margin + 5, currentY, contentWidth - 10, 9);
      currentY += 3;
      addText(`Length: ${analysis.metaTags.title.length} characters`, margin + 5, currentY, 8);
      currentY += 8;
    }

    // Meta Description
    if (analysis.metaTags?.description) {
      addText('Meta Description:', margin, currentY, 10, 'bold');
      currentY += 5;
      currentY = addWrappedText(analysis.metaTags.description, margin + 5, currentY, contentWidth - 10, 9);
      currentY += 3;
      addText(`Length: ${analysis.metaTags.description.length} characters`, margin + 5, currentY, 8);
      currentY += 10;
    }

    // Open Graph Tags
    if (analysis.ogTags && Object.keys(analysis.ogTags).length > 0) {
      addText('Open Graph Tags:', margin, currentY, 10, 'bold');
      currentY += 8;
      
      Object.entries(analysis.ogTags).forEach(([property, content]) => {
        addText(`${property}:`, margin + 5, currentY, 9, 'bold');
        currentY += 4;
        currentY = addWrappedText(content, margin + 10, currentY, contentWidth - 20, 8);
        currentY += 5;
      });
    }
  }

  // Recommendations
  if (includeRecommendations && analysis.recommendations && analysis.recommendations.length > 0) {
    // Check if we need a new page
    if (currentY > pageHeight - 60) {
      pdf.addPage();
      currentY = margin;
    }

    addText('Recommendations', margin, currentY, 14, 'bold');
    currentY += 10;

    analysis.recommendations.forEach((rec, index) => {
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        currentY = margin;
      }

      // Recommendation type indicator
      const [r, g, b] = rec.type === 'success' ? [34, 197, 94] : 
                        rec.type === 'warning' ? [234, 179, 8] : [239, 68, 68];
      pdf.setFillColor(r, g, b);
      pdf.circle(margin + 3, currentY - 2, 3, 'F');

      addText(`${index + 1}. ${rec.title}`, margin + 10, currentY, 10, 'bold');
      currentY += 6;
      
      currentY = addWrappedText(rec.description, margin + 10, currentY, contentWidth - 20, 9);
      
      if (rec.code) {
        currentY += 5;
        pdf.setFillColor(245, 245, 245);
        const codeHeight = rec.code.split('\n').length * 4 + 4;
        pdf.rect(margin + 10, currentY - 2, contentWidth - 20, codeHeight, 'F');
        
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(8);
        pdf.text(rec.code, margin + 12, currentY + 2);
        pdf.setFont('helvetica', 'normal');
        
        currentY += codeHeight + 2;
      }
      
      currentY += 8;
    });
  }

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
    pdf.text('Generated by SEO Meta Analyzer', margin, pageHeight - 10);
  }

  // Generate filename
  const date = new Date().toISOString().split('T')[0];
  const filename = `seo-analysis-${analysis.domain}-${date}.pdf`;

  // Download the PDF
  pdf.save(filename);
}