import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(req: Request) {
  try {
    const { patientName, location, volunteerName, volunteerVehicle, type, phoneNumbers } = await req.json();

    if (!accountSid || !authToken || !twilioNumber) {
      // Mocking the SMS if credentials are not provided (for demo/development)
      console.log(`[MOCK SMS] To: ${phoneNumbers.join(', ')}`);
      console.log(`Message: 🚨 ${patientName} has broadcast an SOS via MedReach. \n📍 Live location: https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`);
      return NextResponse.json({ success: true, mocked: true });
    }

    const client = twilio(accountSid, authToken);

    let messageBody = `🚨 ${patientName || "A MedReach User"} has broadcast an SOS via MedReach.
📍 Live location: https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

    if (type === "MATCHED" && volunteerName) {
      messageBody += `\n🚗 Volunteer en route: ${volunteerName} (${volunteerVehicle})`;
    }

    messageBody += `\nReply STOP to opt-out.`;

    // Send SMS to all provided emergency contacts
    const sendPromises = phoneNumbers.map((num: string) => {
      return client.messages.create({
        body: messageBody,
        from: twilioNumber,
        to: num,
      });
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to send SMS:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
