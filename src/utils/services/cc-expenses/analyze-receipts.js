'use server';

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export async function analyzeReceipt(base64String) {
  try {
    // Remove data URI prefix if it exists
    const cleanBase64 = base64String.replace(/^data:.*?;base64,/, '');

    // Try to decode the first few bytes to check for PDF signature
    const decodedBytes = Buffer.from(cleanBase64, 'base64').toString('ascii').slice(0, 4);
    const isPDF = decodedBytes.startsWith('%PDF');

    if (isPDF) {
      const result = await analyzeImageWithAnthropic(cleanBase64);
      console.log(result);
      return {
        success: true,
        data: {
          total: result.total || '',
          date: result.date || '',
          merchant: result.merchant || '',
          summary: result.summary || '',
        },
      };
    }
    // Assume it's an image if not PDF
    const result = await analyzeImageWithOpenAI({ base64: cleanBase64 });
    return {
      success: true,
      data: {
        total: result.total || '',
        date: result.date || '',
        merchant: result.merchant || '',
        summary: result.summary || '',
      },
    };
  } catch (error) {
    console.error('Receipt analysis error:', error);
    throw error;
  }
}

export async function analyzeImageWithAnthropic(fileBase64) {
  console.log('using anthropic');
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    // defaultHeaders: {
    //   'anthropic-beta': 'pdfs-2024-09-25',
    // },
  });

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: `You are a JSON-only response system. Return ONLY a JSON object with no additional text or explanation.

The image includes a receipt, bill or invoice. Extract a JSON object with this structure:
{
  "total": "number" (The total amount charged, formatted as a positive decimal without currency symbols, including all fees, tips, and other charges as explicitly stated on the document. Do not perform any calculations to derive this number.),
  
  "date": "MM/DD/YYYY" (The transaction date must be accurately extracted from the document and formatted as MM/DD/YYYY. This date should reflect the charge date and must be within the past year or within this current month.),
  
  "merchant": "string" (Provide the general business name only, limited to 28 characters. Exclude any location details or additional descriptions. For example, use "Amazon" for transactions involving multiple merchants under Amazon's platform. Try to determine who the item was purchased from.),
  
  "summary": "string" (A short but detailed overview of the main items or categories from this purchase - e.g. "Groceries - produce, meat, dairy items and furniture", "Electronics: laptop and charger with accessories", "Restaurant order - 2 entrees, drinks, appetizer". Include key items or categories that represent the bulk of the purchase while omitting minor items. Aim to give a clear picture of what the transaction was for without listing every item. Return null if the context cannot be confidently determined.)
}

Return ONLY the JSON object with no additional text before or after. If any field cannot be confidently determined from the image, set its value to null.`,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: fileBase64,
              },
            },
            {
              type: 'text',
              text: 'Return the receipt information as JSON.',
            },
          ],
        },
      ],
    });

    // Log token usage
    console.log('Anthropic API usage:', {
      input_tokens: msg.usage.input_tokens,
      output_tokens: msg.usage.output_tokens,
      total_tokens: msg.usage.input_tokens + msg.usage.output_tokens,
    });

    // Parse the response into JSON
    let textContent = msg.content[0].text;

    // Strip markdown code blocks if present
    if (textContent.startsWith('```')) {
      textContent = textContent.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    const result = JSON.parse(textContent);
    console.log('msg.content', msg.content);
    return result;
  } catch (error) {
    console.error('Receipt analysis error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function analyzeImageWithOpenAI(imageData) {
  console.log('using openai');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini-2025-04-14',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'The image includes receipt, bill or invoice. Use the context to extract the information. Your goal is to extract relevant data to construct a JSON object with the following structure: { "total": "number" (The total amount charged, formatted as a positive decimal without currency symbols, including all fees, tips, and other charges as explicitly stated on the document. Do not perform any calculations to derive this number.), "date": "MM/DD/YYYY" (The transaction date must be accurately extracted from the document and formatted as MM/DD/YYYY. This date should reflect the charge date and must be within the past year from today\'s date.), "merchant": "string" (Provide the general business name only, limited to 28 characters. Exclude any location details or additional descriptions. For example, use "Amazon" for transactions involving multiple merchants under Amazon\'s platform. Try to determine who the item was purchased from.), "summary": "string" (A short but detailed overview of the main items or categories from this purchase - e.g. "Groceries - produce, meat, dairy items and furniture", "Electronics: laptop and charger with accessories", "Restaurant order - 2 entrees, drinks, appetizer". Include key items or categories that represent the bulk of the purchase while omitting minor items. Aim to give a clear picture of what the transaction was for without listing every item. Return null if the context cannot be confidently determined.) } Ensure the output is a valid JSON object. Return only the required fields in the JSON format specified. If any field cannot be confidently determined from the image, set its value to null.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageData.base64}`,
              },
            },
          ],
        },
      ],
      max_completion_tokens: 10000,
      response_format: { type: 'json_object' },
    });

    if (!response?.choices?.[0]?.message?.content) {
      throw new Error('Unexpected response format from OpenAI');
    }

    // Log token usage
    console.log('OpenAI API usage:', {
      prompt_tokens: response.usage?.prompt_tokens || 0,
      completion_tokens: response.usage?.completion_tokens || 0,
      total_tokens: response.usage?.total_tokens || 0,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI image analysis error:', error.message);
    throw error;
  }
}
