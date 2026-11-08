/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, ProductRequest, Product } from '../types';

export interface GoogleSheetsExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  rowsCount: number;
}

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Creates a new spreadsheet in user's Google Drive via Google Sheets API.
 */
export async function createSpreadsheet(
  accessToken: string,
  title: string,
  sheetsTitles: string[] = ['البيانات']
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const response = await fetch(SHEETS_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
        locale: 'ar_SA',
      },
      sheets: sheetsTitles.map((st, index) => ({
        properties: {
          sheetId: index,
          title: st,
          rightToLeft: true, // Arabic RTL layout for spreadsheet
          gridProperties: {
            frozenRowCount: 1, // Freeze header row
          },
        },
      })),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`فشل إنشاء جدول بيانات Google Sheets: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Appends or updates values in a specific range of the spreadsheet.
 */
export async function updateSheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
): Promise<void> {
  const encodedRange = encodeURIComponent(range);
  const url = `${SHEETS_API_BASE}/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range,
      majorDimension: 'ROWS',
      values,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`فشل إدخال البيانات في Google Sheets: ${response.status} - ${errorBody}`);
  }
}

/**
 * Formats header row with styling (Bold, Background Color matching brand palette).
 */
export async function formatSheetHeader(
  accessToken: string,
  spreadsheetId: string,
  sheetId: number = 0,
  columnCount: number = 10
): Promise<void> {
  try {
    await fetch(`${SHEETS_API_BASE}/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: columnCount,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.0588, // #0F1E36 brand navy
                    green: 0.1176,
                    blue: 0.2117,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1,
                      green: 1,
                      blue: 1,
                    },
                    fontSize: 11,
                    bold: true,
                  },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
        ],
      }),
    });
  } catch (err) {
    // Non-fatal if styling fails
    console.warn('Formatting sheet header failed:', err);
  }
}

/**
 * Exports all Orders to a new Google Spreadsheet.
 */
export async function exportOrdersToGoogleSheets(
  accessToken: string,
  orders: Order[]
): Promise<GoogleSheetsExportResult> {
  const dateStr = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const title = `متجر الوقزة - سجل الطلبات (${dateStr})`;
  const sheetTitle = 'سجل الطلبات';

  // 1. Create Spreadsheet
  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, title, [sheetTitle]);

  // 2. Prepare Headers and Rows
  const headers = [
    'رقم الطلب',
    'اسم العميل',
    'رقم الهاتف',
    'المحافظة',
    'المدينة / العنوان',
    'طريقة الدفع',
    'المجموع الفرعي (ر.س)',
    'رسوم التوصيل (ر.س)',
    'الخصم (ر.س)',
    'الإجمالي النهائي (ر.س)',
    'حالة الطلب',
    'عدد المنتجات',
    'تفاصيل المنتجات',
    'ملاحظات إضافية',
    'تاريخ الطلب',
  ];

  const rows: (string | number)[][] = orders.map((o) => {
    const itemsSummary = o.items
      .map((it) => `${it.product.name} (كمية: ${it.quantity}${it.selectedColor ? `، لون: ${it.selectedColor}` : ''})`)
      .join(' | ');

    return [
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      o.governorate,
      o.city + (o.address ? ` - ${o.address}` : ''),
      o.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'تحويل بنكي / إلكتروني',
      o.subtotal,
      o.deliveryFee,
      o.discount,
      o.total,
      o.status,
      o.items.reduce((s, it) => s + it.quantity, 0),
      itemsSummary,
      o.notes || '',
      new Date(o.createdAt).toLocaleString('ar-SA'),
    ];
  });

  const allValues = [headers, ...rows];

  // 3. Write Data
  await updateSheetValues(accessToken, spreadsheetId, `'${sheetTitle}'!A1:O${allValues.length}`, allValues);

  // 4. Format Header
  await formatSheetHeader(accessToken, spreadsheetId, 0, headers.length);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    rowsCount: orders.length,
  };
}

/**
 * Exports External Product Requests ("اخترها ونحن نوصلها") to Google Sheets.
 */
export async function exportRequestsToGoogleSheets(
  accessToken: string,
  requests: ProductRequest[]
): Promise<GoogleSheetsExportResult> {
  const dateStr = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const title = `متجر الوقزة - طلبات التوفير «اخترها ونحن نوصلها» (${dateStr})`;
  const sheetTitle = 'طلبات التوفير الخارجية';

  // 1. Create Spreadsheet
  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, title, [sheetTitle]);

  // 2. Prepare Headers and Rows
  const headers = [
    'رقم الطلب',
    'اسم العميل',
    'رقم الهاتف',
    'رابط المنتج الخارجي',
    'اسم/وصف المنتج المطلوب',
    'الكمية',
    'المواصفات المطلوبة',
    'ملاحظات إضافية من العميل',
    'السعر المقترح من المتجر (ر.س)',
    'رسوم التوصيل المقترحة (ر.س)',
    'المدة التقديرية للوصول',
    'حالة الطلب',
    'موافقة العميل',
    'ملاحظات الإدارة',
    'تاريخ الطلب',
  ];

  const rows: (string | number)[][] = requests.map((r) => [
    r.requestNumber,
    r.customerName,
    r.customerPhone,
    r.productUrl,
    r.productName || '',
    r.quantity,
    r.specs || '',
    r.notes || '',
    r.quotedPrice || 'لم تُسعّر بعد',
    r.deliveryFee || 0,
    r.estimatedDays || '',
    r.status,
    r.customerAccepted === undefined ? 'بانتظار العميل' : r.customerAccepted ? 'وافق' : 'رفض',
    r.adminNotes || '',
    new Date(r.createdAt).toLocaleString('ar-SA'),
  ]);

  const allValues = [headers, ...rows];

  // 3. Write Data
  await updateSheetValues(accessToken, spreadsheetId, `'${sheetTitle}'!A1:O${allValues.length}`, allValues);

  // 4. Format Header
  await formatSheetHeader(accessToken, spreadsheetId, 0, headers.length);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    rowsCount: requests.length,
  };
}

/**
 * Exports Products Catalog to Google Sheets.
 */
export async function exportProductsToGoogleSheets(
  accessToken: string,
  products: Product[],
  categoriesMap: Record<string, string>
): Promise<GoogleSheetsExportResult> {
  const dateStr = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const title = `متجر الوقزة - كتالوج المنتجات والمخزون (${dateStr})`;
  const sheetTitle = 'المنتجات والمخزون';

  // 1. Create Spreadsheet
  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, title, [sheetTitle]);

  // 2. Prepare Headers and Rows
  const headers = [
    'معرف المنتج',
    'اسم المنتج',
    'القسم',
    'السعر الحالي (ر.س)',
    'السعر السابق (ر.س)',
    'نسبة الخصم',
    'المخزون المتوفر',
    'حالة التوفر',
    'منتج مميز',
    'عرض تخفيض',
    'الألوان المتاحة',
    'المقاسات المتاحة',
    'رابط الصورة الرئيسية',
  ];

  const rows: (string | number)[][] = products.map((p) => [
    p.id,
    p.name,
    categoriesMap[p.category] || p.category,
    p.price,
    p.originalPrice || '',
    p.discountPercent ? `${p.discountPercent}%` : '',
    p.stockCount,
    p.inStock ? 'متوفر' : 'غير متوفر',
    p.featured ? 'نعم' : 'لا',
    p.isDeal ? 'نعم' : 'لا',
    (p.colors || []).join(', '),
    (p.sizes || []).join(', '),
    p.image,
  ]);

  const allValues = [headers, ...rows];

  // 3. Write Data
  await updateSheetValues(accessToken, spreadsheetId, `'${sheetTitle}'!A1:M${allValues.length}`, allValues);

  // 4. Format Header
  await formatSheetHeader(accessToken, spreadsheetId, 0, headers.length);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    rowsCount: products.length,
  };
}
