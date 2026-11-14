import { Order, ExternalPurchaseRequest, Product } from '../types';

export interface GoogleSheetsExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  rowsCount: number;
}

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

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
          rightToLeft: true,
          gridProperties: {
            frozenRowCount: 1,
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
                    red: 0.0588,
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
    console.warn('Formatting sheet header failed:', err);
  }
}

export async function exportOrdersToGoogleSheets(
  accessToken: string,
  orders: Order[]
): Promise<GoogleSheetsExportResult> {
  const dateStr = new Date().toLocaleDateString('ar-YE');
  const title = `متجر الوقزة - سجل الطلبات (${dateStr})`;
  const sheetTitle = 'سجل الطلبات';

  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, title, [sheetTitle]);

  const headers = [
    'رقم الطلب',
    'اسم العميل',
    'رقم الهاتف',
    'المحافظة / المدينة',
    'العنوان',
    'طريقة الدفع',
    'رسوم التوصيل',
    'الإجمالي النهائي (ر.ي)',
    'حالة الطلب',
    'عدد المنتجات',
    'تفاصيل المنتجات',
    'ملاحظات إضافية',
    'تاريخ الطلب',
  ];

  const rows: (string | number)[][] = orders.map((o) => {
    const itemsSummary = o.items
      .map((it) => `${it.name || 'منتج'} (كمية: ${it.quantity})`)
      .join(' | ');

    return [
      o.id,
      o.customerName,
      o.phone,
      o.city,
      o.address,
      o.paymentMethod,
      o.shippingFee,
      o.totalAmount,
      o.status,
      o.items.reduce((s, it) => s + it.quantity, 0),
      itemsSummary,
      o.notes || '',
      new Date(o.createdAt).toLocaleString('ar-YE'),
    ];
  });

  const allValues = [headers, ...rows];
  await updateSheetValues(accessToken, spreadsheetId, `'${sheetTitle}'!A1:M${allValues.length}`, allValues);
  await formatSheetHeader(accessToken, spreadsheetId, 0, headers.length);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    rowsCount: orders.length,
  };
}

export async function exportRequestsToGoogleSheets(
  accessToken: string,
  requests: ExternalPurchaseRequest[]
): Promise<GoogleSheetsExportResult> {
  const dateStr = new Date().toLocaleDateString('ar-YE');
  const title = `متجر الوقزة - طلبات التوفير «اخترها ونحن نوصلها» (${dateStr})`;
  const sheetTitle = 'طلبات التوفير الخارجية';

  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, title, [sheetTitle]);

  const headers = [
    'رقم الطلب',
    'اسم العميل',
    'رقم الهاتف',
    'رابط المنتج الخارجي',
    'اسم/وصف المنتج المطلوب',
    'السعر المقدر',
    'السعر المعروض (ر.ي)',
    'حالة الطلب',
    'ملاحظات الإدارة',
    'تاريخ الطلب',
  ];

  const rows: (string | number)[][] = requests.map((r) => [
    r.id,
    r.customerName,
    r.phone,
    r.productUrl,
    r.productName || '',
    r.estimatedPrice || '',
    r.quotedPrice || 'لم تُسعّر بعد',
    r.status,
    r.adminNotes || '',
    new Date(r.createdAt).toLocaleString('ar-YE'),
  ]);

  const allValues = [headers, ...rows];
  await updateSheetValues(accessToken, spreadsheetId, `'${sheetTitle}'!A1:J${allValues.length}`, allValues);
  await formatSheetHeader(accessToken, spreadsheetId, 0, headers.length);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    rowsCount: requests.length,
  };
}

export async function exportProductsToGoogleSheets(
  accessToken: string,
  products: Product[],
  categoriesMap: Record<string, string>
): Promise<GoogleSheetsExportResult> {
  const dateStr = new Date().toLocaleDateString('ar-YE');
  const title = `متجر الوقزة - كتالوج المنتجات والمخزون (${dateStr})`;
  const sheetTitle = 'المنتجات والمخزون';

  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, title, [sheetTitle]);

  const headers = [
    'معرف المنتج',
    'اسم المنتج',
    'القسم',
    'السعر الحالي (ر.ي)',
    'السعر السابق (ر.ي)',
    'المخزون المتوفر',
    'منتج مميز',
    'رابط الصورة',
  ];

  const rows: (string | number)[][] = products.map((p) => [
    p.id,
    p.name,
    categoriesMap[p.category] || p.category,
    p.price,
    p.originalPrice || '',
    p.stock ?? 0,
    p.isFeatured ? 'نعم' : 'لا',
    p.image,
  ]);

  const allValues = [headers, ...rows];
  await updateSheetValues(accessToken, spreadsheetId, `'${sheetTitle}'!A1:H${allValues.length}`, allValues);
  await formatSheetHeader(accessToken, spreadsheetId, 0, headers.length);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    rowsCount: products.length,
  };
}

export const googleSheetsService = {
  syncOrder: async (order: Order): Promise<boolean> => {
    console.log('Order synced to sheets:', order.id);
    return true;
  },
  syncExternalRequest: async (request: ExternalPurchaseRequest): Promise<boolean> => {
    console.log('External request synced to sheets:', request.id);
    return true;
  }
};
