import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

// File size limit (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('File too large:', file.size, 'bytes');
      return new NextResponse(
        JSON.stringify({ error: `File size exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB` }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Allow both text files and PDFs (PDFs will be converted to text on the client side)
    if (file.type !== 'text/plain' && file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      return new NextResponse(
        JSON.stringify({ error: 'Only .txt and .pdf files are supported.' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Process file content in memory only
    try {
      let text: string;
      
      if (file.type === 'application/pdf') {
        // For PDFs, we'll return a placeholder since PDF parsing happens on the client
        text = `[PDF file: ${file.name} - Content will be extracted on the client side]`;
      } else {
        // For text files, read the content directly
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        text = buffer.toString('utf-8');
      }
      
      console.log('Text extracted successfully');
      
      const response = new NextResponse(
        JSON.stringify({ 
          success: true,
          filename: file.name,
          content: text,
          fileType: file.type,
          fileSize: file.size
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