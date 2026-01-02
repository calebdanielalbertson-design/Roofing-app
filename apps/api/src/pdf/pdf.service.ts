import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Estimate, Job, MeasurementSet } from '@prisma/client';

@Injectable()
export class PdfService {
    async generateTransparencyPdf(estimate: any, job: any): Promise<Buffer> {
        const html = this.getHtmlTemplate(estimate, job);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some envs
        });
        const page = await browser.newPage();

        // Set content
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        await browser.close();

        // Cast to Buffer (Puppeteer returns Uint8Array in new versions but Buffer compatible)
        return Buffer.from(pdfBuffer);
    }

    private getHtmlTemplate(estimate: any, job: any): string {
        const measurements = estimate.measurementSet || {};

        const linesHtml = estimate.lines.map((line: any) => `
        <tr class="item-row">
            <td>${line.lineItem?.code || ''}</td>
            <td>
                <div class="description">${line.lineItem?.name || ''}</div>
                <div class="sub-desc">${line.lineItem?.description || ''}</div>
            </td>
            <td class="text-right">${Number(line.quantity).toFixed(2)}</td>
            <td class="text-center">${line.lineItem?.unit || ''}</td>
            <td class="text-right">
                <div>Mat: $${Number(line.material).toFixed(2)}</div>
                <div>Lab: $${Number(line.labor).toFixed(2)}</div>
                <div>Eqp: $${Number(line.equipment).toFixed(2)}</div>
            </td>
            <td class="text-right font-bold">$${Number(line.extended).toFixed(2)}</td>
        </tr>
    `).join('');

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.4; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }
          .company-info { font-size: 20px; font-weight: bold; }
          .job-info { text-align: right; }
          .section-title { background: #eee; padding: 5px 10px; font-weight: bold; margin-top: 20px; border-bottom: 2px solid #ccc; }
          
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { text-align: left; background: #f9f9f9; padding: 8px; border-bottom: 1px solid #ddd; }
          td { padding: 8px; border-bottom: 1px solid #eee; vertical-align: top; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          
          .measurements-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 10px 0; }
          .measurement-box { border: 1px solid #ddd; padding: 10px; text-align: center; }
          .m-val { font-size: 18px; font-weight: bold; }
          .m-label { font-size: 11px; color: #666; text-transform: uppercase; }
          
          .totals-section { margin-top: 30px; border-top: 2px solid #333; padding-top: 10px; float: right; width: 300px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .grand-total { font-size: 18px; font-weight: bold; border-top: 1px solid #ccc; padding-top: 5px; margin-top: 5px; }
          
          .description { font-weight: bold; }
          .sub-desc { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
           <div class="company-info">
             ${job.company?.name || 'Demo Roofing Co.'}<br>
             <span style="font-size: 12px; font-weight: normal; color: #666">Professional Roofing Services</span>
           </div>
           <div class="job-info">
             <strong>Job for:</strong> ${job.customerName}<br>
             ${job.address}<br>
             ${job.city || ''}, ${job.state || ''} ${job.zip || ''}<br>
             <br>
             <strong>Claim #:</strong> ${job.claimNumber || 'N/A'}<br>
             <strong>Carrier:</strong> ${job.carrierName || 'N/A'}
           </div>
        </div>

        <div class="section-title">Measurements</div>
        <div class="measurements-grid">
           <div class="measurement-box">
             <div class="m-val">${measurements.totalRoofAreaSqFt || 0}</div>
             <div class="m-label">Sq Ft</div>
           </div>
           <div class="measurement-box">
             <div class="m-val">${measurements.ridgeLf || 0}</div>
             <div class="m-label">Ridge LF</div>
           </div>
           <div class="measurement-box">
             <div class="m-val">${measurements.valleyLf || 0}</div>
             <div class="m-label">Valley LF</div>
           </div>
           <div class="measurement-box">
             <div class="m-val">${measurements.eaveLf || 0}</div>
             <div class="m-label">Eave LF</div>
           </div>
        </div>

        <div class="section-title">Scope of Work (Transparency Detail)</div>
        <table>
            <thead>
                <tr>
                    <th width="10%">Code</th>
                    <th width="40%">Description</th>
                    <th width="10%" class="text-right">Qty</th>
                    <th width="5%" class="text-center">Unit</th>
                    <th width="20%" class="text-right">Cost Breakdown</th>
                    <th width="15%" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${linesHtml}
            </tbody>
        </table>

        <div class="totals-section">
            <div class="total-row">
                <span>Material Subtotal:</span>
                <span>$${Number(estimate.totalMaterial).toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Labor Subtotal:</span>
                <span>$${Number(estimate.totalLabor).toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Equipment Subtotal:</span>
                <span>$${Number(estimate.totalEquipment).toFixed(2)}</span>
            </div>
            <div class="total-row" style="margin-top: 10px; color: #666;">
                <span>Overhead (10%):</span>
                <span>$${Number(estimate.totalOverhead).toFixed(2)}</span>
            </div>
            <div class="total-row" style="color: #666;">
                <span>Profit (10%):</span>
                <span>$${Number(estimate.totalProfit).toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
                <span>Grand Total:</span>
                <span>$${Number(estimate.grandTotal).toFixed(2)}</span>
            </div>
        </div>

        <div style="clear: both; margin-top: 50px; font-size: 11px; color: #999; text-align: center;">
            Generated by RoofSoftware MVP • ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `;
    }
}
