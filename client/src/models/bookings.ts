type TimeSlot = {
    start: String,
    end: String,
}

export interface Bookings{
    date: string,
    time_slot: TimeSlot,
    status: string,
    services: string[],
    amount: number,
    payment_status: string
}