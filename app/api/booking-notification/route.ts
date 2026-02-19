import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { pickup, drop, distance, date, time, phone, tripType } = body;

        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            console.error('Telegram credentials missing');
            return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
        }

        const message = `
🚖 *New Booking Request* 🚖

*Type:* ${tripType === 'round' ? 'Round Trip 🔄' : 'One Way ➡️'}
*From:* ${pickup}
*To:* ${drop}
*Distance:* ${distance || 'Calculating...'}
*Date:* ${date}
*Time:* ${time}
*Phone:* +91${phone.replace(/\s/g, '')}

_Sent from OneWayTaxi.ai Website_
        `.trim();

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        const data = await response.json();

        if (!data.ok) {
            throw new Error(data.description || 'Telegram API Error');
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 });
    }
}
