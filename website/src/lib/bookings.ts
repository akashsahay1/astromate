export interface BookingData {
  serviceType: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  packageName: string;
}

// ponytail: bookings happen in the Astromate app for now; the website sends people to /auth (GetApp page).
export async function createPaidBooking(_data: BookingData, _method: string): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: "login_required" };
}
