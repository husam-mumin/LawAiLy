import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import formidable, { File as FormidableFile, Fields, Files } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextRequest) {
  return new Promise<{ file: FormidableFile }>((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req as unknown as any, (err: Error | null, fields: Fields, files: Files) => {
      if (err) return reject(err);
      resolve({ file: files.file as FormidableFile });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    // Parse the uploaded file
    const { file } = await parseForm(req);
    // Google Drive auth setup
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    const drive = google.drive({ version: 'v3', auth });
    // Upload file to Google Drive
    const res = await drive.files.create({
      requestBody: {
        name: file.originalFilename,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      },
      fields: 'id',
    });
    const fileId = res.data.id;
    // Make file public
    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });
    const url = `https://drive.google.com/file/d/${fileId}/view`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في رفع الملف إلى Google Drive' }, { status: 500 });
  }
}
