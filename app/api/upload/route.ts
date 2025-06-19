import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  console.log('Received upload request');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (file) {
      console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size);
    } else {
      console.log('No file in request');
    }
    
    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: 'No file uploaded' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Only allow text files for now
    if (file.type !== 'text/plain') {
      console.log('Invalid file type:', file.type);
      return new NextResponse(
        JSON.stringify({ error: 'Only .txt files are supported at this time.' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('Created uploads directory');
    } catch (error) {
      console.error('Error creating uploads directory:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to create upload directory', details: String(error) }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Save the file
    const filePath = join(uploadDir, file.name);
    try {
      await writeFile(filePath, buffer);
      console.log('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to save file', details: String(error) }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Read and extract text from the file
    try {
      const text = buffer.toString('utf-8');
      console.log('Text extracted successfully');
      
      const response = new NextResponse(
        JSON.stringify({ 
          success: true,
          filename: file.name,
          content: text
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Sending response:', response.status, response.headers.get('content-type'));
      return response;
    } catch (error) {
      console.error('Error extracting text:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to extract text from file', details: String(error) }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error in upload handler:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 