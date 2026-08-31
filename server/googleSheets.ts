import { google } from 'googleapis';

const SHEET_NAMES = {
  PRODUCTS: 'PRODUCTS',
  CUSTOMERS: 'CUSTOMERS',
  ORDERS: 'ORDERS',
  QUOTE_REQUESTS: 'QUOTE REQUESTS',
  CONTACT_MESSAGES: 'CONTACT MESSAGES',
  REVIEWS: 'REVIEWS',
};

const SHEET_HEADERS: Record<string, string[]> = {
  [SHEET_NAMES.PRODUCTS]: [
    'Product ID',
    'Product Name',
    'Category',
    'Description',
    'Wood Type',
    'Material',
    'Dimensions',
    'Finish',
    'Glass Option',
    'Price',
    'Original Price',
    'Discount',
    'Stock Status',
    'Product Image',
    'Created Date'
  ],
  [SHEET_NAMES.CUSTOMERS]: [
    'Customer ID',
    'Name',
    'Phone',
    'Email',
    'Address',
    'City',
    'State',
    'Pincode',
    'Created Date'
  ],
  [SHEET_NAMES.ORDERS]: [
    'Order ID',
    'Customer ID',
    'Customer Name',
    'Phone',
    'Product ID',
    'Product Name',
    'Quantity',
    'Price',
    'Total Amount',
    'Delivery Address',
    'Order Date',
    'Payment Status',
    'Order Status'
  ],
  [SHEET_NAMES.QUOTE_REQUESTS]: [
    'Quote ID',
    'Customer Name',
    'Phone',
    'Email',
    'Door/Window',
    'Width',
    'Height',
    'Wood Type',
    'Design Preference',
    'Finish',
    'Glass Option',
    'Quantity',
    'Location',
    'Additional Requirements',
    'Uploaded Design',
    'Request Date',
    'Quote Status'
  ],
  [SHEET_NAMES.CONTACT_MESSAGES]: [
    'Message ID',
    'Name',
    'Phone',
    'Email',
    'Message',
    'Date',
    'Status'
  ],
  [SHEET_NAMES.REVIEWS]: [
    'Review ID',
    'Customer Name',
    'Product',
    'Rating',
    'Review',
    'Image',
    'Date',
    'Approval Status'
  ]
};

export class GoogleSheetsService {
  private sheets: any = null;
  private spreadsheetId: string | null = null;
  private isConfigured: boolean = false;
  private initPromise: Promise<boolean> | null = null;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEET_ID || null;
  }

  private async initializeClient(): Promise<boolean> {
    try {
      this.spreadsheetId = process.env.GOOGLE_SHEET_ID || null;
      if (!this.spreadsheetId) {
        this.isConfigured = false;
        return false;
      }

      let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      let privateKey = process.env.GOOGLE_PRIVATE_KEY;

      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
          const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
          clientEmail = parsed.client_email;
          privateKey = parsed.private_key;
        } catch (e) {
          console.warn('[GoogleSheets] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON');
        }
      }

      if (!clientEmail || !privateKey) {
        this.isConfigured = false;
        return false;
      }

      // Handle escaped newline strings
      const formattedKey = privateKey.replace(/\\n/g, '\n');

      const auth = new google.auth.JWT({
        email: clientEmail,
        key: formattedKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.isConfigured = true;

      // Verify and bootstrap headers if necessary
      await this.ensureSheetsAndHeaders();
      console.log('[GoogleSheets] Successfully connected to Spreadsheet:', this.spreadsheetId);
      return true;
    } catch (err: any) {
      console.error('[GoogleSheets] Initialization error:', err?.message || err);
      this.isConfigured = false;
      return false;
    }
  }

  public async getStatus(): Promise<{ configured: boolean; sheetId: string | null; error?: string }> {
    if (!this.initPromise) {
      this.initPromise = this.initializeClient();
    }
    const ready = await this.initPromise;
    return {
      configured: ready && this.isConfigured,
      sheetId: this.spreadsheetId,
    };
  }

  private async ensureSheetsAndHeaders() {
    if (!this.sheets || !this.spreadsheetId) return;

    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const existingSheets = (response.data.sheets || []).map((s: any) => s.properties?.title);
      const sheetsToCreate: string[] = [];

      for (const sheetName of Object.values(SHEET_NAMES)) {
        if (!existingSheets.includes(sheetName)) {
          sheetsToCreate.push(sheetName);
        }
      }

      if (sheetsToCreate.length > 0) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: sheetsToCreate.map((title) => ({
              addSheet: { properties: { title } },
            })),
          },
        });
      }

      // Check header in each sheet
      for (const [sheetName, headers] of Object.entries(SHEET_HEADERS)) {
        try {
          const headerCheck = await this.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: `${sheetName}!A1:Z1`,
          });

          if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
            await this.sheets.spreadsheets.values.update({
              spreadsheetId: this.spreadsheetId,
              range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [headers],
              },
            });
          }
        } catch (e: any) {
          console.warn(`[GoogleSheets] Warning setting headers on ${sheetName}:`, e.message);
        }
      }
    } catch (error: any) {
      console.warn('[GoogleSheets] Could not ensure headers:', error.message);
    }
  }

  public async appendRow(sheetName: string, rowValues: (string | number)[]): Promise<boolean> {
    const isReady = await this.getStatus();
    if (!isReady.configured || !this.sheets || !this.spreadsheetId) {
      return false;
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:A`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowValues],
        },
      });
      return true;
    } catch (err: any) {
      console.error(`[GoogleSheets] Error appending to ${sheetName}:`, err.message);
      return false;
    }
  }

  public async updateRowStatus(
    sheetName: string,
    idColumnIndex: number,
    idValue: string,
    targetColumnIndex: number,
    newValue: string
  ): Promise<boolean> {
    const isReady = await this.getStatus();
    if (!isReady.configured || !this.sheets || !this.spreadsheetId) {
      return false;
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      const rows: any[][] = response.data.values || [];
      const rowIndex = rows.findIndex((row) => row[idColumnIndex] === idValue);

      if (rowIndex === -1) return false;

      // 1-based row index in Sheets
      const sheetRowNumber = rowIndex + 1;
      const colLetter = String.fromCharCode(65 + targetColumnIndex);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!${colLetter}${sheetRowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[newValue]],
        },
      });
      return true;
    } catch (err: any) {
      console.error(`[GoogleSheets] Error updating status in ${sheetName}:`, err.message);
      return false;
    }
  }

  public async readRows(sheetName: string): Promise<any[][] | null> {
    const isReady = await this.getStatus();
    if (!isReady.configured || !this.sheets || !this.spreadsheetId) {
      return null;
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:Z`,
      });
      return response.data.values || [];
    } catch (err: any) {
      console.error(`[GoogleSheets] Error reading rows from ${sheetName}:`, err.message);
      return null;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
export { SHEET_NAMES, SHEET_HEADERS };
